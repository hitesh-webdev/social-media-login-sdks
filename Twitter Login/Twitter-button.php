/* Twitter Sign in Custom Button 
==================================================================== */

<?php if(isset($login_url) && !isset($_SESSION['User_ID'])): ?>

<a href="<?=$login_url?>"><img class="social_icons" src="./includes/images/social media icons/twitter.png"/></a>

<?php endif; ?>