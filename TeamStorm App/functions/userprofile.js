var cur_uid;


$(document).ready(function() {
	 document.getElementById("userprof_name").innerHTML = window.localStorage.getItem('name');
	 document.getElementById("userprof_pic").src = "data:image/gif;base64,"+ window.localStorage.getItem('ts_myprofpic') ;

	
});


function back_stream() {
window.history.back();
 //location.reload();
}

function userprofile(uid)
{
	if (uid==0)
	{
		cur_uid=localStorage.getItem("ts_myid");
	}
	else{
		cur_uid=uid;
	}
	
	var tsid,userlevel,email,name,firstname,middlename,lastname,gender,preview_pic,company,location,contact,last_school,timezone,date_joined,followers,following,projects,tasks,is_following;
	
	
	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/user', 
			data: { sid: ses_id, id: cur_uid}, 
			success: function (data) { 
			tsid = data.id;
			userlevel = data.userlevel;
			email= data.email;
			name=data.name;
			firstname=data.firstname;
			middlename=data.lastname;
			gender= data.gender;
			preview_pic=data.preview_pic;
			company=data.company;
			location=data.location;
			contact=data.contact;
			last_school=data.last_school;
			timezone=data.timezone;
			date_joined=data.date_joined;
			followers=data.followers;
			following=data.following;
			projects=data.projects;
			tasks=data.tasks;
			is_following=data.is_following;
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});


 document.getElementById("usernamehdr").innerHTML=name;
 document.getElementById("userprof_pic").src="data:image/gif;base64,"+preview_pic;
 document.getElementById("userprof_name").innerHTML=name;
 
  if (cur_uid != localStorage.getItem("ts_myid")){ document.getElementById("btn_follow_unfollow").style.display="block";}
  else if(cur_uid==localStorage.getItem("ts_myid")){document.getElementById("btn_follow_unfollow").style.display="none";}
 
  if (is_following==1){document.getElementById("btn_follow_unfollow").innerHTML='<i class="flaticon-check" style="color: #FFF;">  Following</i> ';}	
  else if(is_following==0){document.getElementById("btn_follow_unfollow").innerHTML='<i class="flaticon-adduser"> Follow</i> '}	
  	
  document.getElementById("userprof_id").innerHTML=tsid;
  document.getElementById("userprof_fullname").innerHTML=name;
  if (gender==0){document.getElementById("userprof_gender").innerHTML="Male";}
  else if (gender==1){document.getElementById("userprof_gender").innerHTML="Female";}
  document.getElementById("userprof_address").innerHTML=location;
  document.getElementById("userprof_company").innerHTML=company;
  document.getElementById("userprof_school").innerHTML=last_school;
  document.getElementById("userprof_mobile").innerHTML=contact;
  document.getElementById("userprof_emailadd").innerHTML=email;
  
   	
}