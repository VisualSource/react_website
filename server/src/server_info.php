<?php 
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');
    error_reporting(E_ALL & ~E_NOTICE);
    set_include_path('/mnt/c/Webprojects/website2/server/');
    require 'vendor/xpaw/php-minecraft-query/src/MinecraftQuery.php';
    require 'vendor/xpaw/php-minecraft-query/src/MinecraftQueryException.php';

    use xPaw\MinecraftQuery;
	use xPaw\MinecraftQueryException;
	
	$Query = new MinecraftQuery( );
	
	try{
        $Query->ConnectBedrock("cryptechcraft.xyz");
        $info = $Query->GetInfo();
        $players = $Query->GetPlayers();

        echo json_encode(array(
            'type'=>'info', 
            'code'=>200, 
            'players'=> json_encode($players),
            'player_count' => $info['Players'],
            'max_players' => $info['MaxPlayers']
        ));
	}
	catch( MinecraftQueryException $e ){
        echo json_encode(array('type'=> 'error', 'code'=> 503, 'msg' => $e->getMessage( ) ));
	}
?>
   
