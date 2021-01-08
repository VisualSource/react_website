<?php 
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');
    error_reporting(E_ALL & ~E_NOTICE);
    require_once "./common.php";
    function getIndex(array $values, $value){
        $index = 0;
        while($index < sizeof($values)){
            if($values[$index] === $value){
                return $index;
            }
            $index += 1;
        }
    }
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
    function user_auth(string $sub, string $token, string $type){
        $response = curl_GET("https://visualsource.auth0.com/api/v2/users/".$sub, array("Authorization: Bearer " . $token) );
        if(!isset($response["error"])){
            switch ($type) {
                case 'mc':
                    if($response["app_metadata"]["minecraft_auth"]){
                        throw new Exception("Already has auth");
                    }
                    break;
                default:
                    throw new Exception("Unkown - type");
            }
           
        }else{
            throw new Exception("Invaild - Server");
        }
    }
    function add_auth(string $sub, string $type){
        $body = null;
        switch ($type) {
            case 'mc':
                $body = array("app_metadata"=>array("minecraft_auth" => true));
                break;
            default:
                throw new Exception("Unkown Type");
        }
        $token = fetch_token();
        $request = curl_PATCH(
            "https://visualsource.auth0.com/api/v2/users/" . $sub, 
            $body, 
            array('Content-Type: application/json-patch+json',"authorization: Bearer " . $token)
        );
        if ($request['error']) {
            throw new Exception($request['message']);
        } else {
           echo json_encode(array("type"=>"info","code"=>200,"msg"=>"Accepted"));
        }

    }
    try {
        $request = json_decode(file_get_contents('php://input'),true);
        if(isset($request['sub']) && isset($request['token']) && isset($request["code"])){

            $req = preg_split('/,/',base64_decode($request["code"])); 

            user_auth($request['sub'],$request['token'],$req[0]);

            $auth = json_decode(file_get_contents("../../auth/reg_codes.json"),true);

            if(in_array($req[1],$auth[$req[0]])){
                unset($auth[$req[0]][getIndex($auth[$req[0]],$req[1])]);
                $auth[$req[0]] = array_values($auth[$req[0]]);
                file_put_contents("../../auth/reg_codes.json",json_encode($auth));
                add_auth($request['sub'],$req[0]);
            }else{
                throw new Exception("Invaild");
            }
        }
    } catch (\Throwable $th) {
        echo json_encode(array("type"=>"error","code"=>500,"msg"=>$th->getMessage()));
    }    
    
?>