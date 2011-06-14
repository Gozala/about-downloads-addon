var View = Backbone.View.extend({
  make: function make(tagName, attributes, content) {
    var element = document.createElement(tagName || this.tagName);
    if (attributes || (attributes = this.attributes)) {
      Object.keys(attributes).forEach(function onEach(name) {
        var value = attributes[name];
        element.setAttribute(name === 'class' ? 'classname' : name, value);
      });
    }
    element.innerHTML = content || this.content;
    return element;
  }
});

var DownloadView = View.extend({
  initialize: function DownloadView(options) {
    this.el = this.make();
    this.model.on('change', this.render.bind(this));
  },
  tagName: 'div',
  content: '<div class="description"></div>' +
           '<progress max="100" value="0"></progress>',
  className: 'dowload',
  render: function render() {
    var data = this.model.toJSON();
    this.el.querySelector("progress").setAttribute('value', data.progress);
    this.el.querySelector(".description").textContent = data.description;
    return this;
  }
});

var AppView = View.extend({
  initialize: function AppView () {
    downloads.on("add", this.add.bind(this));
    downloads.on("remove", this.remove.bind(this));
    self.port.on("change", function(value) {
      if (value.type === "progress") {
        downloads.refresh(value.downloads);
      }
    });
  },
  el: document.body,
  add: function add(model) {
    var view = new DownloadView({ model: model });
    this.el.appendChild(view.render().el);
  }
})
var appView = new AppView();
