<?php 
/**
 * 
 * GET /api/users/get/{id}
 * 
 * 
 * PATCH /api/users/update/{id}
 * {
 *  
 * }
 * 
 * 
 */
class Users {
    public function __construct(){}
    public function process($path,$params,$request){
        if(sizeof($path) < 3){
            return Response::badRequestResponse();
        }
        switch ($path[3]) {
            case 'update':{
                try {
                    if(($request != "PATCH") || (sizeof($path) < 4)) return Response::badRequestResponse();

                    $auth = Auth::process();

                    //Has Bearer Token in header and is vaild
                    // does token sub mach provieded sub
                    if(!$auth["valid"] || ($auth["payload"]["sub"] != $path[4])) return Response::unauthorizedResponse();
                
                    $token = Auth::getManagmentToken();
                    $client = new \GuzzleHttp\Client();

                    $body = json_decode(file_get_contents('php://input'),true);

                    if(
                        array_key_exists("verify_email",$body) || 
                        array_key_exists("phone_verified",$body) || 
                        array_key_exists("email_verified",$body) || 
                        array_key_exists("blocked",$body) ||
                        array_key_exists("app_metadata",$body)
                    ){
                        return Response::badRequestResponse();
                    }


                    $response = $client->request('PATCH', "https://visualsource.auth0.com/api/v2/users/" . $auth["payload"]["sub"],
                        [
                            'headers'  => [
                                'content-type' => 'application/json',
                                'authorization' => "Bearer " . $token 
                            ],
                            'body' => file_get_contents('php://input')
                        ]
                    );

                    switch ($response->getStatusCode()) {
                        case 200:
                            return Response::acceptedResponse();
                        case 400:
                            return Response::badRequestResponse();
                        case 401:
                            return Response::unauthorizedResponse();
                        case 403:
                            return Response::forbiddenResponse();
                        case 404:
                            return Response::notFoundResponse();
                        case 429:
                            return Response::tooManyRequestResponse();
                        default:
                            return Response::badRequestResponse();
                    }


                } catch (\Throwable $th) {
                    if($_SERVER["SERVER_ENV"] == "develepment") { 
                        echo $th->getMessage() . " IN " . $th->getFile() . " ON " . $th->getLine();
                    }
                    return Response::internalServerErrorResponse();
                }   
            }
            case "get":
                try {
                    if(($request != "GET") || (sizeof($path) < 4)) return Response::badRequestResponse();

                    //$auth = Auth::process();

                    //Has Bearer Token in header and is vaild
                    // does token sub mach provieded sub
                    //if(!$auth["valid"]) return Response::unauthorizedResponse();
                
                    $token = Auth::getManagmentToken();
                    $client = new \GuzzleHttp\Client();

                    $response = $client->request('GET', "https://visualsource.auth0.com/api/v2/users/" . $path[4] . "?fields=name%2Cuser_id%2Cpicture%2Cuser_metadata&include_fies=true",
                        [
                            'headers'  => [
                                'authorization' => "Bearer " . $token
                            ]
                        ]
                    );

                    switch ($response->getStatusCode()) {
                        case 200:
                            return Response::oKResponse($response->getBody());
                        case 400:
                            return Response::badRequestResponse();
                        case 401:
                            return Response::unauthorizedResponse();
                        case 403:
                            return Response::forbiddenResponse();
                        case 404:
                            return Response::notFoundResponse();
                        case 429:
                            return Response::tooManyRequestResponse();
                        default:
                            return Response::badRequestResponse();
                    }


                } catch (\Throwable $th) {
                    if($_SERVER["SERVER_ENV"] == "develepment") { 
                        echo $th->getMessage() . " IN " . $th->getFile() . " ON " . $th->getLine();
                    }
                    return Response::internalServerErrorResponse();
                }
            default:
                return Response::badRequestResponse();
        }
    }
}

?>