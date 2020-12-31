<?php 
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');
    //error_reporting(E_ALL & ~E_NOTICE);
    set_include_path('/mnt/c/Webprojects/website2/server/');
    require 'vendor/firebase/php-jwt/src/JWT.php';

    use \Firebase\JWT\JWT;

    function curl_PATCH(string $url, array $body, array $headers){
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "PATCH",
            CURLOPT_POSTFIELDS => json_encode($body),
            CURLOPT_HTTPHEADER => $headers,
        ));
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);
        if ($err) {
            print_r($err);
            //return array('type'=>'error', 'code'=>400, 'msg'=>"Bad Request");
        } else {
           return json_decode($response, true);
        }
    }

    $request = json_decode(file_get_contents('php://input'),true);

    if (isset($request)){
        if (isset($request['code']) && isset($request['sub']) && isset($request['token'])){
            $key = json_decode(file_get_contents("./config.json"),true);
            try {
                $decoded = JWT::decode($request['code'], $key['key'], array('HS256'));
                $decoded_array = (array) $decoded;
                echo '{"type":"info","code":"204","msg":"Vaild - No Content"}';
            } catch (\Throwable $th) {
                echo '{"type":"error","code":"400","msg":"Invaild - type 3"}';
            }
        }else{
            echo '{"type":"error","code":"400","msg":"Invaild - type 2"}';
        }
    }else{
        echo '{"type":"error","code":"400","msg":"Invaild - type 1"}';
    }

?>