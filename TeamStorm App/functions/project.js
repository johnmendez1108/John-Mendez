var ses_id = window.localStorage.getItem('session_id');
var proj_completed = 0;
var allmemberid = new Array();
var numofmembers;
var proj_mem_profpic="";
function getprojectlist()
{
	
	
	var appendHTML = '';

	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/getlist', 
			data: { sid: ses_id }, 
			success: function (data) { 
						 
				 for(var x = 0; x < data.length; x++){
					var pid= data[x].id;
					var project_creator= data[x].project_creator;
					var project_title= data[x].project_title;   
					var project_description= data[x].project_description;
					var date_last_update= data[x].date_last_update;
					var date_created= new Date(data[x].date_created);  
					var is_deleted= data[x].is_deleted;
					var status= data[x].status;
					var creator_name= data[x].creator_name;
					var percentcomplete=0;
					
					proj_inf(pid);
					if (proj_completed==1)
					{
						isproj_complete=100;
					}
					else
					{
						isproj_complete=0;
					}
					
					
					appendHTML+= '<div class="inner-wrapper">'+
							'<div class="task-wrapper">'+
							
							'<div class=" left-border" style="width:100%">'+
                                '<div class="title-task"><a href="task-info.html">'+project_title+' </a>'+
                                '</div>'+
                                '<div class="sub-title-task">Date Created: '+date_created.toDateString()+' '+ date_created.toLocaleTimeString()+'</div>'+
                                '<div class="progress">'+
                                    '<div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: '+isproj_complete+'%">'+
                                        '<span class="progress-type">'+isproj_complete+'%</span>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="task-description">'+project_description+'</div>';
								
								
								
                    appendHTML+='<div class="project-status">'+
                                   '<ul class="clearfix">'+
                                        '<li>'+
                                            '<div class="title">Tasks</div>'+
                                        '</li>'+
                                        '<li>'+
                                            '<div class="stats">Pending</div>'+
                                            '<div class="count">4</div>'+
                                       '</li>'+
                                        '<li>'+
                                            '<div class="stats">Ongoing</div>'+
                                            '<div class="count">6</div>'+
                                        '</li>'+
                                        '<li>'+
                                            '<div class="stats">Completed</div>'+
                                            '<div class="count">10</div>'+
                                        '</li>'+
                                    '</ul>'+
                                '</div>';
								
								
								
                       appendHTML+='<div class="task-user">'+
                                    '<ul>';
									
								get_proj_member(pid);
									
								 for(var i = 0; i < numofmembers; i++){	
                                     
									 
									 
									 getprofpic(allmemberid[i]);
									 
									 appendHTML+='<li>'+
                                            '<a onclick="userprofile('+allmemberid[i]+');"><img class="img-circle" src="data:image/gif;base64,'+proj_mem_profpic+'" width="50" height="50" alt="Image"></a>'+
											'</li>';
									  
									  
								 }
					   
					   appendHTML+='</ul>'+
								
                                '</div>';
								
                appendHTML+='</div>'+
                            '<div class="right-border">'+
                                '<div class="link-wrapper">'+
                                    '<a href="task-info.html" class="arrow-link"><span class="flaticon-arrow-right"></span></a>'+
                                '</div>'+
                            '</div>'+
                     
                    '</div>'+
					'</div>';		
				 }
				 				 
				if (appendHTML.length >0){
				 window.localStorage["getprojectlist"]= appendHTML; 
				
				}
				
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});  
document.getElementById("projectlist").innerHTML=window.localStorage.getItem('getprojectlist');	
}

function proj_inf(id)
{
	jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/info/'+id, 
			data: { sid: ses_id}, 
			success: function (data) { 
			
				if(data.status == 1){
					
					proj_completed = data.data[0].is_completed
					
								
				}
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});   
}

function get_proj_member(id)
{
	
	jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/memberlist/'+id, 
			data: { sid: ses_id}, 
			success: function (data) { 
			
				if(data.status == 1){
					
				numofmembers=data.items.length;
			    for(var x = 0; x < data.items.length; x++){
						 
						allmemberid[x] = data.items[x].id;
						
					
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
function getprofpic(tsid){

	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/user', 
			data: { sid: ses_id, id: tsid}, 
			success: function (data) { 
			
		
			proj_mem_profpic = data.preview_pic;
			
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});   
	
}

