<?php
 
 // Code Breakdown
//  - PART 1 - Defining
//  - PART 2 - PROCESS
//  - PART 3 - Front end


//part 1 - Defining

require_once(dirname(__FILE__).'/twitteroauth/oauth.php');
require_once(dirname(__FILE__).'/twitteroauth/twitteroauth.php');

define('CONSUMER_KEY','xrQubVjskaSG23At4RG1xDm1B');
define('CONSUMER_SECRET','rziGCBdFhRmyal0qOPNtiIVFuyY5pszjzVhAjX2UIxWV5nk2Tn');
define('OAUTH_CALLBACK','http://www.intecons.in/interns2017/Hitesh_Aswani/test/login.php');


// Helper Functions

function check_normal_user($email){

	global $conn;

	$query = mysqli_query($conn,"SELECT Email FROM ha_test1_users WHERE Email='{$email}' AND Password!=''");
	confirm($query);

	if(mysqli_num_rows($query) > 0){

		return 0;

	}
	else{

		return 1;

	}

}

// Check Existing Social Media registered user

function check_social_user($email){

	global $conn;

	$query = mysqli_query($conn,"SELECT Email FROM ha_test1_users WHERE Email='{$email}'");
	confirm($query);

	if(mysqli_num_rows($query) > 0){

		return 0;

	}
	else{

		return 1;

	}

}


// Get Last ID

function get_next_id(){

	global $conn;

	$query = mysqli_query($conn,"SELECT User_ID FROM ha_test1_users ORDER BY User_ID DESC");
	confirm($query);

	$row = mysqli_fetch_assoc($query);

	if(isset($row['User_ID'])){

		return ($row['User_ID'] + 1);
	}
	else{
		return 1;
	}

}

// part 2 - Process
// 1. check for logout
// 2. check for user sesssion
// 3. check for callback

// 1. to handle logout request

if(isset($_GET['logout'])){
	session_unset();	
	header('location: login.php');
}

// 2. if user session not enabled then get the login url

if(!isset($_SESSION['User_ID']) && !isset($_GET['oauth_token'])) {
	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);
	$request_token = $connection->getRequestToken(OAUTH_CALLBACK); 

	if($request_token){
		$token = $request_token['oauth_token'];
		$_SESSION['request_token'] = $token ;
		$_SESSION['request_token_secret'] = $request_token['oauth_token_secret'];

		$login_url = $connection->getAuthorizeURL($token);
	}
}


// 3. if its a call back url

if(isset($_GET['oauth_token'])){

	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $_SESSION['request_token'], $_SESSION['request_token_secret']);
	$access_token = $connection->getAccessToken($_REQUEST['oauth_verifier']);
	if($access_token){
		$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
		$params =array('include_email' => 'true','include_entities'=>'false','skip_status' => 'true');
		$data = $connection->get('account/verify_credentials',$params);
		if($data){

			// My login Code

			$email = $data->email;

			$name = $data->name;

			$dp = $data->profile_image_url;

			$user_id = get_next_id();

			if(check_normal_user($email)){

				if(check_social_user($email)){

					if(!file_exists("./includes/images/users/user_{$user_id}")){

						mkdir("./includes/images/users/user_{$user_id}",0777,true);

					}

					$image_name = time();

					$image_path = "user_{$user_id}/{$image_name}";

					$img = "./includes/images/users/user_{$user_id}/" . $image_name;

					copy($dp,$img);

					$query = mysqli_query($conn,"INSERT INTO ha_test1_users VALUES(NULL,'{$name}','{$email}','','{$image_path}',1,'twitter')");
					confirm($query);

				}

				$query = mysqli_query($conn,"SELECT User_ID FROM ha_test1_users WHERE Email='{$email}'");
				confirm($query);

				$row = mysqli_fetch_array($query);

				if($row['User_ID'] != 0){

					$_SESSION['User_ID'] = $row['User_ID'];

					header('location: dashboard.php');

				}
				else{

					echo "<script>alert('Couldn't log you in with Twitter.)</script>";

				}

			}
			else{

				echo "<script>alert('This ID is already taken.\nTry with a different account!');</script>";

			}

			// My Login Code End

		}
	}
}





























