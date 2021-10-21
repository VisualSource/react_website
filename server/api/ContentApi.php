<?php 
/**
 * 
 * Returns all content
 * GET /api/content
 * 
 * Returns version of the content
 * GET /api/content/version
 * 
 * Returns the list of games
 * GET /api/content/games
 * 
 * Returns the list of projects
 * GET /api/content/projects
 * 
 */
class ContentApi {
    private $db = "";
    public function __construct() {
        $this->db = file_get_contents(__DIR__ . "/../db/db.json");        
    }
    public function process($path,$params,$method){
        if(sizeof($path) <= 3) {return Response::okResponse($this->db);}
        
        switch ($path[3]) {
            case 'version':
                $data = json_decode($this->db,true);
                return Response::okResponse(json_encode($data['version']));
            case "games":
                $data = json_decode($this->db,true);
                return Response::okResponse(json_encode($data['games']));
            case "projects":
                $data = json_decode($this->db,true);
                return Response::okResponse(json_encode($data['projects']));
            default:
                return Response::badRequestResponse();
        }
    }
}


?>