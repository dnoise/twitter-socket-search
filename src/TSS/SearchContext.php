<?php

namespace TSS;

/**
 * Represents a client's current search context
 */
class SearchContext
{
    /** minimum time between updates (seconds) */
    const UPDATE_INTERVAL = 10;

    private $timeLastUpdated;
    private $query;
    private $latestTweetId;

    /**
     * @param string $query
     *
     * @return $this
     */
    public function setQuery($query)
    {
        $this->query = $query;

        return $this;
    }

    /**
     * @return string
     */
    public function getQuery()
    {
        return $this->query;
    }

    /**
     * @return bool
     */
    public function hasQuery()
    {
        return $this->query !== null;
    }

    /**
     * @return bool
     */
    public function needsUpdate()
    {
        return (time() - $this->timeLastUpdated) > self::UPDATE_INTERVAL;
    }

    /**
     * Reset to current time
     *
     * @return void
     */
    public function resetLastUpdatedTimer()
    {
        $this->timeLastUpdated = time();
    }

    /**
     * @param string $latestTweetId
     *
     * @return $this
     */
    public function setLatestTweetId($latestTweetId)
    {
        $this->latestTweetId = $latestTweetId;

        return $this;
    }

    /**
     * @return null|string
     */
    public function getLatestTweetId()
    {
        return $this->latestTweetId;
    }

    /**
     * The client needs to be refreshed now. Set last updated time to 0 so
     * it looks like it hasn't ever been updated
     *
     * @return $this
     */
    public function setNeedsRefresh()
    {
        $this->timeLastUpdated = 0;

        return $this;
    }
}
 