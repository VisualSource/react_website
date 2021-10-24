<?php 
use xPaw\MinecraftPing;
use xPaw\MinecraftPingException;
/**
 * 
 * Returns the last time the minecraft servers maps where updated
 * GET /api/minecraft/updated 
 *
 * Returns the active, rejected, and admited datapacks
 * GET /api/minecraft/datapacks 
 *      GET /api/minecraft/datapacks/active 
 *      GET /api/minecraft/datapacks/rejected 
 *      GET /api/minecraft/datapacks/admited 
 * GET /api/minecraft/plugins
 *      GET /api/minecraft/plugins/active 
 *      GET /api/minecraft/plugins/rejected 
 *      GET /api/minecraft/plugins/admited 
 * GET /api/minecraft/resourcepacks
 *      GET /api/minecraft/resourcepacks/active 
 *      GET /api/minecraft/resourcepacks/rejected 
 *      GET /api/minecraft/resourcepacks/admited 
 *
 * GET /api/minecraft/mods
 *      GET /api/minecraft/mods/active 
 *      GET /api/minecraft/mods/rejected 
 *      GET /api/minecraft/mods/admited 
 * 
 * Returns the data for the minecraft maps images
 * GET /api/minecraft/maps
 *  
 * Returns all resoures from database
 * GET /api/minecraft/all
 *      GET /api/minecraft/all/active
 *      GET /api/minecraft/all/rejected
 *      GET /api/minecraft/all/admited
 * 
 * GET /api/minecraft/query
 */
class MinecraftApi {
    private $db = null;
    public function __construct($db){
        $this->db = $db;
    }
    private function queryDB($query){
        try {
            if(isset($this->db)){
                $result = $this->db->query($query);

                $data = $result->fetchAll(PDO::FETCH_ASSOC);

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

                return Response::okResponse(json_encode($list));
            }else{
                return Response::internalServerErrorResponse();
            }
        } catch (\Throwable $th) {
            if($_SERVER["SERVER_ENV"] == "develepment") { 
                echo $th->getMessage() . " IN " . $th->getFile() . " ON " . $th->getLine();
            }
            return Response::internalServerErrorResponse();
        }
    }
    public function process($path,$params,$request){
        if(sizeof($path) < 3 || $request != "GET"){
            return Response::badRequestResponse();
        }
        switch ($path[3]) {
            case 'updated':
                try {
                    $raw = file_get_contents(__DIR__ . "/../db/minecraft.json");
                    $maps = json_decode($raw,true);
                    return Response::okResponse(json_encode($maps['updated']));
                } catch (\Throwable $th) {
                    if($_SERVER["SERVER_ENV"] == "develepment") { 
                        echo $th->getMessage() . " IN " . $th->getFile() . " ON " . $th->getLine();
                    }
                    return Response::internalServerErrorResponse();
                }
            case 'datapacks':
                switch ($path[4] ?? "default") {
                    case 'active':
                        return $this->queryDB('SELECT * FROM server_resources WHERE type="datapack" AND state="active"');  
                    case "rejected":
                        return $this->queryDB('SELECT * FROM server_resources WHERE type="datapack" AND state="rejected"');  
                    case "admited":
                        return $this->queryDB('SELECT * FROM server_resources WHERE type="datapack" AND state="admited"');  
                    default: 
                        return $this->queryDB('SELECT * FROM server_resources WHERE type="datapack"');    
                }
            case 'plugins':
                switch ($path[4] ?? "default") {
                    case 'active':
                        return $this->queryDB('SELECT * FROM server_resources WHERE type="plugin" AND state="active"');   
                    case "rejected":
                        return $this->queryDB('SELECT * FROM server_resources WHERE type="plugin" AND state="rejected"');   
                    case "admited":
                        return $this->queryDB('SELECT * FROM server_resources WHERE type="plugin" AND state="admited"');   
                    default:
                        return $this->queryDB('SELECT * FROM server_resources WHERE type="plugin"');    
                }
            case 'resourcepacks':
                switch ($path[4] ?? "default") {
                    case 'active':
                        return $this->queryDB('SELECT * FROM server_resources WHERE type="resourcepack" AND state="active"');  
                    case "rejected":
                        return $this->queryDB('SELECT * FROM server_resources WHERE type="resourcepack" AND state="rejected"');  
                    case "admited":
                        return $this->queryDB('SELECT * FROM server_resources WHERE type="resourcepack" AND state="admited"');  
                    default:
                        return $this->queryDB('SELECT * FROM server_resources WHERE type="resourcepack"');  
                }
            case 'mods':
                switch ($path[4] ?? "default") {
                    case 'active':
                        return $this->queryDB('SELECT * FROM server_resources WHERE type="mod" AND state="active"');  
                    case "rejected":
                        return $this->queryDB('SELECT * FROM server_resources WHERE type="mod" AND state="rejected"');  
                    case "admited":
                        return $this->queryDB('SELECT * FROM server_resources WHERE type="mod" AND state="admited"');  
                    default:
                        return $this->queryDB('SELECT * FROM server_resources WHERE type="mod"');  
                }
            case "all": 
                switch ($path[4] ?? "default") {
                    case 'active':
                        return $this->queryDB('SELECT * FROM server_resources WHERE state="active"');  
                    case "rejected":
                        return $this->queryDB('SELECT * FROM server_resources WHERE state="rejected"');  
                    case "admited":
                        return $this->queryDB('SELECT * FROM server_resources WHERE state="admited"');  
                    default:
                        return $this->queryDB("SELECT * FROM server_resources");   
                } 
            case "maps": {
                try {
                    $raw = file_get_contents(__DIR__ . "/../db/minecraft.json");
                    $maps = json_decode($raw,true);
                    return Response::okResponse(json_encode($maps['maps']));
                } catch (\Throwable $th) {
                    if($_SERVER["SERVER_ENV"] == "develepment") { 
                        echo $th->getMessage() . " IN " . $th->getFile() . " ON " . $th->getLine();
                    }
                    return Response::internalServerErrorResponse();
                }
            }
            case "query":{
                try {
                    $Query = new MinecraftPing( 'play.blossomcraft.org', 25565 );
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

                    return Response::okResponse(json_encode(array(
                        "description" => $Data["description"],
                        "players" => array(
                            "max" => $Data["players"]["max"],
                            "online" => $Data["players"]["online"],
                            "users" => $users
                        ),
                        "version" => $Data["version"],
                        "favicon" => $Favicon
                    )));
                } catch( MinecraftPingException $e ) {
                    return Response::okResponse(json_encode(array(
                        "description" => "",
                        "players" => array(
                            "max" => 0,
                            "online" => 0,
                            "users" => array()
                        ),
                        "version" => array(),
                        "favicon" => ""
                    )));
                }
            }
            default:
                return Response::badRequestResponse();
        }
    }
}

?>