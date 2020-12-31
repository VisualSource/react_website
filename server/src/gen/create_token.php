<?php
  set_include_path('/mnt/c/Webprojects/website2/server/');
  require 'vendor/firebase/php-jwt/src/JWT.php';

    use \Firebase\JWT\JWT;
    $key = json_decode(file_get_contents("../config.json"),true);
  
    $payload = array(
        "iss" => "visualsource",
        "sub" => "minecraft",
        "aud" => "vs",
        "iat" => 1356999524,
        "nbf" => 1357000000
    );

    $jwt = JWT::encode($payload, $key['key']);

    print_r($jwt);


?>