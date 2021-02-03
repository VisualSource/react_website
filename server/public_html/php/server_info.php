<?php 
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');
    error_reporting(E_ALL & ~E_NOTICE);
   // require_once '../../vm_control.php';
    require_once './common.php';
    function pingServer(){
            $config = json_decode(file_get_contents('../../config.json'),true);
            $info = curl_GET("https://visualsource.herokuapp.com",array());
           
            if($info["type"] === "error"){
                return array('error' => true, 'msg' => $info['data']["description"], 'players'=> false , "current_players" => 0, "max_players"=> 0);
            }else{
                return array(
                    "error" => false,
                    "msg" => "",
                    "players" => false,
                    "current_players" => $info['data']['current_players'],
                    "max_players" => $info['data']['max_players']
                );
            } 
    }
    echo json_encode(array('type'=> 'error', 'code'=> 503, 'msg' => "Server taken offline." ));
	/*try{
        $responce = getStatus();
        $status = $responce['status'];

        if ($status === 'RUNNING') {
            $data = pingServer();
            echo json_encode(array(
                "type"=>"info",
                "code"=>208,
                "data"=> array(
                    "server" => $data,
                    "vm_status" => $status,
                    "vm_msg" => $responce['statusMessage']
                ) 
            ));
        }else{
            echo json_encode(array(
                "type"=>"info",
                "code"=>208,
                "data"=> array(
                    "server" => null,
                    "vm_status" => $status,
                    "vm_msg" => $responce['statusMessage']
                ) 
            ));
        }
	} catch( \Throwable $e ){
        echo json_encode(array('type'=> 'error', 'code'=> 503, 'msg' => "Unknown error" ));
	}*/
?>
   
