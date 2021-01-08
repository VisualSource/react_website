<?php 
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header('Content-Type: application/json');
    error_reporting(E_ALL & ~E_NOTICE);

    require_once './common.php';

    function fetch_token(){
        try {
            $auth = file_get_contents("../../auth/auth0.json");
            $request = curl_POST("https://visualsource.auth0.com/oauth/token", array("content-type: application/json"),$auth);
            if($request['type']){
                throw new Exception("Invaild - 1");
            }else{
                return $request["access_token"];
            }
        } catch (\Throwable $th) {
        throw $th;
        }
    }

    if(isset($_GET["user"])){
       try {
        $token = fetch_token();
        $reponse = curl_GET('https://visualsource.auth0.com/api/v2/users?q=name:"'. $_GET["user"] . '"&search_engine=v3&per_page=1',array('Content-Type: application/json',"authorization: Bearer " . $token));
       
        if(sizeof($reponse) === 0){
            echo json_encode(array("type"=>"error","code"=>404,"msg"=>"No user with username: " . $_GET["user"]));
        }else{
            echo json_encode(array("name"=>$reponse[0]["name"],"picture"=>$reponse[0]["picture"],"sub"=>$reponse[0]["user_id"]));
        }
       } catch (\Throwable $th) {
            echo json_encode(array("type"=>"error","code"=>500,"msg"=>"Unknown - Error"));
       }
    }else{
        http_response_code(404);
        echo json_encode(array("type"=>"error","code"=>400,"msg"=>"user param not set"));
    }

    




    

?>