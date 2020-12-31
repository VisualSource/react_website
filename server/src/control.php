<?php 
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');

    function curl_POST(string $url, array $headers){
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => $headers,
        ));
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);
        if ($err) {
            print_r($err);
            return array('type'=>'error', 'code'=>401, 'msg'=>"Unauthorized");
        } else {
            return json_decode($response, true);
        }
    }

    function RequestServer(string $type) {
        return array(
            'type'=>'error', 
            'code'=>501, 
            'msg'=> 'Not Implemented'
        );
    }


    $request = json_decode(file_get_contents('php://input'),true);

    if (isset($request) ){
        if (isset($request['sub']) && isset($request['token']) && isset($request['request_type'])){
            $response = curl_POST("https://visualsource.auth0.com/api/v2/users/".$request['sub'], array("Authorization: Bearer " . $request['token']) );
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