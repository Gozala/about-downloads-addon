/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint passfail: true */

'use strict';

const { Handler } = require("protocol");
const { Panel } = require("panel");
const { Widget } = require("widget");
const { data } = require("self");
const observer = require("./downloads/observer").stream;

exports.handler = Handler({
  onRequest: function onRequest(request, response) {
    response.uri = "chrome://mozapps/content/downloads/downloads.xul";
  }
});

var panel = exports.panel = Panel({
  contentURL: data.url("panel.html"),
   contentScriptFile: [
    data.url("underscore-min.js"),
    data.url("backbone-min.js"),
    data.url("models.js"),
    data.url("views.js")
  ]
});

var widget = exports.widget = Widget({
  id: "about-downloads-button",
  label: "Dowloads",
  contentURL: data.url("progressbar.html"),
  contentScriptFile: [
    data.url("raphael.js"),
    data.url("widget-worker.js")
  ],
  panel: exports.panel
});


observer(function onChange(event) {
  widget.port.emit('change', event);
  panel.port.emit('change', event);
});

exports.handler.listen({ about: "downloads" })
