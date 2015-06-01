$(document).ready(function() {
   
setTimeout(function(){ loadapp(); }, 3000);
    
    
	
});


function loadapp()
{
    
	if (window.localStorage.getItem('auto_signin')==1)
	{
		 window.location.replace("activity-stream.html");
	}
	else
	{
		 window.location.replace("login.html");
        
	}
}