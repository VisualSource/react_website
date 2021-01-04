<?php 
    error_reporting(E_ALL & ~E_NOTICE);
    //https://cloud.google.com/compute/docs/reference/rest/v1/instances/get
    require_once "vendor/autoload.php";
    define('PROJECT', 'mbdsv2');
    define('ZONE', 'us-central1-c');
    define('INSTANCE','ds');

    function getStatus(){
        $client = new Google\Client();
        $client->setApplicationName('Google-ComputeSample/0.1');
        $client->setAuthConfig(__DIR__ . '/auth/auth.json');
        $client->addScope('https://www.googleapis.com/auth/cloud-platform');
        $service = new Google_Service_Compute($client);
        return $service->instances->get(PROJECT, ZONE, INSTANCE);
    }
  
    function StartClient(){
        $config = json_decode(file_get_contents('../../config.json'),true);
        if($config["can_start"]){
            $client = new Google\Client();
            $client->setApplicationName('Google-ComputeSample/0.1');
            $client->setAuthConfig(__DIR__ . '/auth/auth.json');
            $client->addScope('https://www.googleapis.com/auth/cloud-platform');
            $service = new Google_Service_Compute($client);
            $service->instances->start(PROJECT, ZONE, INSTANCE);
            return array("type"=>"info","code"=>200,"msg"=>"Starting server spin up. Please Wait.");
        }
        return array("type"=>"error","code"=>403,"msg"=>"Server can not be started at this time.");
       
    }
    function StopClient(){
        $client = new Google\Client();
        $client->setApplicationName('Google-ComputeSample/0.1');
        $client->setAuthConfig(__DIR__ . '/auth/auth.json');
        $client->addScope('https://www.googleapis.com/auth/cloud-platform');
        $service = new Google_Service_Compute($client);
        $service->instances->stop(PROJECT, ZONE, INSTANCE);

        return array("type"=>"info","code"=>200,"msg"=>"Stoping server Please Wait."); 
    }
   

    function vmControl(string $request){
        $responce = getStatus();
        $status = $responce['status'];
        if ($request === "start") {
            switch ($status) {
                case 'PROVISIONING':
                case 'STAGING': 
                case 'RUNNING': 
                    return array("type"=>"info","code"=>208,"msg"=>"Server is already running or starting.");
                case 'SUSPENDING':
                case 'SUSPENDED':
                case 'REPAIRING':
                    return array("type"=>"error","code"=>403,"msg"=>"Can not start in this state");
                case 'STOPPING':
                    return array("type"=>"info","code"=>226,"msg"=>"Server is stoping");
                case 'TERMINATED':
                    return StartClient();
                default:
                    return array("type"=>"error","code"=>500,"msg"=>"Something happened.");
            }
        }else if ($request === "stop"){
            switch ($status) {
                case 'STOPPING': 
                case 'TERMINATED':
                    return array("type"=>"info","code"=>208,"msg"=>"Server is stoping or has stoped");
                case 'SUSPENDING':
                case 'REPAIRING':
                case 'PROVISIONING':
                case 'STAGING': 
                    return array("type"=>"info","code"=>226,"msg"=>"Please try again. In a minute.");
                case 'SUSPENDED':
                case 'RUNNING': 
                    return StopClient();
                default:
                    return array("type"=>"error","code"=>500,"msg"=>"Something happened.");
            }
        }
    }

?>