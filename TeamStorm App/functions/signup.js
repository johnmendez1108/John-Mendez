$(document).ready(function() {
        $("#allert_error").hide();
		$("#allert_success").hide();
});

$(function() {
setTimeout(function() {
    $('allert_error').fadeOut('fast');
	
}, 1000);
});

function backlogin(){
	 window.location.replace("login.html");
}
function hideMessage() {
document.getElementById("allert_error").style.display="none"; 
}
function signup(){
    
    var fname = document.getElementById('sup_firstname').value;
    var lname = document.getElementById('sup_lasttname').value;
	var email = document.getElementById('sup_emailtname').value;
	var gender = document.getElementById('sup_gender').value;
	var pass1 = document.getElementById('sup_password1').value;
	var pass2 = document.getElementById('sup_password2').value;
    
    jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/signup', 
			data: { firstname:fname,
				lastname:lname,
				email :email,
				gender:gender,
				password:pass1,
				password2:pass2}, 
      success: function (data) { 
        if(data.status ==0) {
			//navigator.notification.alert(data.status_message, function() {}); 
			//alert(data.status_message); 
			document.getElementById("sup_statmessage").innerHTML = data.status_message;
			$("#allert_error").show();
			 window.setTimeout("hideMessage()", 2500); 
			}
        
	   else  if(data.status ==1) {
		   clearsignup();
		   $("#allert_success").show();
      }
	  },
	  error: function (err) {
        navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
    }
      
    });
    
	
	
  }
  function clearsignup(){
	  document.getElementById('sup_firstname').value="";
	  document.getElementById('sup_lasttname').value="";
	  document.getElementById('sup_emailtname').value="";
	  document.getElementById('sup_gender').value=0;
	  document.getElementById('sup_password1').value="";
	  document.getElementById('sup_password2').value="";
  }
  
  