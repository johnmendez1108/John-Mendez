var ses_id = window.localStorage.getItem('session_id');
var proj_completed = 0;
var allmemberid = new Array();
var alltaskid= new Array();
var alltaskname= new Array();
var numoftask;
var numofmembers;
var proj_mem_profpic="";
var task_mem_profpic="";
var cur_pid;
var cur_tid;
var task_mem_profpic1="";

function getproject()
{
	var appendHTML ='<li><a data-toggle="modal" href="#newproject" ><i class="flaticon-folder-plus"></i> Create New Project</a></li>';
	
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
					
					
					
					appendHTML+= '<li><a data-toggle="collapse" href="#collapse-projects-task-lists-'+pid+'" ><i class="flaticon-folder-open" ></i>'+project_title+'';
					
					
					gettasklist(pid);
					
					if (numoftask>0){
						
						appendHTML+= '<i class="flaticon-menu pull-right"></i></a>';
						appendHTML+= '<ul id="collapse-projects-task-lists-'+pid+'" class="panel-collapse collapse">';
					
						for(var i = 0; i < numoftask; i++){	
						
							appendHTML+= '<li><a id='+alltaskid[i]+' data-toggle="modal" href="#taskinfo"  onclick="getmytaskinfo('+pid+','+alltaskid[i]+')"  ><span class="flaticon-task"> </span> '+alltaskname[i]+'</a></li>';
							
						}
						
						appendHTML+= '</ul>';
					}
					else{
						appendHTML+= '</a>';
						
					}
										
					
					appendHTML+= '</li>';
				
					
				 }
				 
				appendHTML+= '<li><a data-toggle="modal" href="#project" onclick="getprojectlist();"><i class="flaticon-folder-close-line"></i>See All</a>';	 				 
				if (appendHTML.length >0){
					
					window.localStorage["getprojects"]=appendHTML;
				}
				
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});  
	
	
document.getElementById("collapse-projects-lists").innerHTML=window.localStorage.getItem('getprojects');
}
function getmytask()
{
	var appendHTML ='';
	
	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/task/get_active', 
			data: { sid: ses_id }, 
			success: function (data) { 
						 
				 for(var x = 0; x < data.length; x++){
					var id= data[x].id;
					var task_title= data[x].task_title;
					var project_id= data[x].project_id;
				
					/* var creator_id= data[x].creator_id;
					var start_date= data[x].start_date;
					var priority= data[x].priority;
					var status= data[x].status;
					var complete_date= data[x].complete_date;
					
					var title="'"+task_title+"'"; */
					
										
							appendHTML+= '<li><a id="mytask-'+id+'"  data-toggle="modal" href="#taskinfo" onclick="getmytaskinfo('+project_id+','+id+')"   ><span class="flaticon-task"> </span> '+task_title+'</a></li>';
				
				}
				 			 
				if (appendHTML.length >0){
					
					window.localStorage["getmytask"]=appendHTML;
				}
				
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});  
	
	
document.getElementById("collapse-tasks").innerHTML=window.localStorage.getItem('getmytask');
}


