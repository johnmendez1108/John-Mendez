

function getprojectsinvite()
{
    $.ajax({ 
		type: 'post', 
		async : false,     
		global : false,
		cache: false,
		dataType : 'json',
		url: 'http://teamstormapps.net/mobile/project/getlist', 
		data: { sid: ses_id }, 
		success: function (data) {
            
            
			
			
			if(data.length > 0){
				
				
				var appendHTML = '';
				
				for(var x = 0; x < data.length; x++){
					 var row = data[x]; 
                    
					appendHTML += '<li>';
				    appendHTML += '<a  data-toggle="modal" href="#inviteprojectlist" onclick="inviteproject_select('+row.id+');">';
    				appendHTML += '<div class="dv-notif "  id="invite_prjlist-'+row.id+'">';
    				
    				appendHTML += '<div class="dv-info un-read">';
    				appendHTML += '<span> '+row.project_title+'</span>';
    				
    				appendHTML += '</div>';
    				appendHTML += '</div>';
    				appendHTML += '</a>';
    				appendHTML += '</li>';
				}
				
				$("#invite_prjlist_holder").html(appendHTML);
				$('.dropdown-menu .dv-notif').click(function(e){e.stopPropagation();});
			}
            
			
			
		}
	});
    
}