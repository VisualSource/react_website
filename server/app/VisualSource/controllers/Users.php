<?php 

namespace VisualSource\Controller;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Laminas\Diactoros\Response\JsonResponse;
use Laminas\Diactoros\Response;
use VisualSource\Exception\InternalServerErrorException;
use League\Route\Http\Exception\BadRequestException;
use League\Route\Http\Exception\UnauthorizedException;
class Users {
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

        fwrite($file,json_encode(array('token'=> $token["access_token"], 'fetched' => (new \DateTime("NOW"))->format("c") )));
        fclose($file);

        return $token["access_token"];
    }
    private function getManagmentToken() {
        if(file_exists(__DIR__ . "/../../../cache.json"))
        {
            $raw = file_get_contents(__DIR__ . "/../../../cache.json");

            $json = json_decode($raw,true);

            $diff = strtotime((new \DateTime("NOW"))->format("c")) - strtotime($json["fetched"]);

            if($diff < 36000) {
                return $json["token"];
            }else {
                return $this->fetchAndCacheToken();
            }
        }else{
            return $this->fetchAndCacheToken();
        }
    }
    public function getUser(ServerRequestInterface $req, array $args): ResponseInterface {
        try {
            if(empty($args)) throw new BadRequestException();

            $client = new \GuzzleHttp\Client();

            $token = $this->getManagmentToken();

            $response = $client->request('GET', "https://visualsource.auth0.com/api/v2/users/" . urldecode($args["id"]) . "?fields=name%2Cuser_id%2Cpicture%2Cuser_metadata&include_fies=true",
                            [
                                'headers'  => [
                                    'authorization' => "Bearer " . $token
                                ]
                            ]
                        );

            //print_r($response);

            $code = $response->getStatusCode();

            return match($code) {
                200 => new Response($response->getBody(),200,["Content-Type"=>"application/json"]),
                401 => new JsonResponse([ "status_code" => 401, "reason_phrase" => "Unauthorized" ],401),
                403 => new JsonResponse([ "status_code" => 403, "reason_phrase" => "Forbidden" ],403),
                404 => new JsonResponse([ "status_code" => 404, "reason_phrase" => "Not Found" ],404),
                429 => new JsonResponse([ "status_code" => 429, "reason_phrase" => "Too Many Requests" ],429),
                default => new JsonResponse([ "status_code" => 400, "reason_phrase" => "Bad Request" ],400)
            };
        } catch (\Throwable $th) {
            if($th instanceof \League\Route\Http\Exception) {
                return $th->buildJsonResponse(new Response());
            }

            $error = new InternalServerErrorException();
            if($_SERVER["SERVER_ENV"] == "develepment") { 
                $res = new JsonResponse([
                    "error_name" => get_class($th),
                    "message" => $th->getMessage(),
                    "file" => $th->getFile(),
                    "line" => $th->getLine(),
                    "error_code" => $th->getCode(),
                    "http_code" => $error->getStatusCode()
                ],$error->getStatusCode(),["X-api-error" => get_class($th)]);

                return $res;
            }
            
            return $error->buildJsonResponse(new Response()); 
        }
    }
    public function updateUser(ServerRequestInterface $req, array $args): ResponseInterface {
        try {
            if(empty($args)) throw new BadRequestException();

            if($req->user["sub"] != $args["id"]) throw new UnauthorizedException();

            $token = $this->getManagmentToken();
            $client = new \GuzzleHttp\Client();

            $body = json_decode(file_get_contents('php://input'),true);

            if(
                array_key_exists("verify_email",$body) || 
                array_key_exists("phone_verified",$body) || 
                array_key_exists("email_verified",$body) || 
                array_key_exists("blocked",$body) ||
                array_key_exists("app_metadata",$body)
            ) throw new BadRequestException();

            $response = $client->request('PATCH', "https://visualsource.auth0.com/api/v2/users/" . $req->user["sub"],
                        [
                            'headers'  => [
                                'content-type' => 'application/json',
                                'authorization' => "Bearer " . $token 
                            ],
                            'body' => file_get_contents('php://input')
                        ]
                    );

            $code = $response->getStatusCode();


            return match($code) {
                200 => new JsonResponse([ "status_code" => 202, "reason_phrase" => "Accepted" ],202),
                401 => new JsonResponse([ "status_code" => 401, "reason_phrase" => "Unauthorized" ],401),
                403 => new JsonResponse([ "status_code" => 403, "reason_phrase" => "Forbidden" ],403),
                404 => new JsonResponse([ "status_code" => 404, "reason_phrase" => "Not Found" ],404),
                429 => new JsonResponse([ "status_code" => 429, "reason_phrase" => "Too Many Requests" ],429),
                default => new JsonResponse([ "status_code" => 400, "reason_phrase" => "Bad Request" ],400),
            };

        } catch (\Throwable $th) {
            if($th instanceof \League\Route\Http\Exception) {
                return $th->buildJsonResponse(new Response());
            }

            $error = new InternalServerErrorException();
            if($_SERVER["SERVER_ENV"] == "develepment") { 
                $res = new JsonResponse([
                    "error_name" => get_class($th),
                    "message" => $th->getMessage(),
                    "file" => $th->getFile(),
                    "line" => $th->getLine(),
                    "error_code" => $th->getCode(),
                    "http_code" => $error->getStatusCode()
                ],$error->getStatusCode(),["X-api-error" => get_class($th)]);

                return $res;
            }
            
            return $error->buildJsonResponse(new Response()); 
        }
    }
}


?>