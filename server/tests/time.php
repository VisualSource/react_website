<?php
//print_r((new DateTime("NOW"))->format("c"));
$a = new DateTime("2021-10-08T13:49:41-04:00");
$b = new DateTime("2021-10-08T13:52:19-04:00");
$interval = $a->diff($b);
echo $interval->format('%Y years %m months %d days %H hours %i minutes %s seconds');


echo $difference_in_seconds = strtotime('2021-10-08T13:49:41-04:00') - strtotime('2021-10-08T13:52:19-04:00');


?>