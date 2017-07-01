/* Include JS from CDN 
==================================================================== */


	<head>
		<meta name="google-signin-client_id" content="612333823086-70f13fhb1ovgk7a5ngi6qcmd9nbmbvvs.apps.googleusercontent.com">
		<script src="https://apis.google.com/js/api:client.js"></script>
	</head>


/* Google Sign in Custom Button 
==================================================================== */

<div id="googleCustomButton"><img class="social_icons" src="./includes/images/social media icons/google.png"/></div>


/* Login Page Google Sign In Function
==================================================================== */

// Google Custom Button

var googleUser = {};

function googleCustomButton(){

	gapi.load('auth2', function(){
		auth2 = gapi.auth2.init({
        client_id: '612333823086-70f13fhb1ovgk7a5ngi6qcmd9nbmbvvs.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin'
    });

        attachGoogleSignin(document.getElementById('googleCustomButton'));
    });

}

function attachGoogleSignin(element) {
    
    auth2.attachClickHandler(element, {},
        function(googleUser) {

        	var profile = googleUser.getBasicProfile();
          
        	$.ajax({
				method: "POST",
				url: "./ajax/social_sign_in.php",
				data: {
					Google_Auth: true,
					Email: profile.getEmail(),
					Name: profile.getName(),
					Dp: profile.getImageUrl()
				},
				success: function( result ) {
					if(result != 0){
						window.location.href = 'dashboard.php';
					}
					else{
						alert("Couldn't Log you in with Google.");
					}
				}
			});

        }, function(error) {
          	console.log(JSON.stringify(error, undefined, 2));
        });
}


// Rendering Google Custom Button

googleCustomButton();

// Google Sign Out 

function googleSignOut() {

	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log('User signed out.');
		window.location.href = 'logout.php';
	});
}


/* Sign in PHP logic (ajax handler file) 
=============================================================== */

if(isset($_REQUEST['Google_Auth'])){

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

		$query = mysqli_query($conn,"INSERT INTO ha_test1_users VALUES(NULL,'{$name}','{$email}','','{$image_path}',1,'google')");
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