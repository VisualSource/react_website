<?php
    require(__DIR__ . '/../vendor/autoload.php');
    require(__DIR__ . '/Response.php');
    require(__DIR__ . '/Auth0.php');

    use Dotenv\Dotenv;

    $dotenv = new DotEnv(__DIR__ . "/../");
    $dotenv->load();

    class Controller {
        private $requestMethod;
        private $path;
        private $params;
        private $db = null;
        public function __construct($requestMethod,$path,$params) {
            $this->requestMethod = $requestMethod;
            $this->path = $path;
            $this->params = $params;

            try {
                $host = $_SERVER["DB_HOST"];
                $port = $_SERVER["DB_PORT"];
                $db = $_SERVER["DB_DATABASE"];
                $user = $_SERVER["DB_USER"];
                $psd = $_SERVER["DB_PSD"];

                $this->db = new PDO("mysql:host=$host;port=$port;dbname=$db", $user, $psd);
            } catch (\PDOException $th) {
                if($_SERVER["SERVER_ENV"] == "develepment") { 
                    echo $th->getMessage() . " IN " . $th->getFile() . " ON " . $th->getLine();
                }
                $this->db = null;
            }

        }
        private function handlePaths(){
            switch ($this->path[2]) {
                case "content": {
                    require_once(__DIR__ . "/ContentApi.php");
                    $db = new ContentApi();
                    return $db->process($this->path,$this->params,$this->requestMethod);
                }
                case "users": {
                    require_once(__DIR__ . "/UsersApi.php");
                    $db = new Users();
                    return $db->process($this->path,$this->params,$this->requestMethod);
                }
                case "minecraft": {
                    require_once(__DIR__ . "/MinecraftApi.php");
                    $db = new MinecraftApi($this->db);
                    return $db->process($this->path,$this->params,$this->requestMethod);
                }
                case "games": {
                    require_once(__DIR__ . "/GamesApi.php");
                    $db = new GamesApi($this->db);
                    return $db->process($this->path,$this->params,$this->requestMethod);
                }
                case "debug": {
                    if($_SERVER["SERVER_ENV"] == "develepment"){
                        return Response::okResponse(json_encode($_SERVER));
                    }else{
                        return Response::unauthorizedResponse();
                    }
                }
                default:
                    return Response::badRequestResponse();
            }
        }
        private function postResualt($response){
            $this->db = null;
            header($response['status_code_header']);
            if ($response['body']) {
                echo $response['body'];
            }
            exit(0);
        }
        public function processRequest(){

            header("Access-Control-Allow-Origin: *");
            header("Content-Type: application/json; charset=UTF-8");
            header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
            header("Access-Control-Max-Age: 3600");
            header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

            try {
                if(sizeof($this->path) <= 2){
                    $this->postResualt(Response::badRequestResponse());
                }
    
                $response = $this->handlePaths();
    
                $this->postResualt($response);
            } catch (\Throwable $th) {
                if($_SERVER["SERVER_ENV"] == "develepment") { 
                    echo $th->getMessage() . " IN " . $th->getFile() . " ON " . $th->getLine();
                }
                $this->postResualt(Response::internalServerErrorResponse());
            }
        }
    }

?>