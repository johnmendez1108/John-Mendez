var passwordok =1;


function load_myprofile()
{
	getmyprofile();
	document.getElementById("my_profname").innerHTML = window.localStorage.getItem('name');
	//$("#con_appsettings").show();
	
	 
	 document.getElementById("my_profpic").src = "data:image/gif;base64,"+ window.localStorage.getItem('ts_myprofpic') ;
	 document.getElementById("my_id").innerHTML  =  window.localStorage.getItem('ts_myid') ;
	 document.getElementById("txt_myproffirstname").value =  window.localStorage.getItem('ts_myfname') ;
	 document.getElementById("txt_myprofmiddlename").value =  window.localStorage.getItem('ts_mymname') ;
	 document.getElementById("txt_myproflastname").value =  window.localStorage.getItem('ts_mylname') ;
	 document.getElementById("slct_myprofgender").value =  window.localStorage.getItem('ts_mygender') ;
	 document.getElementById("txt_myprofaddress").value =  window.localStorage.getItem('ts_mylocation') ;
	 document.getElementById("txt_myprofcompany").value =  window.localStorage.getItem('ts_mycompany') ;
	 document.getElementById("txt_myprofschoolgrad").value =  window.localStorage.getItem('ts_mylast_school') ;
	 document.getElementById("txt_myprofcontact").value =  window.localStorage.getItem('ts_mycontact') ;
	 document.getElementById("txt_myprofemail").value =  window.localStorage.getItem('ts_myemail') ;
}


/* $(function() {
setTimeout(function() {
   $('allert_error').fadeOut('fast');
}, 1000);
}); */

function back_stream() {
window.history.back();
 //location.reload();
}

function hideMessage() {
document.getElementById("allert_error").style.display="none"; 
document.getElementById("allert_success").style.display="none"; 
}

 function updatemyprofile(){
var ses_id = window.localStorage.getItem('session_id');


	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/user/update_info', 
			data: { sid: ses_id, 
					firstname: document.getElementById("txt_myproffirstname").value,
					lastname:  document.getElementById("txt_myproflastname").value,
					middlename :  document.getElementById("txt_myprofmiddlename").value,
					email:  document.getElementById("txt_myprofemail").value,
					gender: document.getElementById("slct_myprofgender").value,
					company:document.getElementById("txt_myprofcompany").value,
					location:document.getElementById("txt_myprofaddress").value,
					lastschool: document.getElementById("txt_myprofschoolgrad").value,
					contact:document.getElementById("txt_myprofcontact").value
				
					}, 
			success: function (data) { 
			
			if(data.status ==0) {
			//navigator.notification.alert(data.status_message, function() {}); 
			alert(data.message); 
			document.getElementById("sup_statmessage").innerHTML = data.message;
			document.getElementById('allert_error').style.display = "block";
			window.setTimeout("hideMessage()", 2500); 
			 
			 
			}        
			else  if(data.status ==1) {
				
						//alert(data.message); 
						changepassword();			
						if (passwordok==1){
							document.getElementById("suc_message").innerHTML = data.message;
							document.getElementById('allert_success').style.display = "block";
							window.setTimeout("hideMessage()", 4500); 	
						}
			}
			
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		alert(err.message);
    }
  
});   



	
} 

function changepassword(){
var ses_id = window.localStorage.getItem('session_id');
var pass1 =document.getElementById('txt_myprofnewpass1').value;
var pass2=document.getElementById('txt_myprofnewpass2').value;


if (pass1.length>=6){
	if ( pass1 === pass2 )
	{
			  jQuery.ajax({ 
					type: 'post', 
					async : false,     
					global : false,
					dataType : 'json',
					url: 'http://teamstormapps.net/mobile/user/update_pass', 
					data: { sid: ses_id ,
							old_password: document.getElementById("txt_myprofoldpass").value,
							new_password: pass1
							}, 
					success: function (data) { 
					 if(data.status ==0) {
					//navigator.notification.alert(data.status_message, function() {}); 
					//alert(data.status_message); 
					document.getElementById("sup_statmessage").innerHTML = data.message;
					document.getElementById('allert_error').style.display = "block";
					window.setTimeout("hideMessage()", 4500);  
					 //alert(data.message);
					 passwordok=0;
					}
				
					else  if(data.status ==1) {
						clearmyprofpass();
						document.getElementById("suc_message").innerHTML = data.message;
						document.getElementById('allert_success').style.display = "block";
						window.setTimeout("hideMessage()", 4500);  
						 //alert(data.message);
						 passwordok=1;
					}
					
			  },
			  error: function (err) {
				//navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
				//alert(err.message);
				}
				
				});   


	}
					else
					{
							document.getElementById("sup_statmessage").innerHTML = "Password not Match";
							document.getElementById('allert_error').style.display = "block";
							window.setTimeout("hideMessage()", 4500); 
					}	
}


	
}

  function clearmyprofpass(){
	  document.getElementById('txt_myprofoldpass').value="";
	  document.getElementById('txt_myprofnewpass1').value="";
	  document.getElementById('txt_myprofnewpass2').value="";
  }
 
