<?php 

namespace VisualSource\Service;

use Psr\Http\Message\ResponseInterface;
use League\Route\Strategy\ApplicationStrategy;

class CORSStrategy extends ApplicationStrategy {
    public function __construct() {
        $this->addResponseDecorator(static function (ResponseInterface $response): ResponseInterface {
            $response = $response->withAddedHeader("Access-Control-Allow-Methods","OPTIONS,GET,POST,PATCH,DELETE")
            ->withAddedHeader('Access-Control-Allow-Origin', $_SERVER["ORGIN_ACCESS"])
            ->withAddedHeader("Access-Control-Allow-Headers","Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
            ->withAddedHeader("Vary","Origin");
            return $response;
        });
    }
}

?>