

function getprojectsinvite()
{
    $.ajax({ 
		type: 'post', 
		async : false,     
		global : false,
		cache: false,
		dataType : 'json',
		url: 'http://teamstormapps.host/mobile/project/getlist', 
		data: { sid: ses_id }, 
		success: function (data) {
            
            
			
			
			if(data.length > 0){
				
				
				var appendHTML = '';
				
				for(var x = 0; x < data.length; x++){
					 var row = data[x]; 
                    
					appendHTML += '<li>';
				    appendHTML += '<a  data-toggle="modal" href="#inviteprojectlist" ontouchstart="inviteproject_select('+row.id+');">';
    				appendHTML += '<div class="dv-notif "  id="invite_prjlist-'+row.id+'">';
    				
    				appendHTML += '<div class="dv-info un-read">';
    				appendHTML += '<span class="name" > '+row.project_title+'</span>';
    				
    				appendHTML += '</div>';
    				appendHTML += '</div>';
    				appendHTML += '</a>';
    				appendHTML += '</li>';
				}
				
				
				if(data.length > 0){$("#invite_prjlist_holder").html(appendHTML); }
			}
            
			
			
		}
	});
    
}


function inviteproject_select(id)
{
    var members = getCheckedBoxes('Contacts');
    
    var chk_members = '';
	
	for(var x = 0; x < members.length; x++){
		chk_members += members[x].value + ',';
	}
	chk_members = chk_members.slice(0,-1);
    
    
  
    
     $.ajax({ 
		type: 'post', 
		async : false,     
		global : false,
		cache: false,
		dataType : 'json',
		url: 'http://teamstormapps.host/mobile/project/addmembers_post/'+id, 
		data: { sid: ses_id, 
                emails:chk_members}, 
		success: function (data) {
            
            		
			
			if(data.status == 1){
				
                navigator.notification.alert('New Members added!',alertDismissed,'Invite Members','Ok');
                loadaddress();                
							
			}
            
            alert(data.status);
            
			
			
		},
        error: function (err) {
				//navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
				//alert(err.message);
				console.log(err.message);
			} 
	});
    
    
    
}
