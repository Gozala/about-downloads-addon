function init() {
var width, height, R, target = document.body;

var context = window.context = Raphael(target),
    marksAttr = {  stroke: "none"},
    total = 100;

// Custom Attribute
context.customAttributes.arc = function (value, total, radius) {
    var alpha = 360 / total * value,
        a = (90 - alpha) * Math.PI / 180,
        x = width / 2 + radius * Math.cos(a),
        y = height / 2 - radius * Math.sin(a),
        color = "rgba(0, 0, 0, " + value / 100 + ")",
        // "hsb(".concat(Math.round(radius) / radius, ",", value / total, ", .75)"),
        path;
        path = [
          ["M", width / 2, height / 2 - radius],
          ["A", radius, radius, 0, +(alpha > 180), 1, x - 0.0001, y ]
        ];
    return { path: path, stroke: color };
};

var text = window.text = context.text();
var progress = context.path();

var lastValue, lastDownloads;
function update(value, downloads) {
  lastValue = value;
  lastDownloads = downloads;
  console.log(value, downloads, width);
  progress.animate({ arc: [ value, total, R ]}, 1000, ">");
  text.attr({ text: downloads });
}

window.addEventListener("resize", (function onResize() {
  console.log("resize", target.clientWidth, target.clientHeight);
  width = height = Math.min(target.clientWidth, target.clientHeight);
  R = Math.round(width * 40 / 100);
  context.setSize(width, height);
  text.attr({
    text: lastDownloads || (lastDownloads = 0),
    "font-size": Math.round(140 * R / 100),
    x: width / 2,
    y: height / 2
  });
  progress.attr({
    "stroke-width": Math.round( 30 * R / 100),
    stroke: "#fff",
    arc: [ lastValue || (lastValue = 0), 100, R ]
  });
  return onResize;
})(), false);

window.addEventListener("hashchange", (function onHash() {
  var data = location.hash.substr(1).split('-')
  update(parseInt(data[0]), data[1] || 1)
  return onHash;
})(), false);

if (self && self.port) self.port.on("change", update)
}


if (document.readyState === "complete") init()
else window.addEventListener("load", init, false)
