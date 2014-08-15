$(document).ready(function(){
	var user = window.user;
	$('.adminOnly').toggle(user.roles.isAdmin);	
});