<?php

namespace VisualSource\Service;

use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\JsonResponse;
use League\Route\Http\Exception\UnauthorizedException;
use VisualSource\Exception\InternalServerErrorException;

class AuthMiddleware implements MiddlewareInterface {
    private function fetchAndCacheToken(){
        $client = new \GuzzleHttp\Client();
        $response = $client->request('POST', 'https://visualsource.auth0.com/oauth/token',
            [
                'headers'  => ['content-type' => 'application/json'],
                'json' => [
                    'client_id' => $_SERVER["AUTH0_CLIENT_ID"],
                    'client_secret' => $_SERVER["AUTH0_CLIENT_SECRET"],
                    'audience' => "https://visualsource.auth0.com/api/v2/",
                    'grant_type' => "client_credentials"
                ]
            ]
        );

        if($response->getStatusCode() != 200){
            throw new \Exception("Failed to get authorization token", 1);
        }

        $body = $response->getBody();
        $token = json_decode($body,true);
      
        $file = fopen(__DIR__ . "/../../../cache.json", "w"); 

        fwrite($file,json_encode(
            array(
                'token'=> $token["access_token"], 
                'fetched' => (new \DateTime("NOW"))->format("c") 
            )
        ));
        fclose($file);

        return $token["access_token"];
    }
    private function getHeader($headers){
        $authHeader = $headers['HTTP_AUTHORIZATION'] ?? $headers['Authorization'] ?? null;

        if(!isset($authHeader)) return null;
        
        preg_match('/Bearer\s(\S+)/', $authHeader, $matches);

        if(!isset($matches[1])) return null;

        return $matches[1];

    }
    private function getJWKs(){
        try {
            $client = new \GuzzleHttp\Client();
            $response = $client->request('GET', 'https://visualsource.auth0.com/.well-known/jwks.json');

            if($response->getStatusCode() == 200){
                $jwks = json_decode($response->getBody(),true);
                return $jwks;
            }
            return null;
        } catch (\Throwable $th) {
            if($_SERVER["SERVER_ENV"] == "develepment") { 
                echo $th->getMessage() . " IN " . $th->getFile() . " ON " . $th->getLine();
            }
            return null;
        }
    }
    /**
     * {@inheritdoc}
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        try {
           $auth_token = $this->getHeader($request->getServerParams());

           if(!isset($token)) throw new UnauthorizedException();
            $jwks = $this->getJWKs();
           if(!isset($jwks)) throw new InternalServerErrorException();

            $key = JWK::parseKeySet($jwks);

            $decoded = json_encode(JWT::decode($token,$key,array('RS256')));

            if($data["iss"] != $_SERVER["AUTH0_ISS"]) throw new UnauthorizedException();

            $data = json_decode($decoded,true);

            $request->user = $data;

            return $handler->handle($request);
        } catch (\League\Route\Http\Exception\UnauthorizedException $th) {
            return $th->buildJsonResponse(new Response());
        } catch (\VisualSource\Exception\InternalServerErrorException $th){
            return $th->buildJsonResponse(new Response());
        }
    }
}



?>