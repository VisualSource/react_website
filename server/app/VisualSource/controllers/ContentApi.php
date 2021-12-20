<?php 

namespace VisualSource\Controller;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Laminas\Diactoros\Response\JsonResponse;

class ContentApi {
    private function getContent(){
        $file_path = __DIR__ . "/../../../db/db.json";
  
        $raw = file_get_contents($file_path);
        $decoded = json_decode($raw,true);

        return $decoded;
    }
    private function getSection($part): ResponseInterface {
        $response = new \Laminas\Diactoros\Response;

        $data = $this->getContent();

        $response->getBody()->write(json_encode($data[$part]));
        
        $response = $response->withHeader("Content-Type","application/json");

        if($_SERVER["SERVER_ENV"] == "develepment") {
            $response = $response->withHeader("Access-Control-Allow-Origin","*");
        }

        return $response;
    }
    public function all(ServerRequestInterface $request): ResponseInterface {
        return new JsonResponse($this->getContent());
    }
    public function version(ServerRequestInterface $request): ResponseInterface {
        return $this->getSection("version");
    }
    public function games(ServerRequestInterface $request): ResponseInterface {
        return $this->getSection("games");
    }
    public function projects(ServerRequestInterface $request): ResponseInterface {
        return $this->getSection("projects");
    }
}

?>