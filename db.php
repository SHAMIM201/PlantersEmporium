<?php

$host = "localhost";
$user = "planters_planters_shop";
$password = "Junaid@1011";
$database = "planters_planters_shop";

$conn = new mysqli($host, $user, $password, $database);

if($conn->connect_error){
    die("Connection Failed: " . $conn->connect_error);
}

?>