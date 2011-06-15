var View = Backbone.View.extend({
  make: function make(tagName, attributes, content) {
    var element = document.createElement(tagName || this.tagName);
    if (attributes || (attributes = this.attributes)) {
      Object.keys(attributes).forEach(function onEach(name) {
        var value = attributes[name];
        element.setAttribute(name, value);
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
  content:  '<img class="icon"/>' +
            '<div class="progress">' +
              '<div class="description"></div>' +
              '<progress max="100" value="0">'+
                '<div class="value" width="0"></div>' +
              '</progress>' +
            '</div>' +
            '<div class="controls"> ' +
              '<button class="cancel"></button> ' +
              '<button class="pause"></button> ' +
            '</div>',
  attributes: { 'class': 'download' },
  render: function render() {
    var data = this.model.toJSON();
    var icon = 'moz-icon:' + data.target + '?size=32';
    this.el.querySelector('progress').setAttribute('value', data.progress);
    this.el.querySelector('progress .value').width = data.progress + '%';
    this.el.querySelector('.description').textContent = data.description;
    this.el.querySelector('.icon').setAttribute('src', icon);
    this.el.setAttribute('data-state', data.state);
    return this;
  }
});

var AppView = View.extend({
  initialize: function AppView () {
    downloads.on("add", this.add.bind(this));
    downloads.on("remove", this.remove.bind(this));
    self.port.on("change", function(value) {
      downloads.refresh(value.downloads ? value.downloads : [ value.download ]);
    });
  },
  el: document.body,
  add: function add(model) {
    var view = new DownloadView({ model: model });
    this.el.appendChild(view.render().el);
  }
})
var appView = new AppView();
