// vim:ts=2:sts=2:sw=2:

'use strict'

const { Handler } = require("protocol");
const { Panel } = require("panel");
const { Widget } = require("widget");

exports.handler = Handler({
  onRequest: function onRequest(request, response) {
    response.uri = "chrome://mozapps/content/downloads/downloads.xul";
  }
});

exports.panel = Panel({ contentURL: "about:downloads" });
exports.widget = Widget({
  id: "about-downloads-button",
  label: "Dowloads",
  contentURL: "chrome://browser/skin/places/searching_16.png",
  panel: exports.panel
});
exports.handler.listen({ about: "downloads" })
