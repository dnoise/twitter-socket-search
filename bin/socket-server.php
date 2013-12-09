<?php

use Symfony\Component\Yaml\Parser;
use TSS\SearchServiceFactory;
use TSS\ServerFactory;
use TSS\TwitterClientFactory;

// require composer's autoloader
require dirname(__DIR__) . '/vendor/autoload.php';

// load configuration
$yamlParser = new Parser();
$config = $yamlParser->parse(file_get_contents(dirname(__DIR__) . '/config/config.yml'));

// clients will store all connected socket clients
$clients = new \SplObjectStorage();

// create services
$twitterClient = TwitterClientFactory::create($config);
$searchService = SearchServiceFactory::create($clients, $twitterClient);

// start server
$server = ServerFactory::create($clients, $searchService, $config);
$server->run();