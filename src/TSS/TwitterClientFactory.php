<?php

namespace TSS;

use Guzzle\Plugin\Oauth\OauthPlugin;
use Guzzle\Service\Client;

class TwitterClientFactory
{
    /**
     * Create a twitter client with OAuth plugin
     *
     * @param array $config must contain keys: consumer_key, consumer_secret, token, and token_secret
     *
     * @return TwitterClient
     */
    public static function create(array $config)
    {
        $client = new Client('https://api.twitter.com/{version}', [
            'version' => '1.1'
        ]);

        $client->addSubscriber(
            new OauthPlugin([
                'consumer_key'    => $config['consumer_key'],
                'consumer_secret' => $config['consumer_secret'],
                'token'           => $config['token'],
                'token_secret'    => $config['token_secret']
            ])
        );

        return new TwitterClient($client);
    }
}
 