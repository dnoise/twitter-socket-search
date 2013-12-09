var LinkifyTweetMixin = {

  /**
   * Take tweet text and add links for hashtags, users, and urls.
   * @param tweet
   * @returns String
   */
  linkify: function(tweet) {
    // With help from https://gist.github.com/wadey/442463
    if (!(tweet.entities)) {
      return _.escape(tweet.text)
    }

    /*
     * Use retweeted status for retweets and then we'll prepend the "RT @user: " later.
     * See https://dev.twitter.com/docs/entities#retweets
     */
    var tweetEntities = tweet.retweetedStatus ? tweet.retweetedStatus.entities : tweet.entities;

    var entities = [];
    $.each(tweetEntities.urls, this.getIterator(entities, this.createEntity, this.linkifyUrl));
    $.each(tweetEntities.hashtags, this.getIterator(entities, this.createEntity, this.linkifyHashtag));
    $.each(tweetEntities.user_mentions, this.getIterator(entities, this.createEntity, this.linkifyUser));

    var sortedEntities = _.sortBy(entities, function(entity) {
      return entity.startIndex;
    });

    var linkifiedText = this.buildLinkifiedText(sortedEntities, tweet);
    if (tweet.retweetedStatus) {
      var originalUser = tweet.retweetedStatus.user.screen_name;
      var escapedUser = _.escape(originalUser);
      linkifiedText = "RT <a href='http://twitter.com/" + escapedUser + "'>@" + escapedUser + "</a>: " + linkifiedText
    }

    return linkifiedText;
  },

  /**
   * Given a sorted list of entity objects, build up the text.
   */
  buildLinkifiedText: function(sortedEntities, tweet) {
    var i = 0;
    var length = sortedEntities.length;
    var linkifiedText = '';
    var lastEntityEndIndex = 0;
    var tweetText = tweet.retweetedStatus ? tweet.retweetedStatus.text : tweet.text;

    for (i = 0; i < length; i++) {
      var entity = sortedEntities[i];
      linkifiedText += tweetText.substring(lastEntityEndIndex, entity.startIndex) + entity.text;
      lastEntityEndIndex = entity.endIndex;
    }
    linkifiedText += tweetText.substr(lastEntityEndIndex);
    return linkifiedText;
  },

  linkifyUrl: function(entity) {
    var escapedUrl = _.escape(entity.url);
    return "<a href='" + escapedUrl + "'>" + escapedUrl + "</a>"
  },

  linkifyHashtag: function(entity) {
    /*
     * NOTE: encodeURIComponent does not encode the ' character but does encode ".
     * To deal with this, I'm using " in my html for the href attribute so it won't be subject to injection
     */
    return '<a href="http://twitter.com/search?q=' + encodeURIComponent("#" + entity.text) + '">#' + _.escape(entity.text) + '</a>';
  },

  linkifyUser: function(entity) {
    var escapedName = _.escape(entity.screen_name);
    return "<a href='http://twitter.com/" + escapedName + "'>@" + escapedName + "</a>"
  },

  getIterator: function(entitiesList, createEntity, linkifier) {
    return function(i, entity) {
      entitiesList.push(createEntity(entity, linkifier));
    };
  },

  createEntity: function(entity, linkifier) {
    return {
      startIndex: entity.indices[0],
      endIndex: entity.indices[1],
      text: linkifier(entity)
    }
  }
};