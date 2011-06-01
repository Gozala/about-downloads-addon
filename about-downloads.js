/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint passfail: true */

'use strict';

const { Handler } = require("protocol");
const { Panel } = require("panel");
const { Widget } = require("widget");
const { data } = require("self");
const { setInterval, clearInterval } = require("timers");

exports.handler = Handler({
  onRequest: function onRequest(request, response) {
    response.uri = "chrome://mozapps/content/downloads/downloads.xul";
  }
});

exports.panel = Panel({
  contentURL: "about:downloads"
});

exports.widget = Widget({
  id: "about-downloads-button",
  label: "Dowloads",
  contentURL: data.url("progressbar.html"),
  contentScriptFile: [
    data.url("raphael.js"),
    data.url("widget-worker.js")
  ],
  panel: exports.panel,
  onAttach: function onAttach(worker) {
    let id = setInterval(function() {
      worker.port.emit('change', Math.round(Math.random() * 100), 2)
    }, 1000)
    worker.on("detach", clearInterval.bind(null, id))
  },
  onDetach: console.log.bind(console, 'detach')
});
exports.handler.listen({ about: "downloads" })
