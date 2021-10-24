<?php
//print_r((new DateTime("NOW"))->format("c"));
//$a = new DateTime("2021-10-08T14:32:08-04:00");
//$b = new DateTime("NOW");
//$interval = $a->diff($b);
//echo $interval->format('%Y years %m months %d days %H hours %i minutes %s seconds');
//echo (new DateTime("NOW"))->format("c");

$cached = "2021-10-08T14:32:08-04:00";
echo $difference_in_seconds = strtotime((new DateTime("NOW"))->format("c")) - strtotime("2021-10-21T11:51:04-04:00");


if($difference_in_seconds < 36000){
    echo "true";
}else{
    echo "false";
}


?>