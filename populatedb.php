<?php
echo "hi";
$conn = mysqli_connect('localhost', 'root', '', 'deceit5_wp968');
mysqli_set_charset($conn,"utf8");
if (!$conn) {
  die('Could not connect: ' . mysql_error());
} else {
    echo "connected";
}

?>