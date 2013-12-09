var SocketMixin = {
  send: function(query, refresh) {
    var message = {
      query: query
    };
    if (refresh) {
      message.refresh = true;
    }

    this.socket.send(JSON.stringify(message));
  }
};