var FormatDateMixin = {
  /**
   * Format a tweet date from "Mon Sep 24 03:35:21 +0000 2012" to, for example, 30s or 30m or 30h.
   * If date is over 24 hours, the original date format is used.
   */
  formatDate: function(date) {
    // from http://widgets.twimg.com/j/1/widget.js
    var Browser = function() {
      var a = navigator.userAgent;
      return {
        ie: a.match(/MSIE\s([^;]*)/)
      }
    }();

    // with help from http://stackoverflow.com/questions/6549223/javascript-code-to-display-twitter-created-at-as-xxxx-ago
    var inputTime = new Date(Date.parse(date));
    var currentTime = new Date();
    if (Browser.ie) {
      inputTime = Date.parse(date.replace(/( \+)/, ' UTC$1'))
    }
    var diff = Math.floor((currentTime - inputTime) / 1000);
    if (diff < 60) {
      return diff + "s";
    }
    if (diff < 60 * 60) {
      return (Math.round(diff / 60)) + "m";
    }
    if (diff < 60 * 60 * 24) {
      return (Math.round(diff / 60 / 60)) + "h";
    }
    return inputTime;
  }
};