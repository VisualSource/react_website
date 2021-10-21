<?php 
    error_reporting(E_ALL & ~E_NOTICE);
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = explode( '/', $uri );

    if ($uri[1] !== 'api') {
        if(($uri[1] == "" || $uri[1] == "index.html" || $uri[1] == "index.php")){
            try {
                if(file_exists("./index.html")){
                    readfile("./index.html");
                    exit(0);
                }else{
                    throw new Exception("Missing index.html", 1);
                }
            } catch (\Throwable $th) {
                header('HTTP/1.1 404 Not Found');
                exit(0);
            }
        } else {
            $file = "." . str_replace("../","",$_SERVER['REQUEST_URI']);
            if(file_exists($file)){
                readfile($file);
                exit(0);
            }else{
                header('HTTP/1.1 404 Not Found');
                exit(0);
            }
                
        }
    }
    require(__DIR__ . "/../api/Controller.php");
    
    $controller = new Controller($_SERVER["REQUEST_METHOD"],$uri,$_GET);
    $controller->processRequest();

?>