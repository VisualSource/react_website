<?php 
    header("Access-Control-Allow-Origin: https://visualsource.000webhostapp.com/");
    header('Content-Type: application/json');
    error_reporting(E_ALL & ~E_NOTICE);
    require_once '../../vm_control.php';
    require_once './common.php';

    function RequestServer(string $type) {
        return vmControl($type);
    }


    $request = json_decode(file_get_contents('php://input'),true);

    if (isset($request) ){
        if (isset($request['sub']) && isset($request['token']) && isset($request['request_type'])){
            $response = curl_GET("https://visualsource.auth0.com/api/v2/users/".$request['sub'], array("Authorization: Bearer " . $request['token']) );
            if(isset($response)){
                if($response["app_metadata"]['minecraft_auth']){
                    $value = RequestServer($request['request_type']);
                    echo json_encode($value);
                }else{
                    echo '{"type":"error","code":"401","msg":"Unauthorized - 2"}';
                }
            }else{
                echo '{"type":"error","code":"401","msg":"Unauthorized - 1"}';
            }
        }else{
            echo '{"type":"error","code":"400","msg":"Invaild - type 2"}';
        }
    }else{
        echo '{"type":"error","code":"400","msg":"Invaild - type 1"}';
    }
?>