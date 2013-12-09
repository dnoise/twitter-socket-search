twitter-socket-search
=====================

This artisanally crafted web application does what no other application has attempted to do: **search twitter**.

### Steps to build
* `composer install`
* `npm install`
* `gulp` builds resources to web/
* `cp config/config.yml.dist config/config.yml` and fill out your twitter API keys

Two servers have to be running, one as a file server and the other as a socket server.
* `php -S 0.0.0.0:8000 -t web/`
* `php bin/socket-server`

### Architecture
The view is Backbone.js and Bootstrap. The view communicates with the backend over web sockets. The websockets server is Ratchet (http://socketo.me/).

When clients connect, the server adds them to a list along with their searched query. Running in loop, the server iterates through the clients and sends updated tweets to them over their socket connection.

A client only sends a message to the server when they want to change their search term or when they want to refresh their tweets manually instead of waiting for an update.

Guzzle is used to query twitter's API.

### Known Issues
This is an attempt to play with web sockets, Ratchet, and Backbone. This is by no means a production ready architecture.

####Backend
* The current architecture of using the same PHP process to accept socket connections and also service them with new tweets is not scalable. Ideally they would be separate and communicate over something like ZeroMQ
* There is a 10s delay between updates for each client which would quickly hit twitter's API rate limits with more than a few connections
* There is not a lot of error handling


####Frontend
* Backbone architecture needs refactoring to separate concerns and make flow clear
* Some UTF-8 characters will break the JavaScript that adds urls to the hashtags, and user mentions inside the tweet. JavaScript's default UTF-8 parsing is not fully in line with Twitter's.
* Tweets display with the time since they were tweeted however when new tweets come in, that "time since" isn't updated.
* If no tweets are returned, the view is just blank. There is no error state.
* Not a lot of error handling
