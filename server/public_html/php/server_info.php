<?php 
    header("Access-Control-Allow-Origin: https://visualsource.000webhostapp.com/");
    header('Content-Type: application/json');
    error_reporting(E_ALL & ~E_NOTICE);
    require '../../vendor/xpaw/php-minecraft-query/src/MinecraftPing.php';
    require '../../vendor/xpaw/php-minecraft-query/src/MinecraftPingException.php';

    use xPaw\MinecraftPing;
	use xPaw\MinecraftPingException;
	
	try{
        $Query = new MinecraftPing('127.0.0.1');//19132

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

	} catch( MinecraftPingException $e ){
        echo json_encode(array('type'=> 'error', 'code'=> 503, 'msg' => $e->getMessage( ) ));
	}
?>
   
