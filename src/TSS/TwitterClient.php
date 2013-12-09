<?php

namespace TSS;

use Guzzle\Http\Message\Response;
use Guzzle\Service\Client;

/**
 *  Handles calls to twitter to get tweets
 */
class TwitterClient
{
    const SEARCH_PATH = "search/tweets.json";

    private $client;

    /**
     * @param Client $client
     */
    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    /**
     * Get tweets for this search context. Will use the latestTweetId if it exists.
     *
     * @param SearchContext $searchContext
     *
     * @return Response|null
     */
    public function getTweets(SearchContext $searchContext)
    {
        $queryParams = $this->getQueryParams($searchContext);
        try {
            return $this->client->get(self::SEARCH_PATH, [], [
                    'query' => $queryParams
                ])->send();
        } catch (\Exception $exception) {
            // TODO: handle properly
        }

        return null;
    }

    private function getQueryParams(SearchContext $searchContext)
    {
        $queryParams = [
            'q' => urlencode($searchContext->getQuery())
        ];
        $latestTweetId = $searchContext->getLatestTweetId();
        if ($latestTweetId !== null) {
            $queryParams['since_id'] = $latestTweetId;
        }

        return $queryParams;
    }
}
 