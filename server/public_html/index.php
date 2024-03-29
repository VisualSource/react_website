<?php 
    error_reporting(E_ALL & ~E_NOTICE);
    require __DIR__ . "/../vendor/autoload.php";

    use Dotenv\Dotenv;
    use \Psr\Http\Message\ResponseInterface;
    use \Psr\Http\Message\ServerRequestInterface;
    use League\Route\Strategy\JsonStrategy;
    use League\Route\Strategy\ApplicationStrategy;
    use VisualSource\Service\CORSStrategy;
    use League\Route\RouteGroup;

    $dotenv = new DotEnv(__DIR__ . "/../");
    $dotenv->load();

    $request = \Laminas\Diactoros\ServerRequestFactory::fromGlobals(
        $_SERVER, $_GET, $_POST, $_COOKIE, $_FILES
    );

    $router = new \League\Route\Router;

    $responseFactory = new Laminas\Diactoros\ResponseFactory();
    $strategy = new JsonStrategy($responseFactory);

    $strategy->addResponseDecorator(function (ResponseInterface $response): ResponseInterface {
        $response = $response->withAddedHeader("Access-Control-Allow-Methods","OPTIONS,GET,POST,PATCH,DELETE")
        ->withAddedHeader('Access-Control-Allow-Origin', $_SERVER["ORGIN_ACCESS"])
        ->withAddedHeader("Access-Control-Allow-Headers","Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        return $response;
    });

    $router->group("/api/minecraft", function(RouteGroup $route){
        $route->get("/maps","\VisualSource\Controller\Minecraft::maps");
        $route->get("/query","\VisualSource\Controller\Minecraft::query");
        $route->get("/datapacks","\VisualSource\Controller\Minecraft::datapacks");
        $route->get("/datapacks/{sort:word}","\VisualSource\Controller\Minecraft::datapacks");
        $route->get("/all","\VisualSource\Controller\Minecraft::all");
        $route->get("/all/{sort:word}","\VisualSource\Controller\Minecraft::all");
        $route->get("/mods","\VisualSource\Controller\Minecraft::mods");
        $route->get("/mods/{sort:word}","\VisualSource\Controller\Minecraft::mods");
        $route->get("/resourcepacks","\VisualSource\Controller\Minecraft::resourcepacks");
        $route->get("/resourcepacks/{sort:word}","\VisualSource\Controller\Minecraft::resourcepacks");
        $route->get("/plugins","\VisualSource\Controller\Minecraft::plugins");
        $route->get("/plugins/{sort:word}","\VisualSource\Controller\Minecraft::plugins");
        $route->get("/updated","\VisualSource\Controller\Minecraft::updated")->setStrategy(new CORSStrategy);
        $route->post("/resource","\VisualSource\Controller\Minecraft::resourceCreate")->setStrategy(new CORSStrategy)->middleware(new \VisualSource\Service\AuthMiddleware)->setHost($_SERVER["REQ_HOST"])->setScheme($_SERVER["REQ_SCHEME"]);
        $route->patch("/resource/update/{id:number}","\VisualSource\Controller\Minecraft::resourceEdit")->setStrategy(new CORSStrategy)->middleware(new \VisualSource\Service\AuthMiddleware)->setHost($_SERVER["REQ_HOST"])->setScheme($_SERVER["REQ_SCHEME"]);
        $route->delete("/resource/{id:number}","\VisualSource\Controller\Minecraft::resourceDelete")->setStrategy(new CORSStrategy)->middleware(new \VisualSource\Service\AuthMiddleware)->setHost($_SERVER["REQ_HOST"])->setScheme($_SERVER["REQ_SCHEME"]);
    })->setStrategy($strategy);

    $router->group("/api/content", function(RouteGroup $route){
        $route->get("/","\VisualSource\Controller\ContentApi::all");
        $route->get("/games","\VisualSource\Controller\ContentApi::games");
        $route->get("/projects","\VisualSource\Controller\ContentApi::projects");
        $route->get("/version","\VisualSource\Controller\ContentApi::version");
    });

    $router->group("/api/games/2048",function(RouteGroup $route){
        $route->get("/top3","\VisualSource\Controller\Games::TopThree");
        $route->get("/top10","\VisualSource\Controller\Games::TopTen");
        $route->get("/user/{id}","\VisualSource\Controller\Games::GetUser");
        $route->post("/update","\VisualSource\Controller\Games::Update")->setStrategy(new CORSStrategy)->middleware(new \VisualSource\Service\AuthMiddleware)->setHost($_SERVER["REQ_HOST"])->setScheme($_SERVER["REQ_SCHEME"]);
    });

    $router->group("/api/users", function(RouteGroup $route) {
        $route->get("/get/{id}","\VisualSource\Controller\Users::getUser");
        $route->patch("/update/{id}","\VisualSource\Controller\Users::updateUser")->middleware(new \VisualSource\Service\AuthMiddleware)->setHost($_SERVER["REQ_HOST"])->setScheme($_SERVER["REQ_SCHEME"]);
    })->setStrategy(new CORSStrategy);

    function indexFile(ServerRequestInterface $request): ResponseInterface {
        $stream = new \GuzzleHttp\Psr7\Stream(fopen("./index.html","r"));
        return new \Laminas\Diactoros\Response\HtmlResponse($stream);
    }
    
    $router->get('/news',"indexFile");
    $router->get('/projects',"indexFile");
    $router->get('/projects/{id}',"indexFile");
    $router->get('/services',"indexFile");
    $router->get('/server/resources',"indexFile");
    $router->get('/server/resources/admin',"indexFile");
    $router->get('/signin',"indexFile");
    $router->get('/account',"indexFile");
    $router->get('/account/edit',"indexFile");
    $router->get('/user/{uuid}',"indexFile");
    $router->get("/games","indexFile");
    $router->get("/", "indexFile");

    try {
        $path = realpath(dirname(__FILE__)) . str_replace("../","",$request->getUri()->getPath());
        if(is_file($path) && file_exists($path)) {
            if(basename($path) === ".htaccess") {
                throw new \League\Route\Http\Exception\ForbiddenException();
            }
            readfile($path);
            exit(0);
        }

        $response = $router->dispatch($request);
        (new \Laminas\HttpHandlerRunner\Emitter\SapiEmitter)->emit($response);
      
    } catch (\Throwable $th) {
        header("Content-Type: application/json");
        if($th instanceof \League\Route\Http\Exception) {
            header($_SERVER["SERVER_PROTOCOL"] . " " . $th->getStatusCode() . " " . $th->getMessage());
            $response = [
                "status_code" => $th->getStatusCode(),
                "reason_phrase" => $th->getMessage()
            ];
            if($_SERVER["SERVER_ENV"] == "develepment") {
                $response["line"] = $th->getLine();
                $response["file"] = $th->getFile();
                $response["message"] = $th->getMessage();
                $response["error_code"] = $th->getCode();
                $response["trace"] = $th->getTraceAsString();
            }

            echo json_encode($response);

            return;
        }

        header($_SERVER["SERVER_PROTOCOL"] . " 500 Interial Server Error");
        $response = [
            "status_code" => 500,
            "reason_phrase" => "Interial Server Error"
        ];
        if($_SERVER["SERVER_ENV"] == "develepment") {
            $response["line"] = $th->getLine();
            $response["file"] = $th->getFile();
            $response["name"] = get_class($th);
            $response["message"] = $th->getMessage();
            $response["error_code"] = $th->getCode();
            $response["trace"] = $th->getTraceAsString();
        }

        echo json_encode($response);
    }

?>