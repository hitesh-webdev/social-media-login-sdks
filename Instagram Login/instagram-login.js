/* Instagram Sign in Custom Button 
==================================================================== */

<a href="https://api.instagram.com/oauth/authorize/?client_id=bde1b7c808bf4b97931c8e4c9613d131&redirect_uri=http://www.intecons.in/interns2017/Hitesh_Aswani/test/login.php&response_type=token"><img class="social_icons" src="./includes/images/social media icons/instagram.png"/></a>


/* Login Page Instagram Sign In Function 
============================================================== */

function instagramLogin(token){

$.ajax({
    url: "https://api.instagram.com/v1/users/self?"+token,

    dataType: "jsonp",
    success: function( response ) {
        console.log( response ); // server response
    }

});

}

var token = window.location.hash.substr(1);

if(token){

	instagramLogin(token);

}