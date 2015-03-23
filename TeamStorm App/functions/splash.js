$(document).ready(function() {

	if (window.localStorage.getItem('auto_signin')==1)
	{
		 window.location.replace("activity-stream.html");
	}
	else
	{
		 window.location.replace("login.html");
	}
	
});
