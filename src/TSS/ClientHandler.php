<?php
namespace TSS;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

/**
 * Handles incoming connections and messages
 */
class ClientHandler implements MessageComponentInterface
{
    private $clients;

    /**
     * @param \SplObjectStorage $clients
     */
    public function __construct(\SplObjectStorage $clients)
    {
        $this->clients = $clients;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients[$conn] = new SearchContext();
    }

    /**
     * When a client sends us a message they've either clicked 'Refresh' or they've changed
     * their search term. We need to reset the timer so we send them data immediately.
     *
     * @param ConnectionInterface $from
     * @param string              $jsonMessage  message in format {query: 'query', refresh: true} (refresh is optional)
     */
    public function onMessage(ConnectionInterface $from, $jsonMessage)
    {
        if (isset($this->clients[$from])) {
            /** @type SearchContext $client */
            $client = $this->clients[$from];

            $message = json_decode($jsonMessage, true);
            $query = isset($message['query']) ? $message['query'] : null;
            $isRefresh = isset($message['refresh']);

            if (!$isRefresh) {
                // if it's not a refresh, then we have to clear the latest tweet id since that only
                // applied to the last search
                $client->setLatestTweetId(null);
                $client->setQuery($query);
            }

            $client->setNeedsRefresh();
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        $conn->close();
    }
}