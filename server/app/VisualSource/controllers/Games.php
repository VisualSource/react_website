<?php 

namespace VisualSource\Controller;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use League\Route\Http\Exception\BadRequestException;
use League\Route\Http\Exception\NotFoundException;
use League\Route\Http\Exception\UnauthorizedException;
use VisualSource\Exception\InternalServerErrorException;
use Laminas\Diactoros\Response\JsonResponse;
use Laminas\Diactoros\Response;

class Games {
    private function getDB(){
        $db = null;
        $host = $_SERVER["DB_HOST"];
        $port = $_SERVER["DB_PORT"];
        $db = $_SERVER["DB_DATABASE"];
        $user = $_SERVER["DB_USER"];
        $psd = $_SERVER["DB_PSD"];

        $db = new \PDO("mysql:host=$host;port=$port;dbname=$db", $user, $psd);
        return $db;
    }
    private function getPlacement($about): ResponseInterface {
        try {
            $db = $this->getDB();

            $result = $db->query("SELECT * from game_2048 ORDER BY score DESC LIMIT " . $about);
            $data = $result->fetchAll(\PDO::FETCH_ASSOC);

            return new JsonResponse($data);

        } catch (\Throwable $th) {
            $error = new InternalServerErrorException();
            if($_SERVER["SERVER_ENV"] == "develepment") { 
                $res = new JsonResponse([
                    "error_name" => get_class($th),
                    "message" => $th->getMessage(),
                    "file" => $th->getFile(),
                    "line" => $th->getLine(),
                    "error_code" => $th->getCode(),
                    "http_code" => $th->getStatusCode() ?? $error->getStatusCode(),
                    "trace" => $th->getTraceAsString()
                ],$error->getStatusCode(),["X-api-error" => get_class($th)]);

                return $res;
            }

            return $error->buildJsonResponse(new Response()); 
        }
    }
    public function TopTen(ServerRequestInterface $request): ResponseInterface {
        return $this->getPlacement("10");
    }
    public function TopThree(ServerRequestInterface $request): ResponseInterface {
       return $this->getPlacement("3");
    }
    public function GetUser(ServerRequestInterface $request, array $args): ResponseInterface {
        try {
            if(empty($args)) throw new BadRequestException();
            
            $db = $this->getDB();

            $user = $db->prepare("SELECT * from game_2048 WHERE user = ?");
            
            if(!$user->execute([ urldecode($args["id"]) ])) throw new InternalServerErrorException();

            $data = $user->fetchAll(\PDO::FETCH_ASSOC);

            if(empty($data)) throw new NotFoundException();

            return new JsonResponse($data[0]);
            
        } catch (\Throwable $th) {
            $error = new InternalServerErrorException();
            if($_SERVER["SERVER_ENV"] == "develepment") { 
                $res = new JsonResponse([
                    "error_name" => get_class($th),
                    "message" => $th->getMessage(),
                    "file" => $th->getFile(),
                    "line" => $th->getLine(),
                    "error_code" => $th->getCode(),
                    "http_code" => $th->getStatusCode() ?? $error->getStatusCode(),
                    "trace" => $th->getTraceAsString()
                ],$error->getStatusCode(),["X-api-error" => get_class($th)]);

                return $res;
            }

            if($th instanceof \League\Route\Http\Exception) {
                return $th->buildJsonResponse(new Response());
            }
            
            return $error->buildJsonResponse(new Response()); 
        }
    }
    public function Update(ServerRequestInterface $request): ResponseInterface {
        try {
            $json = file_get_contents('php://input');
            if(empty($json)) throw new BadRequestException();

            $data = json_decode($json,true);

            if(!isset($data["user"]) || !isset($data["username"]) || !isset($data["score"])) {
                throw new BadRequestException();
            }

            if($req->user["sub"] != $data["user"] ){
                throw new UnauthorizedException();
            }

            $db = $this->getDB();
            $has_user = $db->prepare("SELECT user from game_2048 WHERE user = ?");
            if(!$has_user->execute(array($data["user"]))){
                throw new InternalServerErrorException();
            }

            $user = $has_user->fetchAll(\PDO::FETCH_ASSOC);

            if(empty($user)){
                $new_user = $db->prepare("INSERT INTO game_2048 (user,score,username) VALUES (?, ?, ?)");
                if(!$new_user->execute(array($data["user"],$data["score"],$data["username"]))){
                    throw new InternalServerErrorException();
                };
            }else{
                $update_user = $db->prepare("UPDATE game_2048 SET score = ?, date=current_date() WHERE user = ?");
                if(!$update_user->execute(array($data["score"],$data["user"]))){
                    throw new InternalServerErrorException();
                }
            }

            return new Response('Accepted',202);
        } catch (\Throwable $th) {
            $error = new InternalServerErrorException();
            if($_SERVER["SERVER_ENV"] == "develepment") { 
                $res = new JsonResponse([
                    "error_name" => get_class($th),
                    "message" => $th->getMessage(),
                    "file" => $th->getFile(),
                    "line" => $th->getLine(),
                    "error_code" => $th->getCode(),
                    "http_code" => $th->getStatusCode() ?? $error->getStatusCode(),
                    "trace" => $th->getTraceAsString()
                ],$error->getStatusCode(),["X-api-error" => get_class($th)]);

                return $res;
            }

            if($th instanceof \League\Route\Http\Exception) {
                return $th->buildJsonResponse(new Response());
            }
            
            return $error->buildJsonResponse(new Response()); 
        }
    }
}


?>