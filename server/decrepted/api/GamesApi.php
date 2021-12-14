<?php 
/**
 * Get the scores for the top players
 * GET /api/games/2048/top
 * PARAMS
 * 
 * Get the scores of a spefic player
 * GET /api/games/2048/user/{id}
 * 
 * 
 * Update the score for player in 2048
 * POST /api/games/2048/update 
 * BODY: {
 *  score: INT,
 *  user: STRING,
 *  username: STRING
 * }
 * 
 * 
 */
class GamesApi {
    private $db = null;
    public function __construct($db){
        $this->db = $db;
    }
    public function process($path,$params,$request){
        if(sizeof($path) < 3) return Response::badRequestResponse();
        
        switch ($path[3]) {
            case '2048':
                if(sizeof($path) < 4) return Response::badRequestResponse();

                switch ($path[4]) {
                    case 'update':
                       try {
                            $authHeader = null;
                            $json = file_get_contents('php://input');

                            if($request != "POST" || empty($json)) {
                                return Response::badRequestResponse();
                            }

                            $data = json_decode($json,true);
                            if(!isset($data["user"]) || !isset($data["username"]) || !isset($data["score"])) {
                                return Response::badRequestResponse();
                            }

                            $authed = Auth::process();

                            if(!$authed["valid"] || ($authed["payload"]["sub"] != $data["user"]) ){
                                return Response::unauthorizedResponse();
                            }
                            
                            $has_user = $this->db->prepare("SELECT user from game_2048 WHERE user = ?");
                            if(!$has_user->execute(array($data["user"]))){
                                return Response::internalServerErrorResponse();
                            };
                            $user = $has_user->fetchAll(PDO::FETCH_ASSOC);

                            if(empty($user)){
                                $new_user = $this->db->prepare("INSERT INTO game_2048 (user,score,username) VALUES (?, ?, ?)");
                                if(!$new_user->execute(array($data["user"],$data["score"],$data["username"]))){
                                    return Response::internalServerErrorResponse();
                                };
                            }else{
                                $update_user = $this->db->prepare("UPDATE game_2048 SET score = ?, date=current_date() WHERE user = ?");
                                if(!$update_user->execute(array($data["score"],$data["user"]))){
                                    return Response::internalServerErrorResponse();
                                }
                            }
                            
                            return Response::acceptedResponse();
                       } catch (\Throwable $th) {
                            if($_SERVER["SERVER_ENV"] == "develepment") { 
                                echo $th->getMessage() . " IN " . $th->getFile() . " ON " . $th->getLine();
                            }
                            return Response::internalServerErrorResponse();
                       }
                    case "top3":
                        try {
                            $result = $this->db->query("SELECT * from game_2048 ORDER BY score DESC LIMIT 3");
                            $data = $result->fetchAll(PDO::FETCH_ASSOC);

                            return Response::okResponse(json_encode($data));
                        } catch (\Throwable $th) {
                            if($_SERVER["SERVER_ENV"] == "develepment") { 
                                echo $th->getMessage() . " IN " . $th->getFile() . " ON " . $th->getLine();
                            }
                            return Response::internalServerErrorResponse();
                        }
                    case "top10":{
                        try {
                            $result = $this->db->query("SELECT * from game_2048 ORDER BY score DESC LIMIT 10");
                            $data = $result->fetchAll(PDO::FETCH_ASSOC);

                            return Response::okResponse(json_encode($data));
                        } catch (\Throwable $th) {
                            if($_SERVER["SERVER_ENV"] == "develepment") { 
                                echo $th->getMessage() . " IN " . $th->getFile() . " ON " . $th->getLine();
                            }
                            return Response::internalServerErrorResponse();
                        }
                    }
                    case "user":
                        try {
                            if($request != "GET" || !isset($path[5]) ) {
                                return Response::badRequestResponse();
                            }
                    
                            $user = $this->db->prepare("SELECT * from game_2048 WHERE user = ?");
                            if(!$user->execute(array($path[5]))){
                                return Response::internalServerErrorResponse();
                            };
                            $data = $user->fetchAll(PDO::FETCH_ASSOC);

                            if(!empty($data)){
                                return Response::okResponse(json_encode($data[0]));
                            }else{
                                return Response::badRequestResponse();
                            }
                        } catch (\Throwable $th) {
                            if($_SERVER["SERVER_ENV"] == "develepment") { 
                                echo $th->getMessage() . " IN " . $th->getFile() . " ON " . $th->getLine();
                            }
                            return Response::internalServerErrorResponse();
                        }
                    default:
                        return Response::badRequestResponse();
                }
            default:
                return Response::badRequestResponse();
        }
    }
}

?>