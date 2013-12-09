var Tweets = Backbone.Collection.extend({
  model: Tweet,

  /**
   * Add a tweet to the collection from the twitter API response
   */
  addFromAPI: function(status) {
    var user = status.user;
    var tweet = new Tweet({
      screenName: user.screen_name,
      name: user.name,
      profileImageUrl: user.profile_image_url,
      text: status.text,
      createdAt: status.created_at,
      entities: status.entities,
      retweetedStatus: status.retweeted_status
    });
    this.add(tweet);

    return tweet;
  }
});
