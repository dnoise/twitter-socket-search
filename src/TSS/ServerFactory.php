<?php

namespace TSS;

use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

/**
 * Creates server
 */
class ServerFactory
{
    /** Time between search service being run in event loop (seconds) */
    const LOOP_TIMER = 1;

    /**
     * Create server that handles client connections and messages and also runs search service in event loop
     *
     * @param \SplObjectStorage $clients
     * @param callable          $searchService
     * @param array             $config
     *
     * @return IoServer
     */
    public static function create(\SplObjectStorage $clients, \Closure $searchService, array $config)
    {
        $server = IoServer::factory(
            new HttpServer(
                new WsServer(
                    new ClientHandler($clients)
                )
            ),
            $config['websocket_port']
        );

        $server->loop->addPeriodicTimer(self::LOOP_TIMER, $searchService);

        return $server;
    }
}
 