<?php
use Firebase\JWT\JWK;
use Firebase\JWT\JWT;


class Auth {
    private static function fetchAndCacheToken() {
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
            throw new Exception("Failed to get authorization token", 1);
        }

        $body = $response->getBody();
        $token = json_decode($body,true);
      
        $file = fopen(__DIR__ . "/../cache.json", "w"); 

        fwrite($file,json_encode(array('token'=> $token["access_token"], 'fetched' => (new DateTime("NOW"))->format("c") )));
        fclose($file);

        return $token["access_token"];
    }
    public static function getManagmentToken() {
        if(file_exists(__DIR__. "/../cache.json"))
        {
            $raw = file_get_contents(__DIR__ . "/../cache.json");

            $json = json_decode($raw,true);

            $diff = strtotime($json["fetched"]) - strtotime((new DateTime("NOW"))->format("c"));

            if($diff < 36000) {
                return $json["token"];
            }else {
                return self::fetchAndCacheToken();
            }
        }else{
            return self::fetchAndCacheToken();
        }
    }


    private static function getHeader(){
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['Authorization'] ?? null;

        if(!isset($authHeader)) return null;
        
        preg_match('/Bearer\s(\S+)/', $authHeader, $matches);

        if(!isset($matches[1])) return null;

        return $matches[1];

    }
    private static function getJWKs(){
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
    private static function verifyClientToken(){
        try {
            $token = self::getHeader();
            if(!isset($token)) throw new Exception("Failed to get Authorization header", 1);
            $jwks = self::getJWKs();
            if(!isset($jwks)) throw new Exception("Failed to get jwks", 1);
            $key = JWK::parseKeySet($jwks);

            $decoded = json_encode(JWT::decode($token,$key,array('RS256')));

            $data = json_decode($decoded,true);
        
            if($data["iss"] != $_SERVER["AUTH0_ISS"]) throw new Exception("iss of JWT is invaild", 1);

            return $data;
        } catch (\Throwable $th) {
            if($_SERVER["SERVER_ENV"] == "develepment") { 
                echo $th->getMessage() . " IN " . $th->getFile() . " ON " . $th->getLine();
            }
            return null;
        }
    }
    public static function process() {
        $authed = self::verifyClientToken();
       
        return array(
            'valid' => (bool)isset($authed),
            'payload' => $authed
        );
    }
}
?>