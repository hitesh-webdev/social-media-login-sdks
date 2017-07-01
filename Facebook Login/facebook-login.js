/* Facebook Sign in Custom Button 
==================================================================== */

<div onclick="fbLogin()"><img class="social_icons" src="./includes/images/social media icons/facebook.png"/></div>


/* Login Page Facebook Sign In Function
=================================================================== */


// Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

// Initialized the JavaScript SDK

window.fbAsyncInit = function() {
  FB.init({
    appId      : '437095443080756',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.8' // use graph api version 2.8
});


FB.getLoginStatus();

};

// To be called when fb login button is clicked

function fbLogin(){

FB.login(function(response) {

  if (response.authResponse) {

     FB.api('/me?fields=id,name,email,picture', function(response) {

     	//console.log(response);

        //console.log('Good to see you, ' + response.name + ' ' + response.email + ' ' + response.picture.data.url);

        $.ajax({
			method: "POST",
			url: "./ajax/social_sign_in.php",
			data: {
				FB_Auth: true,
				Email: response.email,
				Name: response.name,
				Dp: response.picture.data.url
			},
			success: function( result ) {
				if(result != 0){
					window.location.href = 'dashboard.php';
				}
				else{
					alert("Couldn't Log you in with Facebook.");
				}
			}
		});


     });

    } 
    else {

		console.log('User cancelled login or did not fully authorize.');
    }

},{scope: 'email,public_profile'});

}


/* Sign in PHP logic (ajax handler file) 
=============================================================== */

if(isset($_REQUEST['FB_Auth'])){

	// Registering user in the database

	$email = $_REQUEST['Email'];

	$name = $_REQUEST['Name'];

	$dp = $_REQUEST['Dp'];

	$user_id = get_next_id();

	if(check_user($email)){

		if(!file_exists("../includes/images/users/user_{$user_id}")){

			mkdir("../includes/images/users/user_{$user_id}",0777,true);

		}

		$image_name = time();

		$image_path = "user_{$user_id}/{$image_name}";

		$img = "../includes/images/users/user_{$user_id}/" . $image_name;

		copy($dp,$img);

		$query = mysqli_query($conn,"INSERT INTO ha_test1_users VALUES(NULL,'{$name}','{$email}','','{$image_path}',1,'facebook')");
		confirm($query);

	}

	$query = mysqli_query($conn,"SELECT User_ID FROM ha_test1_users WHERE Email='{$email}'");
	confirm($query);

	$row = mysqli_fetch_array($query);

	if($row['User_ID'] != 0){

		$_SESSION['User_ID'] = $row['User_ID'];

		echo $row['User_ID'];

	}
	else{

		echo 0;

	}

}