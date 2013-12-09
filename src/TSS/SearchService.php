<?php

namespace TSS;

/**
 * Handles searching for tweets
 */
class SearchService
{
    const SEARCH_PATH = "search/tweets.json";

    /** @type TwitterClient $twitterClient */
    private $twitterClient;

    /**
     * @param TwitterClient $twitterClient
     */
    public function __construct(TwitterClient $twitterClient)
    {
        $this->twitterClient = $twitterClient;
    }

    /**
     * Get update for client based on their search context.
     * Also updates search context's latestTweetId
     *
     * @param SearchContext $searchContext
     *
     * @return null|string
     */
    public function getUpdate(SearchContext $searchContext)
    {
        $searchContext->resetLastUpdatedTimer();

        $response = $this->twitterClient->getTweets($searchContext);
        if ($response !== null) {
            $tweets = $response->json();
            $this->updateLatestTweetId($searchContext, $tweets);
            return $response->getBody(true);
        }

        return null;
    }

    private function updateLatestTweetId(SearchContext $searchContext, array $tweets)
    {
        $latestTweet = $this->getLatestTweet($tweets);
        if (isset($latestTweet['id_str'])) {
            $latestId = $latestTweet['id_str'];
            $searchContext->setLatestTweetId($latestId);
        }
    }

    private function getLatestTweet(array $tweets)
    {
        return isset($tweets['statuses'][0]) ? $tweets['statuses'][0] : null;
    }
}
 