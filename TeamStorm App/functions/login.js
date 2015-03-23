$(document).ready(function() {
	 document.getElementById('username').value =window.localStorage.getItem('username');
	 window.localStorage["session_id"]="";
	
});

function forgotpass(){
	 window.location.replace("forgot-password.html");
}
function signup(){
	 window.location.replace("sign-up.html");
}

function login(){
    
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/auth/login', 
      data: { username:username , password: password }, 
      success: function (data) { 
        if(data.status ==0) {
			navigator.notification.alert(data.status_message, function() {}); 
			//alert(data.status_message); 
			document.getElementById('password').value="";
			}
        
	   else  if(data.status ==1) {
       //navigator.notification.alert("Your User ID is " +  data.user_id + "\n "+ "Session ID is " + data.session_id + "\n" + "Is Successful "+ data.success , function() {});
       //alert("Your User ID is " +  data.user_id + "\n "+ "Session ID is " + data.session_id + "\n" + "Is Successful "+ data.success );
         //window.location="http://www.google.com";
		 //$.mobile.changePage($('#modalview-login'));
		 //$.mobile.changePage("Index2.html");
		 //alert(data.session_id);
		 window.localStorage["session_id"] = data.session_id;
		 window.localStorage["name"] = data.name;
		  
		  window.localStorage["islogin"] = 1;
		 window.localStorage["username"] = username;
		 window.localStorage["password"] = password;
		 window.location.replace("activity-stream.html");
		 //window.location = "activity-stream.html";
      }
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		alert(err.description);
		console.log(err.description);
    }
      
    });

	
  //getmyprofile();
  }
  
 
  