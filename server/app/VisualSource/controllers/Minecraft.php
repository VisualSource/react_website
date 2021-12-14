<?php 

namespace VisualSource\Controller;

use Exception;
use xPaw\MinecraftPing;
use xPaw\MinecraftPingException;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Laminas\Diactoros\Response\JsonResponse;

class Minecraft {
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
    private function queryDB($query){
        try {
            $db = $this->getDB();
            if(!isset($db))  throw new \VisualSource\Exception\InternalServerErrorException();

            $result = $db->query($query);

            $data = $result->fetchAll(\PDO::FETCH_ASSOC);

            $list = array();

            foreach($data as $item){
                array_push($list,array(
                    "id" => (int)$item["id"],
                    "name" => $item["name"],
                    "description" => $item["description"],
                    "icon" => $item["icon"],
                    "state" => $item["state"],
                    "required" => json_decode($item["required"],true),
                    "images" => json_decode($item["images"],true),
                    "links" => json_decode($item["links"],true),
                    "type" => $item["type"],
                    "added" => $item["added"]
                ));
            }

            return $list;
            
        } catch (\Throwable $th) {
            if($_SERVER["SERVER_ENV"] == "develepment") throw $th;
            throw new \VisualSource\Exception\InternalServerErrorException();
        }
    }
    private function getResource(string $type, array $args): array {
        if(empty($args)) {
            return $this->queryDB('SELECT * FROM server_resources WHERE type="'. $type . '"');    
        }
        switch ($args["sort"]) {
            case "active":
                return $this->queryDB('SELECT * FROM server_resources WHERE type="' . $type . '" AND state="active"');  
            case "rejected":
                return $this->queryDB('SELECT * FROM server_resources WHERE type="' . $type . '" AND state="rejected"');  
            case "admited":
                return $this->queryDB('SELECT * FROM server_resources WHERE type="' . $type . '" AND state="admited"');  
            case  "removed":
                return $this->queryDB('SELECT * FROM server_resources WHERE type="' . $type . '" AND state="removed"');
            default:
                throw new \League\Route\Http\Exception\BadRequestException();
        } 
    }
    public function query(ServerRequestInterface $req): array {
        try {
            $Query = new MinecraftPing( $_SERVER["QUERY_MC_SERVER"], 25565 );
            $Data = $Query->Query();

            $Favicon = "";
            if($Data["favicon"]){
                $Favicon = $Data["favicon"];
            }

            $users = array();

            if($Data["players"]["sample"]){
                foreach($Data["players"]["sample"] as $Player){ 
                    array_push($users,$Player["name"]);
                }
            }

            if( $Query ){
                $Query->Close();
            }

            return [
                "description" => $Data["description"],
                "players" => array(
                    "max" => $Data["players"]["max"],
                    "online" => $Data["players"]["online"],
                    "users" => $users
                ),
                "version" => $Data["version"],
                "favicon" => $Favicon
            ];

        } catch (\Throwable $th) {
            if($_SERVER["SERVER_ENV"] == "develepment") throw $th;
            return [
                "description" => "",
                "players" => array(
                    "max" => 0,
                    "online" => 0,
                    "users" => array()
                ),
                "version" => array(),
                "favicon" => ""
            ];
        }
     }   
    public function maps(ServerRequestInterface $req): array {
        try {
            $raw = file_get_contents(__DIR__ . "/../../../db/minecraft.json");
            $maps = json_decode($raw,true);
            return $maps['maps'];
        } catch (\Throwable $th) {
            if($_SERVER["SERVER_ENV"] == "develepment") throw $th;
            throw new \VisualSource\Exception\InternalServerErrorException();
        }
    }
    public function updated(ServerRequestInterface $req): ResponseInterface {
        try {
            $raw = file_get_contents(__DIR__ . "/../../../db/minecraft.json");
            $maps = json_decode($raw,true);
            $response = new \Laminas\Diactoros\Response;
            $response->getBody()->write(json_encode($maps['updated']));
            $response = $response->withHeader("Content-Type","application/json");
            return $response;
        } catch (\Throwable $th) {
            if($_SERVER["SERVER_ENV"] == "develepment") throw $th;
            throw new \VisualSource\Exception\InternalServerErrorException();
        }
    }
    public function datapacks(ServerRequestInterface $req, array $args): array {
        return $this->getResource("datapack",$args);
    } 
    public function all(ServerRequestInterface $req, array $args): array {
        if(empty($args)) {
            return $this->queryDB("SELECT * FROM server_resources"); 
        }

        switch ($args["sort"]) {
            case "active":
                return $this->queryDB('SELECT * FROM server_resources WHERE state="active"');  
            case "rejected":
                return $this->queryDB('SELECT * FROM server_resources WHERE state="rejected"');
            case "admited":
                return $this->queryDB('SELECT * FROM server_resources WHERE state="admited"');  
            case  "removed":
                return $this->queryDB('SELECT * FROM server_resources WHERE state="removed"');  
            default:{
                throw new \League\Route\Http\Exception\BadRequestException();
            }
        } 
    }
    public function resourcepacks(ServerRequestInterface $req, array $args): array {
        return $this->getResource("resourcepack",$args);
    }
    public function mods(ServerRequestInterface $req, array $args): array {
        return $this->getResource("mod",$args);
    }
    public function plugins(ServerRequestInterface $req, array $args): array {
        return $this->getResource("plugin",$args);
    }
} 


?>