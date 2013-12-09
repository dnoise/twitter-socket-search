<?php

namespace TSS;

/**
 * Creates closure for search service to run
 */
class SearchServiceFactory
{
    /**
     * Create closure that runs in event loop. It iterates over clients and updates them as necessary.
     *
     * @param \SplObjectStorage $clients
     * @param TwitterClient     $twitterClient
     *
     * @return callable
     */
    public static function create(\SplObjectStorage $clients, TwitterClient $twitterClient)
    {
        $searchService = new SearchService($twitterClient);

        /**
         * Iterate through each client and send them their updates if needed
         */
        return function () use ($clients, $searchService) {

            $clients->rewind();
            while ($clients->valid()) {
                $connection = $clients->current();
                /** @type SearchContext $searchContext */
                $searchContext = $clients[$connection];

                if ($searchContext->needsUpdate() && $searchContext->hasQuery()) {
                    echo "Sending update... \n";
                    $message = $searchService->getUpdate($searchContext);
                    if ($message !== null) {
                        $connection->send($message);
                    }
                }

                $clients->next();
            }
        };
    }
}
 