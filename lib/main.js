// vim:ts=2:sts=2:sw=2:

'use strict'

const { Handler } = require("protocol");

exports.handler = Handler({
  onRequest: function onRequest(request, response) {
    response.uri = "chrome://mozapps/content/downloads/downloads.xul";
  }
});

exports.handler.listen({ about: "downloads" })
