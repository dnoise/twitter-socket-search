var Tweet = Backbone.Model.extend({

  /**
   * Overriding constructor so we can decorate the tweet text and date before storing
   */
  constructor: function() {
    var tweetData = arguments[0];
    if (tweetData) {
      tweetData.text = this.linkify(tweetData);
      tweetData.createdAt = this.formatDate(tweetData.createdAt);
    }
    Backbone.Model.apply(this, arguments);
  }
});
_.extend(Tweet.prototype, FormatDateMixin);
_.extend(Tweet.prototype, LinkifyTweetMixin);