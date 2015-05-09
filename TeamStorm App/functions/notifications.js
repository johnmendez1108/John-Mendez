var ses_id = window.localStorage.getItem('session_id');
var cur_notifcount=0;
var cur_notifcount2=0;
var first_notif_id;
	//NOTIFICATION AUTO REFRESH
	setInterval(function(){ notification_refresh() }, 20000);


 function notification_refresh()
{
	
	
	
	
	//NEW NOTIFICATIONS
	$.ajax({ 
		type: 'post', 
		async : false,     
		global : false,
		cache: false,
		dataType : 'json',
		url: 'http://teamstormapps.net/mobile/notification', 
		data: { sid: ses_id }, 
		success: function (data) { 
			var appendHTML = '';
			
			first_notif_id=data[0].id
			for(var x = 0; x < data.length; x++){
				var row = data[x];
				var is_new = row.is_read == 0 ? true : false;
				var profile_pic = row.profile_pic;
				var des =row.description.replace(row.fullname, "");;
				
				appendHTML += '<li>';
				appendHTML += '<a  data-toggle="modal" href="#notification" onclick="notif_click('+row.id+');">';
				appendHTML += '<div class="dv-notif '+(is_new? 'un-read':'')+'"  id="notif-info-'+row.id+'">';
				appendHTML += '<img src="data:image/gif;base64,'+profile_pic+'" class="img-circle" width="60" height="60"  alt="Image" />';
				appendHTML += '<div class="dv-info">';
				appendHTML += '<span class="name">'+ row.fullname+'</span><span> '+des+'</span>';
				appendHTML += '<span class="n-time"><span class="fa fa-clock-o"></span> '+row.date_notified+'</span>';
				appendHTML += '</div>';
				appendHTML += '</div>';
				appendHTML += '</a>';
				appendHTML += '</li>';
			}
			
			if(data.length > 0){ $("#notif_gen_holder").html(appendHTML); }
		}
	});
	
	
	
	
	//NOTIFICATIONS COUNT
		  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/notification/notif_count', 
			data: { sid: ses_id }, 
			success: function (data) { 
						if(data.count > 0){
							$("#notif_gen_count").html(data.count);
							cur_notifcount=data.count;
							
							if (data.count>cur_notifcount2)
							{
								navigator.notification.vibrate(2000);
								cur_notifcount2=data.count;
							}
						}
						
					},
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});  
}

function notif_click(id){
	  jQuery.ajax({ 
				type: 'post', 
				async : false,     
				global : false,
				cache: false,
				dataType : 'json',
				url: 'http://teamstormapps.net/mobile/notification/notif_click/'+id, 
				data: { sid: ses_id }, 
				success: function (data) { 	
				
					 jQuery("#notif-info-"+id).removeClass('un-read');
					
					},
		  error: function (err) {
			//navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
			//alert(err.message);
			console.log(err.message);
		}
			
	});
}



 function notification_remove_count()
{
	if (cur_notifcount >0){
		$("#notif_gen_count").html('');
			  jQuery.ajax({ 
				type: 'post', 
				async : false,     
				global : false,
				cache: false,
				dataType : 'json',
				url: 'http://teamstormapps.net/mobile/notification/notif_remove_count', 
				data: { sid: ses_id }, 
				success: function (data) { 
					
						},
		  error: function (err) {
			//navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
			//alert(err.message);
			console.log(err.message);
		}
			
	});
	}	
}