function getmytaskinfo(pid,tid)
{
	
if (checkConnection() >2){
	cur_tid=tid;
	jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/tasklist/'+pid, 
			data: { sid: ses_id}, 
			beforeSend: function () {
			 preloading2();
			},
			success: function (data) { 
			
				if(data.status == 1){
						
							
					 for(var x = 0; x < data.items.length; x++){	
						
						if (tid== data.items[x].id)
						{
							var task_title = data.items[x].task_title;
							var task_description = data.items[x].task_description;
							var task_creator_id = data.items[x].task_creator_id;
							var task_creator_name = data.items[x].task_creator_name;
							var priority = data.items[x].priority;
							var start_date = data.items[x].date_start;
							var target_date = data.items[x].date_end;
							var complete_date = data.items[x].date_completed;
							var task_status = data.items[x].task_status;
							var dependent_taskid = data.items[x].dependent_taskid;
							var project_title = data.items[x].project_title;
							var prior;
							
							
							
							document.getElementById("taskinfo_title").innerHTML='<span class="flaticon-task"> </span>'+task_title;
							document.getElementById("taskinfo_desc").innerHTML=task_description;
							document.getElementById("taskmaster_inf").innerHTML='<label>Task Master  <a data-toggle="modal" href="#userprof" onclick="userprofile('+task_creator_id+');"><span data-toggle="modal" href="#taskinfo"> '+task_creator_name+' </span></a></label>';
							
							if (task_status =='completed') 
							{
								document.getElementById("btn_taskcomplete").disabled = true; 
								document.getElementById("taskdate_inf").innerHTML ='<div class="sub-title-task">Completed since '+complete_date+'</div>'
								document.getElementById("taskstat_inf").innerHTML='<label><span  class="flaticon-Check"> </span> Task Completed</label>';
							}
							else{
								document.getElementById("btn_taskcomplete").disabled = false; 
								document.getElementById("taskdate_inf").innerHTML ='<div class="sub-title-task">'+start_date+' - '+target_date+'</div>'
								document.getElementById("taskstat_inf").innerHTML='<label><span  class="flaticon-project"> </span> Active</label>';
							}
							
							
							
							switch(priority){
							
							case '1': prior = '<label style=" color:white; background:#aeafb1">Low</label>'; break;
							case '2': prior = '<label style=" color:white; background:#2bbce0">Normal</label>'; break;
							case '3': prior = '<label style=" color:white; background:#e73c3c">High</label>'; break;
						
							}
							document.getElementById("priority_inf").innerHTML='<label>Priority  </label> '+prior;
							 
													
							 
							
						}							
					 }
								
				}
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});
	
document.getElementById("taskhdr").innerHTML=proj_inf(pid);	
}
else{
	
	navigator.notification.alert('Network Connection Error Kindly Check your Internet Connection',alertDismissed,'TeamStorm App','Ok');
	
}

	
}

function conf_delete_task()
{	 //test_delete();

	navigator.notification.confirm(
        'Are you sure to delete this task?', 
        delete_task, // <-- no brackets
        'Confirmation Message',
        ['Ok','Cancel']
    );
	
	
}


function delete_task(buttonIndex)
{
		if (buttonIndex==1)
		{
				jQuery.ajax({ 
				type: 'post', 
				async : false,     
				global : false,
				cache: false,
				dataType : 'json',
				url: 'http://teamstormapps.net/mobile/task/delete/'+cur_tid, 
				data: { sid: ses_id},
				beforeSend: function () {
				 preloading2();
				},			
				success: function (data) { 
				
					if(data.status == 1){
							
						navigator.notification.alert('Task deleted',alertDismissed,'TeamStorm App','Ok');
						  getmytask();
						 getproject();
					}
		  },
		  error: function (err) {
			//navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
			//alert(err.message);
			console.log(err.message);
		}
			
		});
			
			
		}
	
}



