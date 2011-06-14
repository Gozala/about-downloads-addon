var Model = Backbone.Model.extend({
  on: function on(type, listener) {
    return this.bind(type, listener);
  },
  removeListener: function removeListener(type, listener) {
    return this.unbind(type, listener);
  }
});
var Collection = Backbone.Collection.extend({
  on: Model.prototype.on,
  removeListener: Model.prototype.removeListener
});

var DownloadModel = Model.extend({
  initialize: function Download(options) {
    this.id = options.id;
  },
  clear: function clear() {
    this.destroy();
    this.remove();
  }
});

var Downloads = Collection.extend({
  model: DownloadModel,
  refresh: function refresh(models) {
    models.forEach(function (data) {
      var model = this.get(data.id);
      if (!model)
        this.add(new DownloadModel(data));
      else
        model.set(data);
    }, this);
  }
});

var downloads = new Downloads();
