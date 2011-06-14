"use strict";

const { components: { Constructor: CC } } = require("chrome");
const dowloadManager = CC("@mozilla.org/download-manager;1",
                          "nsIDownloadManager")();
const unload = require("unload");


/**
 * Returns normalized, JSON serializeable version of given `nsIDownload`.
 * @see https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsIDownload
 * @param {nsIDownload} download
 * @returns {JSON}
 */
function Download(download) {
  let { id, displayName, amountTransferred, percentComplete, state, MIMEInfo,
        referrer, size, source, speed, startTime, target } = download;

  return {
    /**
     * The ID by which the download is identified uniquely in the database
     * @type {Number}
     */
    id: id,
    /**
     * A user-readable description of the transfer.
     * @type {String}
     */
    description: String(displayName),
    /**
     * The number of bytes downloaded so far.
     * @type {Number}
     */
    transferred: amountTransferred,
    /**
     * The total size of the file in bytes, or `null` if the file's size is
     * unknown.
     * @type {Number|null}
     */
    size: size === -1 ? null : size,
    /**
     * The percentage of the file transfer that has been completed, or `null`
     * if the file's size is unknown.
     */
    progress: size === -1 ? null : percentComplete,
    /**
     * The downloads transfer speed in bytes per second.
     * @type {Number}
     */
    speed: speed,
    /**
     * The downloads current state. See [nsIDownloadManager.Constants]
     * (https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsIDownloadManager#Constants)
     * @type {Number}
     */
    state: state,
    /**
     * Targets MIME type, or `null` if unknown.
     * @type {String|null}
     */
    mime: MIMEInfo ? String(MIMEInfo.MIMEType) : null,
    /**
     * The referrer URI of the download. This is only valid for HTTP downloads,
     * and can be null.
     * @type {String|null}
     */
    referrer: referrer ? String(referrer.spec) : null,
    /**
     * The source URI of the download.
     * @type {String}
     */
    source: String(source.spec),
    /**
     * The target URI of the transfer.
     * @type {String}
     */
    target: String(target.spec),
    /**
     * The time at which the transfer was started.
     * @type {Number}
     */
    started: startTime
  };
}

function getDownloads() {
  var activeDownloads = dowloadManager.activeDownloads;
  var downloads = [];
  while (activeDownloads.hasMoreElements())
    downloads.push(Download(activeDownloads.getNext()))
  return downloads;
}

exports.stream = function stream(next, stop) {
  function onSecurityChange(progress, request, state, download) {
    next({
      type: 'security',
      active: dowloadManager.activeDownloadCount,
      download: Download(download)
    })
  }

  function onProgress(progress, request, value, maxP, total, maxT, download) {
    next({
      type: 'progress',
      downloads: getDownloads()
    })
  }

  function onStateChange(progress, request, status, state, download) {
    next({
      type: 'status',
      status: status,
      downloads: dowloadManager.activeDownloadCount,
      download: Download(download)
    })
  }

  function onDownloadStateChange(state, download) {
    next({
      type: 'state',
      previousState: state,
      downloads: dowloadManager.activeDownloadCount,
      download: Download(download)
    })
  }

  const listener = {
    onSecurityChange: onSecurityChange,
    onProgressChange: onProgress,
    onStateChange: onStateChange,
    onDownloadStateChange: onDownloadStateChange
  };

  unload.when(function onUnload() {
    try {
      dowloadManager.removeListener(listener);
      if (stop) stop();
    } catch (exception) {
      console.exception(exception);
    }
  });

  dowloadManager.addListener(listener);
}
