<?php 
    error_reporting(E_ALL & ~E_NOTICE);
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = explode( '/', $uri );

    function display404(){
        try {
            if(file_exists("./404.min.html")){
                readfile("./404.min.html");
            }else{
                throw new Exception("Missing 404.min.html", 1);
            }
        } catch (\Throwable $th) {
            header('HTTP/1.1 404 Not Found');
            echo $th->getMessage();
            exit($th->getCode());
        }
    }

    function displayIndex() {
        try {
            if(file_exists("./index.html")){
                readfile("./index.html");
                exit(0);
            }else{
                throw new Exception("Missing index.html", 1);
            }
        } catch (\Throwable $th) {
            header('HTTP/1.1 404 Not Found');
            display404();
            exit($th->getCode());
        }
    }


    if ($uri[1] !== 'api') {
        $index = array(
            "",
            "/index.html",
            "/index.php",
            "/",
            "/news",
            "/projects",
            "/services",
            "/server/resources",
            "/signin",
            "/account",
            "/account/edit",
            "/games"
        );
        $params = array(
            "users",
            "project"
        );
        if(in_array($_SERVER['REQUEST_URI'],$index)){
            displayIndex();
        } else if(in_array($uri[1],$params) && isset($uri[2])) {
            displayIndex();
        } else {
            try {
                $file = "." . str_replace("../","",$_SERVER['REQUEST_URI']);
                if(file_exists($file)){
                    readfile($file);
                    exit(0);
                } else {
                    throw new Exception("Failed to fined file", 1);    
                }
            } catch (\Throwable $th) {
                header('HTTP/1.1 404 Not Found');
                display404();
                exit($th->getCode());
            }
        }

        exit(1);
    }
    require(__DIR__ . "/../api/Controller.php");
    
    $controller = new Controller($_SERVER["REQUEST_METHOD"],$uri,$_GET);
    $controller->processRequest();

?>