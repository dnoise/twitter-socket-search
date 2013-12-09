"use strict";

/**
 * DISCLAIMER: If you know how to write Backbone then I apologize in advance.
 * Refactoring is needed and there's nowhere near enough separation of concerns.
 */
$(function() {
  var WEBSOCKET_SERVER = 'localhost:8888';

  var AppView = Backbone.View.extend({
    el: $("#app"),

    initialize: function() {
      _.bindAll(this, "getTweets", "addTweets", "keyPress");
      $(document).bind('keypress', this.keyPress);

      this.tweets = new Tweets();
      this.tweets.bind('reset', this.resetTweets, this);

      this.query = new Query();

      this.socket = new WebSocket('ws://' + WEBSOCKET_SERVER);
      this.socket.onmessage = this.addTweets;
      this.socket.onopen = this.getTweets;

      this.render();
    },

    events: {
      "click #search-button": "getTweets",
      "click #refresh-button": "refreshTweets"
    },

    /**
     * Retrieve query and place in input
     */
    render: function() {
      var template = _.template($("#app-template").html(), {query: this.query.get("query")});
      $("#app").html(template);
    },

    /**
     * Given the socket message, add tweets to the collection and to the page
     */
    addTweets: function(tweetMessage) {
      this.hideSpinner();
      try {
        var tweets = JSON.parse(tweetMessage.data).statuses;
        var i = tweets.length;

        // need to prepend from bottom up, so tweets are in order of newest to oldest
        while (--i >= 0) {
          var tweet = tweets[i];
          var newTweet = this.tweets.addFromAPI(tweet);
          this.prependTweet(newTweet);
        }
      } catch ($exception) {
        // TODO: handle properly
      }
    },

    /**
     * Add tweet to view at the top (hence prepend)
     */
    prependTweet: function(tweet) {
      var tweetsTemplate = _.template($("#tweets-template").html(), {tweet: tweet});
      $("#tweets").prepend(tweetsTemplate);
    },

    /**
     * Monitor keypresses and if the user presses enter in our input, call getTweets
     */
    keyPress: function(e) {
      if (e.which === 13 && $(e.target).attr('id') === 'search-input') {
        this.getTweets();
      }
    },

    showSpinner: function() {
      $('.spinner').show();
    },

    hideSpinner: function() {
      $('.spinner').hide();
    },

    /**
     * Get completely new set of tweets
     */
    getTweets: function() {
      var query = $("#search-input").val();
      if (query) {
        this.showSpinner();
        this.tweets.reset([]);
        this.query.set("query", query);
        this.send(query);
      }
    },

    /**
     * Refresh the current query with new tweets
     */
    refreshTweets: function() {
      var query = $("#search-input").val();
      if (query) {
        this.showSpinner();
        this.send(query, true);
      }
    },

    /**
     * Remove all tweets from view
     */
    resetTweets: function() {
      $('#tweets').empty();
    }
  });
  _.extend(AppView.prototype, SocketMixin);

  var app = new AppView();
});