function projectinfo(id)
{
		
if (checkConnection() >2){
	cur_pid=id;
	jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/info/'+cur_pid, 
			data: { sid: ses_id}, 
			beforeSend: function () {
			 preloading2();
			},
			success: function (data) { 
			
				if(data.status == 1){
						
							
					 var x = 0;	
						
						var creator_id = data.data[x].creator_id;
						var creator_name = data.data[x].creator_name;
						var creator_email = data.data[x].creator_email;
						var title = data.data[x].title;
						var project_description = data.data[x].project_description;
						var members = data.data[x].members;
						var tasks = data.data[x].tasks;
						var posts = data.data[x].posts;
						var files = data.data[x].files;
						
						
						document.getElementById("prjhdr").innerHTML=title;
						document.getElementById("projectinfo_title").innerHTML='<span class="flaticon-folder-open"> </span>'+title;
						document.getElementById("projectinfo_desc").innerHTML=project_description;
						document.getElementById("PLname_inf").innerHTML ='<a data-toggle="modal" href="#userprof" onclick="userprofile('+creator_id+');"><span data-toggle="modal" href="#projectinfo">'+creator_name+'</a>';
						document.getElementById("PLemail_inf").innerHTML =creator_email;
						
						
						document.getElementById("taskcount_inf").innerHTML='<span class="flaticon-task"> </span>'+tasks+' Tasks';
						document.getElementById("membercount_inf").innerHTML='<span class="flaticon-user"> </span>'+members+' Mebers';
						document.getElementById("postcount_inf").innerHTML='<span class="flaticon-comment"> </span>'+posts+' Posts';
						document.getElementById("filescount_inf").innerHTML='<span class="flaticon-folder-open-line"> </span>'+files+' Files';	
						
						document.getElementById("userpicPL_inf").src = "data:image/gif;base64,"+prjleaderpic(creator_id);
					 
					 
						if (creator_id==localStorage.getItem('ts_myid'))
						{
							document.getElementById("btn_projectdelete").disabled = false; 
							document.getElementById("btn_projectedit").disabled = false; 
							document.getElementById("btn_projectcomplete").disabled = false; 
							
						}
						else {
							document.getElementById("btn_projectdelete").disabled = true; 
							document.getElementById("btn_projectedit").disabled = true; 
							document.getElementById("btn_projectcomplete").disabled = true; 
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
else{
	
	navigator.notification.alert('Network Connection Error Kindly Check your Internet Connection',alertDismissed,'TeamStorm App','Ok');
	
}
	
	
}

function prjleaderpic(tsid)
{
var pic="";
	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/user', 
			data: { sid: ses_id, id: tsid}, 
			success: function (data) { 
			
		
			pic = data.preview_pic;
			
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});   
return 	pic;
}


function conf_delete_project()
{	 //test_delete();

	navigator.notification.confirm(
        'Are you sure to delete this project? this will delete all tasks, files, users and coversations. continue?', 
        delete_project, // <-- no brackets
        'Delete Project',
        ['Ok','Cancel']
    );
	
	
}


function delete_project(buttonIndex)
{
		if (buttonIndex==1)
		{
				jQuery.ajax({ 
				type: 'post', 
				async : false,     
				global : false,
				cache: false,
				dataType : 'json',
				url: 'http://teamstormapps.net/mobile/project/delete/'+cur_pid, 
				data: { sid: ses_id},
				beforeSend: function () {
				 preloading2();
				},			
				success: function (data) { 
				
					if(data.status == 1){
							
						navigator.notification.alert('Project deleted',alertDismissed,'TeamStorm App','Ok');
						 getmytask();
						 getproject();
					}
		  },
		  error: function (err) {
			//navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
			//alert(err.message);
			console.log(err.message);
		}
			
		});
			
			
		}
	
}




function gettasklist(id)
{
	jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/tasklist/'+id, 
			data: { sid: ses_id}, 
			success: function (data) { 
			
				if(data.status == 1){
						
					 numoftask=data.items.length;			
					 for(var x = 0; x < data.items.length; x++){	
						
						alltaskid[x] = data.items[x].id;
						alltaskname[x] = data.items[x].task_title;
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

function getprojectlist()
{
	
	
	var appendHTML = '';

	  jQuery.ajax({ 
			type: 'post', 
			async : true,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/getlist', 
			data: { sid: ses_id },
			beforeSend: function () {
			 preloading2();
			},				
			success: function (data) { 
						 
				 for(var x = 0; x < data.length; x++){
					var pid= data[x].id;
					var project_creator= data[x].project_creator;
					var project_title= data[x].project_title;   
					var project_description= data[x].project_description;
					var date_last_update= data[x].date_last_update;
					var date_created= data[x].date_created;  
					var is_deleted= data[x].is_deleted;
					var status= data[x].status;
					var creator_name= data[x].creator_name;
					var percentcomplete=0;
					var numact,numpen,numcomp;
					var p_title ="'"+project_title+"'";
					
					var parts,dayparts,createdate;
					parts =date_created.split('-');
					dayparts =parts[2].split(' ');
					months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
					createdate =months[parts[1]-1]+" "+dayparts[0]+", "+parts[0];
					
				
					
					/* proj_inf(pid);
					if (proj_completed==1)
					{
						isproj_complete=100;
					}
					else
					{
						isproj_complete=0;
					} */
						numact=getcounttask(pid,"active");
						numpen=getcounttask(pid,"pending");
						numcomp=getcounttask(pid,"completed");
					
					
					appendHTML+= '<div class="inner-wrapper">'+
							'<div class="task-wrapper">'+
							
							'<div class=" left-border" style="width:100%">'+
                                '<div class="title-task"><a data-toggle="modal" href="#projectinfo" data-role="button" type="button" onclick="projectinfo('+pid+');" ><span data-toggle="modal" href="#project">'+project_title+'</span></a>'+
                                '</div>'+
                                '<div class="sub-title-task">Date Created: '+createdate+'</div>'+
                               /*  '<div class="progress">'+
                                    '<div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: '+isproj_complete+'%">'+
                                        '<span class="progress-type">'+isproj_complete+'%</span>'+
                                    '</div>'+
                                '</div>'+ */
                                '<div class="task-description">'+project_description+'</div>';
								
								
						
								
                    appendHTML+='<div class="project-status">'+
                                   '<ul class="clearfix">'+
                                        '<li>'+
                                            '<div class="title" ><a data-toggle="modal" href="#task" data-role="button" type="button" onclick="loadtask('+p_title+','+pid+');"><p data-toggle="modal" href="#project" style="margin: 0 0 0px;">Tasks</p></a></div>'+
                                        '</li>'+
                                        '<li>'+
                                            '<div class="stats">Active</div>'+
                                            '<div class="count">'+numact+'</div>'+
                                       '</li>'+
                                        '<li>'+
                                            '<div class="stats">Pending</div>'+
                                            '<div class="count">'+numpen+'</div>'+
                                        '</li>'+
                                        '<li>'+
                                            '<div class="stats">Completed</div>'+
                                            '<div class="count">'+numcomp+'</div>'+
                                        '</li>'+
                                    '</ul>'+
                                '</div>';
								
								
								
                       appendHTML+='<div class="task-user">'+
                                    '<ul>';
								
								get_proj_member(pid);
									
								 for(var i = 0; i < numofmembers; i++){	
                                     
									 
									 
									 getprofpic(allmemberid[i]);
									 
									 appendHTML+='<li>'+
                                            '<a data-toggle="modal" href="#userprof" onclick="userprofile('+allmemberid[i]+');"><img data-toggle="modal" href="#project" class="img-circle" src="data:image/gif;base64,'+proj_mem_profpic+'" width="50" height="50" alt="Image"></a>'+
											'</li>';
									  
									  
								}
					   
					   appendHTML+='</ul>'+
								
                                '</div>';
								
                appendHTML+='</div>'+
                            '<div class="right-border">'+
                                '<div class="link-wrapper">'+
                                    '<a  data-role="button" type="button" class="arrow-link" ><span class="flaticon-arrow-right"></span></a>'+
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
	var pname="";
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
					
					proj_completed = data.data[0].is_completed;
					pname=data.data[0].title;
								
				}
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
}); 
  return pname;
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
			beforeSend: function () {
			 preloading2();
			},
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

function getprofpic(tsid)
{

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

function clearprj_text()
{
	document.getElementById("txt_prj_name").value ="";
	document.getElementById("txt_prj_desc").value ="";

}

function getcounttask(id,type)
{
	var counttask=0;
	jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/tasklist/'+id, 
			data: { sid: ses_id,
					sort: type}, 
			success: function (data) { 
			
				if(data.status == 1){
						
					 counttask=data.items.length;			
					 								
				}
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});
	
return counttask;	
}



function loadtask(pname,pid)
{
	//preloading2();
	document.getElementById("viewtaskhdr").innerHTML=pname+"-Task List";
	cur_pid=pid;
	document.getElementById("active-task").innerHTML="";
	document.getElementById("pending-task").innerHTML="";
	document.getElementById("completed-task").innerHTML="";
	gettaskactive();
	gettaskcompleted();
	gettaskpending();
	document.getElementById("viewnewtaskhdr").innerHTML=pname+"-Create Task";
	//dependanttask_select();
	//get_proj_mem_for_task();
	
	$.when(
	
	).then(function() {
	
	});
}
function gettaskactive()
{
var appendHTML ='';
var type='active';
document.getElementById(""+type+"-task").innerHTML="";

		jQuery.ajax({ 
			type: 'post', 
			async : true,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/tasklist/'+cur_pid, 
			data: { sid: ses_id,
					sort: type}, 
			 beforeSend: function () {
			 preloading2();
			},			
			success: function (data) { 
			
				if(data.status == 1){
					
					 for(var x = 0; x < data.items.length; x++){	
						var id =data.items[x].id;
						var dependent_taskid =data.items[x].dependent_taskid;
						var task_title =data.items[x].task_title;
						var task_description =data.items[x].task_description;
						var task_creator_id =data.items[x].task_creator_id;
						var task_creator_name =data.items[x].task_creator_name;
						var priority =data.items[x].priority;
						var date_created =data.items[x].date_created;
						var date_start =data.items[x].date_start;
						var date_end =data.items[x].date_end;
						var date_completed =data.items[x].date_completed;
						var task_status =data.items[x].task_status;
						/* var progval=0;
						var progbarclass=""
						if (type=="completed")
						{
							progval=100;
							progbarclass="progress-bar-success";
						}
						else{
							progval=0;
							progbarclass="progress-bar-primary";
						} */
						
						
						appendHTML +='<div id="task-'+id+'" class="inner-wrapper"> <div class="task-wrapper">'+
									'<div class="left-border" style="width:100%;">'+
									'<div class="title-task"><a data-toggle="modal" href="#taskinfo"  onclick="getmytaskinfo('+cur_pid+','+id+');"> <i data-toggle="modal" href="#task"><i/>'+task_title+'</a>'+
                                    '</div>'+
                                    /* '<div class="progress">'+
                                        '<div class="progress-bar '+progbarclass+'" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: '+progval+'%">'+
                                            '<span class="progress-type">'+progval+'%</span>'+
                                        '</div>'+
                                    '</div>'+ */
                                    '<div class="task-description">'+task_description+'</div>';
									
						switch(priority){
							
							case '1': appendHTML += '<label style=" color:white; background:#aeafb1">Low</label>'; break;
							case '2': appendHTML += '<label style=" color:white; background:#2bbce0">Normal</label>'; break;
							case '3': appendHTML += '<label style=" color:white; background:#e73c3c">High</label>'; break;
						
						}			
									
						
						gettaskprofpic(task_creator_id);			
						appendHTML +='<div class="task-user">'+
                                       '<ul>'+
                                            '<li>'+
                                                '<a data-toggle="modal" href="#userprof" onclick="userprofile('+task_creator_id+');"><img data-toggle="modal" href="#task" class="img-circle" src="data:image/gif;base64,'+task_mem_profpic+'" width="50" height="50" width="50" alt="Image">'+
                                                '</a>'+
                                            '</li>'+
                                        '</ul>'+
                                    '</div>';
						appendHTML +='</div>';
						
						 appendHTML +='<div class="right-border">'+
                                    '<div class="link-wrapper">'+
                                       ' <a  class="arrow-link"><span class="flaticon-arrow-right"></span></a>'+
                                    '</div>'+
                                '</div></div></div>';
						
						
					 }
								
				}
				
				
				if (appendHTML.length >0){
				 window.localStorage["get"+type+"task"]= appendHTML; 
				
				}
				else{
				 window.localStorage["get"+type+"task"]= ""; 
				
				}
				
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});
document.getElementById(""+type+"-task").innerHTML=window.localStorage.getItem('get'+type+'task');
	
}
function gettaskpending()
{
var appendHTML ='';
var type='pending';
document.getElementById(""+type+"-task").innerHTML="";


		jQuery.ajax({ 
			type: 'post', 
			async : true,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/tasklist/'+cur_pid, 
			data: { sid: ses_id,
					sort: type}, 
			 beforeSend: function () {
			 preloading2();
			},			
			success: function (data) { 
			
				if(data.status == 1){
					
					 for(var x = 0; x < data.items.length; x++){	
						var id =data.items[x].id;
						var dependent_taskid =data.items[x].dependent_taskid;
						var task_title =data.items[x].task_title;
						var task_description =data.items[x].task_description;
						var task_creator_id =data.items[x].task_creator_id;
						var task_creator_name =data.items[x].task_creator_name;
						var priority =data.items[x].priority;
						var date_created =data.items[x].date_created;
						var date_start =data.items[x].date_start;
						var date_end =data.items[x].date_end;
						var date_completed =data.items[x].date_completed;
						var task_status =data.items[x].task_status;
						/* var progval=0;
						var progbarclass=""
						if (type=="completed")
						{
							progval=100;
							progbarclass="progress-bar-success";
						}
						else{
							progval=0;
							progbarclass="progress-bar-primary";
						} */
						
						
						appendHTML +='<div id="task-'+id+'" class="inner-wrapper"> <div class="task-wrapper">'+
									'<div class="left-border" style="width:100%;">'+
									'<div class="title-task"><a data-toggle="modal" href="#taskinfo"  onclick="getmytaskinfo('+cur_pid+','+id+');"> <i data-toggle="modal" href="#task"><i/>'+task_title+'</a>'+
                                    '</div>'+
                                    /* '<div class="progress">'+
                                        '<div class="progress-bar '+progbarclass+'" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: '+progval+'%">'+
                                            '<span class="progress-type">'+progval+'%</span>'+
                                        '</div>'+
                                    '</div>'+ */
                                    '<div class="task-description">'+task_description+'</div>';
									
						switch(priority){
							
							case '1': appendHTML += '<label style=" color:white; background:#aeafb1">Low</label>'; break;
							case '2': appendHTML += '<label style=" color:white; background:#2bbce0">Normal</label>'; break;
							case '3': appendHTML += '<label style=" color:white; background:#e73c3c">High</label>'; break;
						
						}			
									
						
						gettaskprofpic(task_creator_id);			
						appendHTML +='<div class="task-user">'+
                                       '<ul>'+
                                            '<li>'+
                                                '<a data-toggle="modal" href="#userprof" onclick="userprofile('+task_creator_id+');"><img data-toggle="modal" href="#task" class="img-circle" src="data:image/gif;base64,'+task_mem_profpic+'" width="50" height="50" width="50" alt="Image">'+
                                                '</a>'+
                                            '</li>'+
                                        '</ul>'+
                                    '</div>';
						appendHTML +='</div>';
						
						 appendHTML +='<div class="right-border">'+
                                    '<div class="link-wrapper">'+
                                       ' <a  class="arrow-link"><span class="flaticon-arrow-right"></span></a>'+
                                    '</div>'+
                                '</div></div></div>';
						
						
					 }
								
				}
				
				
				if (appendHTML.length >0){
				 window.localStorage["get"+type+"task"]= appendHTML; 
				
				}
				else{
				 window.localStorage["get"+type+"task"]= ""; 
				
				}
				
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});
document.getElementById(""+type+"-task").innerHTML=window.localStorage.getItem('get'+type+'task');
	
}
function gettaskcompleted()
{
var appendHTML ='';
var type='completed';
document.getElementById(""+type+"-task").innerHTML="";

		jQuery.ajax({ 
			type: 'post', 
			async : true,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/tasklist/'+cur_pid, 
			data: { sid: ses_id,
					sort: type}, 
			 beforeSend: function () {
			 preloading2();
			},			
			success: function (data) { 
			
				if(data.status == 1){
					
					 for(var x = 0; x < data.items.length; x++){	
						var id =data.items[x].id;
						var dependent_taskid =data.items[x].dependent_taskid;
						var task_title =data.items[x].task_title;
						var task_description =data.items[x].task_description;
						var task_creator_id =data.items[x].task_creator_id;
						var task_creator_name =data.items[x].task_creator_name;
						var priority =data.items[x].priority;
						var date_created =data.items[x].date_created;
						var date_start =data.items[x].date_start;
						var date_end =data.items[x].date_end;
						var date_completed =data.items[x].date_completed;
						var task_status =data.items[x].task_status;
						/* var progval=0;
						var progbarclass=""
						if (type=="completed")
						{
							progval=100;
							progbarclass="progress-bar-success";
						}
						else{
							progval=0;
							progbarclass="progress-bar-primary";
						} */
						
						
						appendHTML +='<div id="task-'+id+'" class="inner-wrapper"> <div class="task-wrapper">'+
									'<div class="left-border" style="width:100%;">'+
									'<div class="title-task"><a data-toggle="modal" href="#taskinfo"  onclick="getmytaskinfo('+cur_pid+','+id+');"> <i data-toggle="modal" href="#task" ><i/>'+task_title+'</a>'+
                                    '</div>'+
                                    /* '<div class="progress">'+
                                        '<div class="progress-bar '+progbarclass+'" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: '+progval+'%">'+
                                            '<span class="progress-type">'+progval+'%</span>'+
                                        '</div>'+
                                    '</div>'+ */
                                    '<div class="task-description">'+task_description+'</div>';
									
						switch(priority){
							
							case '1': appendHTML += '<label style=" color:white; background:#aeafb1">Low</label>'; break;
							case '2': appendHTML += '<label style=" color:white; background:#2bbce0">Normal</label>'; break;
							case '3': appendHTML += '<label style=" color:white; background:#e73c3c">High</label>'; break;
						
						}			
									
						
						gettaskprofpic(task_creator_id);			
						appendHTML +='<div class="task-user">'+
                                       '<ul>'+
                                            '<li>'+
                                                '<a data-toggle="modal" href="#userprof" onclick="userprofile('+task_creator_id+');"><img data-toggle="modal" href="#task" class="img-circle" src="data:image/gif;base64,'+task_mem_profpic+'" width="50" height="50" width="50" alt="Image">'+
                                                '</a>'+
                                            '</li>'+
                                        '</ul>'+
                                    '</div>';
						appendHTML +='</div>';
						
						 appendHTML +='<div class="right-border">'+
                                    '<div class="link-wrapper">'+
                                       ' <a  class="arrow-link"><span class="flaticon-arrow-right"></span></a>'+
                                    '</div>'+
                                '</div></div></div>';
						
						
					 }
								
				}
				
				
				if (appendHTML.length >0){
				 window.localStorage["get"+type+"task"]= appendHTML; 
				
				}
				else{
				 window.localStorage["get"+type+"task"]= ""; 
				
				}
				
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});
document.getElementById(""+type+"-task").innerHTML=window.localStorage.getItem('get'+type+'task');
	
}




function gettaskprofpic(tsid)
{

	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/user', 
			data: { sid: ses_id, id: tsid}, 
			success: function (data) { 
			
		
			task_mem_profpic = data.preview_pic;
			
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});   
	
}


function create_project()
{
var pname=document.getElementById("txt_prj_name").value;
var pdesc=document.getElementById("txt_prj_desc").value;
	
	jQuery.ajax({ 
			type: 'post', 
			async : true,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/create', 
			data: { sid: ses_id,
					name:pname,
					description:pdesc}, 
			success: function (data) { 
			
				if(data.status == 1){
					clearprj_text();
					getproject();
					
				}
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
}); 	
	
}
function new_task()
{
	dependanttask_select();
	get_proj_mem_for_task();
}

function dependanttask_select(){	
	var appendHTML = '<option value="0">None</option>';
	
	
	 jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/tasklist/'+cur_pid, 
			data: { sid: ses_id,
					sort: 'active'}, 
			success: function (data) { 

				if(data.status == 1){
						
					 for(var x = 0; x < data.items.length; x++){
				
					appendHTML += '<option value="'+data.items[x].id+'">'+data.items[x].task_title+'</option>';
			
					}
				}
			
			},				
			error: function (err) {
        
		console.log(err.message);
    }});
	window.localStorage["dependanttask"]= appendHTML; 	
  document.getElementById("select_deptask").innerHTML=window.localStorage.getItem('dependanttask');	    	
}


function get_proj_mem_for_task()
{	

	var appendHTML = '';
	jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/memberlist/'+cur_pid, 
			data: { sid: ses_id}, 
			success: function (data) { 
			
				if(data.status == 1){
					
				
			    for(var x = 0; x < data.items.length; x++){
						 
						var id=data.items[x].id;
						var role= data.items[x].role;
						var email= data.items[x].email;
						var name= data.items[x].name;
						
						 appendHTML +='<tr class="checked-list">'; 
						 getmemprofpic(id);
						 appendHTML +='<td><div class="portrait-status chat"><a data-toggle="modal" href="#userprof" onclick="userprofile('+id+');" ><img data-toggle="modal" href="#newtask" src="data:image/gif;base64,'+task_mem_profpic1+'" height="45" width="45" class="img-circle"></a></div>';
						  
						appendHTML +='<td><a data-toggle="modal" href="#userprof" onclick="userprofile('+id+');"><i data-toggle="modal" href="#newtask" ></i>'+name+'</a><p style="font-size:10px;"><i class="flaticon-email" > '+email+'</i></p></td></td><td><div class="checkbox" name="chk_members" ><input type="checkbox" id="flat-checkbox-1" name="chk_members" class="icheckbox_flat" value="'+id+'"></div></td></tr>';
					}			
				}
				
				
				
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
}); 

if (appendHTML.length >0){document.getElementById("fortaskmembers").innerHTML= appendHTML; }
else{document.getElementById("fortaskmembers").innerHTML="";}
	
}

function getmemprofpic(tsid)
{

	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/user', 
			data: { sid: ses_id, id: tsid}, 
			success: function (data) { 
			
		
			task_mem_profpic1 = data.preview_pic;
			
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});   
	
}

function create_task()
{
	var members = getCheckedBoxes('chk_members');
	var chk_members = '';
	
	for(var x = 0; x < members.length; x++){
		chk_members += members[x].value + ',';
	}
	chk_members = chk_members.slice(0,-1);
	
	
	var title = document.getElementById('txt_tasktitle').value;
	var priority = document.getElementById('select_priority').value;
	var desc = document.getElementById('txt_taskdesc').value;
	var startdate = document.getElementById('txt_startdate').value
	var duedate = document.getElementById('txt_duedate').value;
	var depentask = document.getElementById('select_deptask').value;
	
	
	jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/task/create', 
			data: { sid: ses_id,
					project_id: cur_pid,
					title: title,
					description:desc,
					startdate:startdate,
					duedate:duedate,
					priority:priority,
					members:chk_members,
					dependent:depentask
					}, 
			success: function (data) { 
			
				if(data.status == 1){
					
					cleartsk_text();
					getproject();
					
				}
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
}); 	
	 
	
}

function getCheckedBoxes(chkboxName) {
  var checkboxes = document.getElementsByName(chkboxName);
  var checkboxesChecked = [];
  // loop over them all
  for (var i=0; i<checkboxes.length; i++) {
     // And stick the checked ones onto an array...
     if (checkboxes[i].checked) {
        checkboxesChecked.push(checkboxes[i]);
     }
  }
  // Return the array if it is non-empty, or null
  return checkboxesChecked.length > 0 ? checkboxesChecked : '';
}
function cleartsk_text(){
	
	var curdate = new Date();
	var preDate =(curdate.getMonth()+1) + '/' + curdate.getDate() + '/' +
        curdate.getFullYear() + ' '+curdate.getHours() + ':' + curdate.getMinutes();
		
	document.getElementById('txt_tasktitle').value="";
	document.getElementById('select_priority').value="";
	document.getElementById('txt_taskdesc').value="";
	document.getElementById('txt_startdate').value=preDate;
	document.getElementById('txt_duedate').value=preDate;
	document.getElementById('select_deptask').value="";
}


