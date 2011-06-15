var width, height, R, target = document.body;

function updateStream(next) {
  self.port.on("change", next);
}
var context = window.context = Raphael(target),
    marksAttr = {  stroke: "none"},
    total = 100;

// Custom Attribute
context.customAttributes.arc = function (value, total, radius) {
    var alpha = 360 / total * value,
        a = (90 - alpha) * Math.PI / 180,
        x = width / 2 + radius * Math.cos(a),
        y = height / 2 - radius * Math.sin(a),
        // color = "rgba(0, 0, 0, " + value / 100 + ")",
        // color = "hsb(".concat(Math.round(radius) / radius, ",", value / total, ", .75)"),
        path = [
          ["M", width / 2, height / 2 - radius],
          ["A", radius, radius, 0, +(alpha > 180), 1, x - 0.0001, y ]
        ];
    return { path: path };
};

var textView = window.text = context.text();
var progressView = context.path();
var progressTotalView = context.path();

var progress = 0, total = 0, downloads = 0;

updateStream(function onElement(value) {
  progressView.animate({
    arc: [
      progress = value.downloads.reduce(function(value, download) {
        return value + download.progress;
      }, 0),
      total = value.downloads.length * 100,
      R
    ]
  }, 100, ">");
  textView.attr({ text: (downloads = value.downloads.length) || '' });
});

window.addEventListener("resize", (function onResize() {
  width = height = Math.min(target.clientWidth, target.clientHeight);
  R = Math.round(width * 40 / 100);
  context.setSize(width, height);
  textView.attr({
    text: downloads || '',
    "font-size": Math.round(140 * R / 100),
    color: "rgba(0, 0, 0, 0.7)",
    x: width / 2,
    y: height / 2
  });
  progressTotalView.attr({
    "stroke-width": Math.round( 30 * R / 100),
    stroke: "rgba(0, 0, 0, 0.3)",
    arc: [
      100,
      100,
      R
    ]
  });
  progressView.attr({
    "stroke-width": Math.round( 30 * R / 100),
    stroke: "rgba(0, 0, 0, 0.7)",
    arc: [
      progress,
      total,
      R
    ]
  });
  return onResize;
})(), false);
