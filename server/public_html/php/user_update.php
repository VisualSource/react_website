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


    function update_user(string $sub, array $profile, string $token){
        try {
            $request = curl_PATCH(
                "https://visualsource.auth0.com/api/v2/users/" . $sub, 
                $profile, 
                array('Content-Type: application/json-patch+json',"authorization: Bearer " . $token)
            );
            if ($request['error']) {
                throw new Exception($request['message']);
            } else {
               return array("type"=>"info","code"=>200,"msg"=>"Accepted");
            }
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    try {
        $request = json_decode(file_get_contents('php://input'),true);
        if(isset($request['sub']) && isset($request['token']) && isset($request["profile"])){
            $response = curl_GET("https://visualsource.auth0.com/api/v2/users/".$request['sub'], array("Authorization: Bearer " . $request['token']) );
            if(!isset($response["error"])){
                $token = fetch_token();
                if($token !== null){
                    echo json_encode(update_user($request['sub'],$request["profile"],$token));
                }else{
                    throw new Exception("Invaild - 5");
                }
            }else{
                throw new Exception("Invaild - 4");
            }
        }else{
            throw new Exception("Invaild - 3");
        }
    } catch (\Throwable $th) {
        echo json_encode(array("type"=>"error","code"=>500,"msg"=>$th->getMessage()));
    }
?>