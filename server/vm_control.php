<?php 
    //https://cloud.google.com/compute/docs/reference/rest/v1/instances/get
    require_once "vendor/autoload.php";
    //('GOOGLE_APPLICATION_CREDENTIALS=' . __DIR__ . '/auth/auth.json');
    define('PROJECT', 'mbdsv2');
    define('ZONE', 'us-central1-c');
    define('INSTANCE','ds');

    function getStatus(){
        $client = new Google\Client();
        $client->setApplicationName('Google-ComputeSample/0.1');
        $client->setAuthConfig(__DIR__ . '/auth/auth.json');
        //$client->useApplicationDefaultCredentials();
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
            $response = array('status'=>'TEST','statusMessage'=>'null'); //$service->instances->start(PROJECT, ZONE, INSTANCE);
    
            return array("type"=>"info","code"=>200,"msg"=>"Starting server spin up. Please Wait.","msg_s"=>$responce['statusMessage'],'status'=>$responce['status']);
        }
        return array("type"=>"error","code"=>403,"msg"=>"Server can not be started at this time.");
       
    }
    function StopClient(){
        $client = new Google\Client();
        $client->setApplicationName('Google-ComputeSample/0.1');
        $client->setAuthConfig(__DIR__ . '/auth/auth.json');
        $client->addScope('https://www.googleapis.com/auth/cloud-platform');
        $service = new Google_Service_Compute($client);
        $response = $service->instances->stop(PROJECT, ZONE, INSTANCEs);

        return array("type"=>"info","code"=>200,"msg"=>"Stoping server Please Wait.","msg_s"=>$responce['statusMessage'],'status'=>$responce['status']); 
    }
   

    function vmControl(string $request){
        $responce = getStatus();
        $status = $responce['status'];
        if ($request === "start") {
            switch ($status) {
                case 'PROVISIONING':
                case 'STAGING': 
                case 'RUNNING': 
                    return array("type"=>"info","code"=>208,"msg"=>$responce['statusMessage']);
                case 'SUSPENDING':
                case 'SUSPENDED':
                case 'REPAIRING':
                    return array("type"=>"error","code"=>403,"msg"=>"Can not start in this state");
                case 'STOPPING':
                    return array("type"=>"info","code"=>226,"msg"=>$responce['statusMessage']);
                case 'TERMINATED':
                    return StartClient();
                default:
                    return array("type"=>"info","code"=>500,"msg"=>"Someing happened.");
            }
        }else if ($request === "stop"){
            switch ($status) {
                case 'STOPPING': 
                case 'TERMINATED':
                    return array("type"=>"info","code"=>208,"msg"=>$responce['statusMessage']);
                case 'SUSPENDING':
                case 'REPAIRING':
                case 'PROVISIONING':
                case 'STAGING': 
                    return array("type"=>"info","code"=>226,"msg"=>$responce['statusMessage']);
                case 'SUSPENDED':
                case 'RUNNING': 
                    return StopClient();
                default:
                    return array("type"=>"info","code"=>500,"msg"=>"Someing happened.");
            }
        }
    }
?>