function backlogin(){
	 window.location.replace("login.html");
}
$(function() {
setTimeout(function() {
    $('fp_error').fadeOut('fast');
}, 1000);
});

function hideMessage() {
document.getElementById("fp_error").style.display="none"; 
}
function forgotpass(){

			$.ajax({ 
			type: 'get', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/fpw?send=' + document.getElementById('txt_sendemail').value, 
			data: { }, 
      success: function (data) { 
        if(data.success ==0) {
			
			document.getElementById("fp_statmessage").innerHTML = data.msg;
			$("#fp_error").show();
			 window.setTimeout("hideMessage()", 2000); 
			}
        
	   else  if(data.success ==1) {
		 
		   $("#fp_success").show();
		   document.getElementById("fp_success").innerHTML = data.msg;
		    document.getElementById('txt_sendemail').value="";
      }
	  },
	  error: function (err) {
         navigator.notification.alert('Network Connection Error Kindly Check your Internet Connection',alertDismissed,'TeamStorm App','Ok');
    }
      
    });


}
function alertDismissed()
{
    
}