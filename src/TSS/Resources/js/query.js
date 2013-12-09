var LOCAL_STORAGE_QUERY_KEY = 'query';

var Query = Backbone.Model.extend({
  initialize: function() {
    this.set("query", this.loadFromStorage());
    this.on("change:query", function(model) {
      this.saveToStorage(model.get("query"))
    })
  },
  loadFromStorage: function() {
    return localStorage.getItem(LOCAL_STORAGE_QUERY_KEY);
  },
  saveToStorage: function(query) {
    localStorage.setItem(LOCAL_STORAGE_QUERY_KEY, query);
  }
});