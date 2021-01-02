<?php 
    header("Access-Control-Allow-Origin: https://visualsource.000webhostapp.com/");
    header('Content-Type: application/json');
    error_reporting(E_ALL & ~E_NOTICE);
    require_once '../../vm_control.php';

    use xPaw\MinecraftPing;
    use xPaw\MinecraftPingException;


    function pingServer(){
        $config = json_decode(file_get_contents('../../config.json'),true);
        $Query = new MinecraftPing($config["server_ip"], $config["server_port"]);//19132

        $Info = $Query->Query( );

        if( $Info === false ){
            echo json_encode(array('type'=> 'error', 'code'=> 503, 'msg' => ""));
        }else{
            echo json_encode(array(
                'type'=>'info', 
                'code'=>200, 
                'players'=> json_encode(false),
                'player_count' => $Info['players']['online'],
                'max_players' => $Info['players']['max']
            ));
        }

        $Query->Close();
    }
	
	try{
        $responce = getStatus();
        $status = $responce['status'];
        switch ($status) {
            case 'PROVISIONING':
            case 'STAGING': 
            case 'SUSPENDING':
            case 'SUSPENDED':
            case 'REPAIRING':
            case 'STOPPING':
                echo json_encode(array("type"=>"info","code"=>208,"msg"=>'Server is in a between states. Please wait.'));
                break;
            case 'TERMINATED':
                echo json_encode(array("type"=>"error","code"=>500,"msg"=>"Server is down"));
                break;
            case 'RUNNING': 
                pingServer();
                break;
            default:
                echo json_encode(array("type"=>"error","code"=>500,"msg"=>"Someing happened."));
                break;
        }
	} catch( MinecraftPingException $e ){
        echo json_encode(array('type'=> 'error', 'code'=> 503, 'msg' => $e->getMessage( ) ));
	}
?>
   
