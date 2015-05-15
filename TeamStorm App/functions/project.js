var ses_id = window.localStorage.getItem('session_id');
var proj_completed = 0;
var allmemberid = new Array();
var allmemberpic = new Array();
var alltaskid= new Array();
var alltaskname= new Array();
var mytask= new Array();

var taskmemid= new Array();
var taskmempic= new Array();
var numtaskmem;

var numoftask;
var numofmembers;

var task_mem_profpic="";
var cur_pid;
var cur_tid;
var del_assid,del_uid,del_tid;
var task_mem_profpic1="";

var onedit_id,onedit_title,onedit_description,onedit_priority,onedit_start_date,onedit_end_date,onedit_task_status,onedit_dependent; 

var isnewtask=0;
var ismytask=0;

function getproject()
{
	var appendHTML ='<li><a data-toggle="modal" href="#newproject" onclick="newproject();" ><i class="flaticon-folder-plus"></i> Create New Project</a></li>';
	var list_prj_count=0;
	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/getlist', 
			data: { sid: ses_id }, 
			success: function (data) { 
				
				list_prj_count=data.length;		
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
					
					/* if (numoftask>0){ */
						
						appendHTML+= '<i class="flaticon-menu pull-right"></i></a>';
						appendHTML+= '<ul id="collapse-projects-task-lists-'+pid+'" class="panel-collapse collapse">';
					
						appendHTML+= '<li><a data-toggle="modal" href="#projectinfo"  onclick="projectinfo('+pid+');"  ><span class="flaticon-folder-open-line"> </span> Project Info</a></li>';
						appendHTML+= '<li><a data-toggle="modal" href="#newtask"  onclick="new_task('+pid+');"  ><span class="glyphicon glyphicon-plus-sign"> </span> Add New Task</a></li>';
					
						for(var i = 0; i < numoftask; i++){	
						
							appendHTML+= '<li><a id='+alltaskid[i]+' data-toggle="modal" href="#taskinfo"  onclick="getmytaskinfo('+pid+','+alltaskid[i]+')"  ><span class="flaticon-task"> </span> '+alltaskname[i]+'</a></li>';
							
						}
						
						appendHTML+= '</ul>';
/* 					}
					else{
						appendHTML+= '</a>';
						
					} */
										
					
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
document.getElementById("list_prj_cont").innerHTML='('+list_prj_count+')';
}
function getmytask()
{
	var appendHTML ='';
	var list_mytsk_count=0;
	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/task/get_active', 
			data: { sid: ses_id }, 
			success: function (data) { 
				list_mytsk_count=data.length;
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
							mytask[x]=id;
							
				}
				 			 
				if (appendHTML.length >0){
					
					window.localStorage["getmytask"]=appendHTML;
				}
				else{
					
					window.localStorage["getmytask"]='';
				}
				
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});  
	
	
document.getElementById("collapse-tasks").innerHTML=window.localStorage.getItem('getmytask');
document.getElementById("list_mytsk_count").innerHTML='('+list_mytsk_count+')';
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
							
							
							
							
							switch(priority){
							
							case '1': prior = '<label style=" color:white; background:#aeafb1">Low</label>'; break;
							case '2': prior = '<label style=" color:white; background:#2bbce0">Normal</label>'; break;
							case '3': prior = '<label style=" color:white; background:#e73c3c">High</label>'; break;
						
							}
							document.getElementById("priority_inf").innerHTML='<label>Priority  </label> '+prior;
							 
							if (proj_creator(pid)==localStorage.getItem('ts_myid'))
							{
								document.getElementById('t_request').style.display="block";
								document.getElementById("btn_taskcomplete").disabled = false; 
								document.getElementById("btn_taskedit").disabled = false; 
								document.getElementById("btn_taskdelete").disabled = false; 
								
							}								
							else
							{
								document.getElementById('t_request').style.display="none";
								document.getElementById("btn_taskcomplete").disabled = true; 
								document.getElementById("btn_taskedit").disabled = true; 
								document.getElementById("btn_taskdelete").disabled = true; 
							}								
							
							posttask(pid,tid,task_title);
							
							if(jQuery.inArray(data.items[x].id, mytask ) > -1){
								document.getElementById('btn_addtask_leavetask').innerHTML='Leave Task';
								ismytask=1;
							}
							else{
								document.getElementById('btn_addtask_leavetask').innerHTML='<i class="glyphicon glyphicon-plus-sign"></i> Add to my Task';
								ismytask=0;
							}		
							
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
							
							
							onedit_id = data.items[x].id;
							onedit_title= task_title;
							onedit_description= task_description;
							onedit_priority=priority;
							onedit_start_date=start_date;
							onedit_end_date=target_date;
							onedit_task_status=task_status;
							onedit_dependent=dependent_taskid;
							cur_pid=pid;
						}							
					 }
				
                    writejsonfile();
				}
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});
	

gettaskmembers(tid);
getrequesttask(tid);
document.getElementById("taskhdr").innerHTML=proj_inf(pid);	


}
else{
	
	navigator.notification.alert('Network Connection Error Kindly Check your Internet Connection',alertDismissed,'TeamStorm App','Ok');
	
}

	
}


function writejsonfile()
{
    var jf = require('jsonfile')

    var file = '/json/events.json'
    var obj = {date: '2015-05-20 17:30:00',
               type: 'meeting',
               title: 'Test1',
               description:' For Test Only'}

    jf.writeFileSync(file, obj)
    
}



function conf_complete_task()
{	 //test_delete();

	navigator.notification.confirm(
        'Are you sure to want to set this task to "Complete"?', 
        settaskcomplete, // <-- no brackets
        'Confirmation Message',
        ['Ok','Cancel']
    );
	
	
}


function settaskcomplete(buttonIndex)
{
    if (buttonIndex==1)
		{
    				jQuery.ajax({ 
    				type: 'post', 
    				async : false,     
    				global : false,
    				cache: false,
    				dataType : 'json',
    				url: 'http://teamstormapps.net/mobile/task/complete/'+cur_tid, 
    				data: { sid: ses_id},
    				beforeSend: function () {
    				 preloading2();
    				},			
    				success: function (data) { 
    				
    					if(data.status == 1){
    							
    						navigator.notification.alert('Task Completed',alertDismissed,'TeamStorm App','Ok');
                            getmytaskinfo(cur_pid,cur_tid);
                            document.getElementById("btn_taskcomplete").disabled = true; 
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


function onedittask()
{
	
	isnewtask=0;
	document.getElementById('txt_tasktitle').value=onedit_title;
	document.getElementById('select_priority').value=onedit_priority;
	document.getElementById('txt_taskdesc').value=onedit_description;
	document.getElementById('txt_startdate').value=onedit_start_date;
	document.getElementById('txt_duedate').value=onedit_end_date;
	dependanttask_select();
	var depentask = document.getElementById('select_deptask').value=onedit_dependent;
	document.getElementById("fortaskmembers").innerHTML=""
	document.getElementById("viewnewtaskhdr").innerHTML="Edit Task";
	
}



function add_leave_task()
{
	if (ismytask>0)
	{
		//Leave Task
		
		navigator.notification.confirm(
        'Are you sure to want to leave this task?', 
        leave_task, // <-- no brackets
        'Confirmation Message',
        ['Ok','Cancel']
		);
		
	}
	else{
		//Join Task
		jQuery.ajax({ 
				type: 'post', 
				async : false,     
				global : false,
				cache: false,
				dataType : 'json',
				url: 'http://teamstormapps.net/mobile/task/join/'+onedit_id, 
				data: { sid: ses_id},
				beforeSend: function () {
				 preloading2();
				},			
				success: function (data) { 
				
					if(data.status == 1){
							document.getElementById('btn_addtask_leavetask').innerHTML='Leave Task';
							ismytask=1;
							getmytask();

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

function leave_task(buttonIndex)
{
		if (buttonIndex==1)
		{
			
			jQuery.ajax({ 
				type: 'post', 
				async : false,     
				global : false,
				cache: false,
				dataType : 'json',
				url: 'http://teamstormapps.net/mobile/task/leave/'+onedit_id, 
				data: { sid: ses_id},
				beforeSend: function () {
				 preloading2();
				},			
				success: function (data) { 
				
					if(data.status == 1){
							
						document.getElementById('btn_addtask_leavetask').innerHTML='<i class="glyphicon glyphicon-plus-sign"></i> Add to my Task';
						ismytask=0;
						getmytask();
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


function conf_delete_task()
{	 //test_delete();

	navigator.notification.confirm(
        'Are you sure to delete this task?', 
        delete_task, // <-- no brackets
        'Confirmation Message',
        ['Ok','Cancel']
    );
	
	
}

function testmodal()
{

	$('#taskinfo').modal('hide');
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
						document.getElementById("PLname_inf").innerHTML ='<a data-toggle="modal" href="#userprof" onclick="userprofile('+creator_id+');"><span data-toggle="modal" href="#projectinfoprojectinfoprojectinfo">'+creator_name+'</a>';
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
				    
                    
                    document.getElementById("txt_editprj_name").value =title;
                    
                    document.getElementById("txt_editprj_desc").value =project_description;
                    
                    document.getElementById("select_editprj_privacy").value ='0';
                    
				}
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
	
		console.log(err.message);
	
    }
      	
});
	

}
else{
	
	navigator.notification.alert('Network Connection Error Kindly Check your Internet Connection',alertDismissed,'TeamStorm App','Ok');
	
}
	
	
}


function conf_archive_project()
{
    navigator.notification.confirm(
        'Complete this project and move to archive?', 
        archive_project, // <-- no brackets
        'Archive Project',
        ['Ok','Cancel']
    );
	
    
}
function archive_project(buttonIndex)
{
     if (buttonIndex==1)
		{
    				jQuery.ajax({ 
    				type: 'post', 
    				async : false,     
    				global : false,
    				cache: false,
    				dataType : 'json',
    				url: 'http://teamstormapps.net/mobile/project/archive/'+cur_pid, 
    				data: { sid: ses_id},
    				beforeSend: function () {
    				 preloading2();
    				},			
    				success: function (data) { 
    				
    					if(data.status == 1){
    							
    						navigator.notification.alert('Project is now in Archive',alertDismissed,'TeamStorm App','Ok');
                            projectinfo(cur_pid);
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


function edit_project()
{

 var pname=document.getElementById("txt_editprj_name").value;
var pdesc=document.getElementById("txt_editprj_desc").value;
var privacy=document.getElementById("select_editprj_privacy").value;
var approval = document.getElementById('chk_editprj_taskapproval').checked;    
	jQuery.ajax({ 
			type: 'post', 
			async : true,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/edit/'+cur_pid, 
			data: { sid: ses_id,
					title:pname,
					description:pdesc,
					privacy:privacy,
                    task_approval:approval }, 
			beforeSend: function () {
			 preloading2();
			},
			success: function (data) { 
			
				if(data.status == 1){
					clearprj_text();
					getproject();
					navigator.notification.alert('Project Updated',alertDismissed,'TeamStorm App','Ok');
                    projectinfo(cur_pid);
				}
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
}); 
    
    
    
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
			async : false,     
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
					

					appendHTML+= '<div class="inner-wrapper">'+
							'<div class="task-wrapper">'+
							
							'<div class=" left-border" style="width:100%">'+
                                '<div class="title-task"><a data-toggle="modal" href="#projectinfo" data-role="button" type="button" onclick="projectinfo('+pid+');" ><span data-toggle="modal" href="#project">'+project_title+'</span></a>'+
                                '</div>'+
                                '<div class="sub-title-task">Date Created: '+createdate+'</div>';
                       
																					
								
                    appendHTML+='<div class="project-status">'+
                                   '<ul class="clearfix">'+
                                        '<li>'+
                                            '<div class="title" ><a data-toggle="modal" href="#task" data-role="button" type="button" onclick="loadtask('+p_title+','+pid+');"><span data-toggle="modal" href="#project" style="margin: 0 0 0px;"></span>Tasks</a></div>'+
                                        '</li>'+
                                        '<li>'+
                                            '<div class="stats">Active</div>'+
                                            '<div class="count">'+getcounttask(pid,"active")+'</div>'+
                                       '</li>'+
                                        '<li>'+
                                            '<div class="stats">Pending</div>'+
                                            '<div class="count">'+getcounttask(pid,"pending")+'</div>'+
                                        '</li>'+
                                        '<li>'+
                                            '<div class="stats">Completed</div>'+
                                            '<div class="count">'+getcounttask(pid,"completed")+'</div>'+
                                        '</li>'+
                                    '</ul>'+
                                '</div>';																					
                       appendHTML+='<div class="task-user">'+
                                    '<ul>';
								
								get_proj_member(pid);
									
								 for(var i = 0; i < numofmembers; i++){	

									 appendHTML+='<li>'+
                                            '<a data-toggle="modal" href="#userprof" onclick="userprofile('+allmemberid[i]+');"><img data-toggle="modal" href="#project" class="img-circle" src="'+allmemberpic[i]+'" width="50" height="50" alt="Image"></a>'+
											'</li>';		  
								}
					   
					   appendHTML+='</ul>'+
								
                                '</div>';
								
                appendHTML+='</div>'+
                            '<div class="right-border">'+
                                '<div class="link-wrapper">'+
                                    '<a  data-role="button" type="button" class="arrow-link" data-toggle="modal" href="#newpost" onclick="postproject('+pid+');"  ><span class="flaticon-arrow-right"></span><i data-toggle="modal" href="#project"><i/></a>'+
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


function postproject(id)
{
	loadprojects_select();
	clearposttext();
	document.getElementById("divselectproject").style.display="block"; 
	document.getElementById('select_projlists').value=id;
	document.getElementById("searchpostuser").style.display="none"; 
}


function posttask(pid,id,name)
{
	clearposttext();
	document.getElementById("divselectproject").style.display="none"; 
	document.getElementById("searchpostuser").style.display="none"; 
	document.getElementById("tasknamepost").innerHTML='Post to Task  <span class="flaticon-task"> </span>'+name;
	document.getElementById('txtposttotaskid').value =id;
	document.getElementById('txtposttotaskprjid').value =pid;
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
			/* beforeSend: function () {
			 preloading2();
			}, */
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

function proj_creator(id)
{
	var creatorid=0;

jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/info/'+id, 
			data: { sid: ses_id}, 
			/* beforeSend: function () {
			 preloading2();
			}, */
			success: function (data) { 
			
				
				if(data.status == 1){
					
				
					creatorid=data.data[0].creator_id;
								
				}
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
}); 
 
  return creatorid;
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
			/* beforeSend: function () {
			 preloading2();
			}, */
			success: function (data) { 
			
				if(data.status == 1){
					
				numofmembers=0;
			    for(var x = 0; x < data.items.length; x++){
						
					  if (data.items[x].role=='Project Leader' || data.items[x].role=='Co Leader' )	{
							
						allmemberid[numofmembers] = data.items[x].id;
						allmemberpic[numofmembers] = data.items[x].profile_pic;
						numofmembers+=1;
						
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
}

function getprofpic(tsid)
{
	var pic="img/user/thumb-user-medium.jpg";
	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/user', 
			data: { sid: ses_id, id: tsid}, 
			success: function (data) { 
			
		
			 pic= data.profile_pic;
			
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});   
return pic;
}

function clearprj_text()
{
	document.getElementById("txt_prj_name").value ="";
	document.getElementById("txt_prj_desc").value ="";
    
    document.getElementById("txt_editprj_name").value="";
    document.getElementById("txt_editprj_desc").value="";
    document.getElementById("select_editprj_privacy").value=0;
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
						
						var task_name ="'"+task_title+"'";
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
                                    '</div>';
                                    /* '<div class="progress">'+
                                        '<div class="progress-bar '+progbarclass+'" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: '+progval+'%">'+
                                            '<span class="progress-type">'+progval+'%</span>'+
                                        '</div>'+
                                    '</div>'+ */
                                   /*  '<div class="task-description">'+task_description+'</div>'; */
									
						switch(priority){
							
							case '1': appendHTML += '<label style=" color:white; background:#aeafb1">Low</label>'; break;
							case '2': appendHTML += '<label style=" color:white; background:#2bbce0">Normal</label>'; break;
							case '3': appendHTML += '<label style=" color:white; background:#e73c3c">High</label>'; break;
						
						}			
									
						
						//gettaskprofpic(task_creator_id);
						gettaskmemberspic(id);
						
						appendHTML +='<div class="task-user">'+
                                       '<ul>';

						 for(var i = 0; i < numtaskmem; i++){	

									 appendHTML+='<li>'+
                                                '<a data-toggle="modal" href="#userprof" onclick="userprofile('+taskmemid[i]+');"><img data-toggle="modal" href="#task" class="img-circle" src="data:image/gif;base64,'+taskmempic[i]+'" width="50" height="50" width="50" alt="Image">'+
                                                '</a>'+
                                            '</li>';		  
								}	
						
						appendHTML +='</ul></div></div>';
						
						
						
						 appendHTML +='<div class="right-border">'+
                                    '<div class="link-wrapper">'+
                                       ' <a class="arrow-link"><span class="flaticon-arrow-right"  data-toggle="modal" href="#newpost" onclick="posttask('+cur_pid+','+id+','+task_name+');" ></span></a>'+
                                    '</div>'+
                                '</div></div></div>';
						
						
					 }
								
				}
				
				
				if (appendHTML.length >0){
				 //window.localStorage["get"+type+"task"]= appendHTML; 
				 document.getElementById(""+type+"-task").innerHTML=appendHTML;
				
				}
				else{
				 //window.localStorage["get"+type+"task"]= ""; 
				 document.getElementById(""+type+"-task").innerHTML="";
				
				}
				
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});
//document.getElementById(""+type+"-task").innerHTML=window.localStorage.getItem('get'+type+'task');
	
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
						
						var task_name ="'"+task_title+"'";
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
                                    '</div>';
                                    /* '<div class="progress">'+
                                        '<div class="progress-bar '+progbarclass+'" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: '+progval+'%">'+
                                            '<span class="progress-type">'+progval+'%</span>'+
                                        '</div>'+
                                    '</div>'+ */
                                    /* '<div class="task-description">'+task_description+'</div>'; */
									
						switch(priority){
							
							case '1': appendHTML += '<label style=" color:white; background:#aeafb1">Low</label>'; break;
							case '2': appendHTML += '<label style=" color:white; background:#2bbce0">Normal</label>'; break;
							case '3': appendHTML += '<label style=" color:white; background:#e73c3c">High</label>'; break;
						
						}			
									
						
						gettaskmemberspic(id);
						appendHTML +='<div class="task-user">'+
                                       '<ul>';
						 for(var i = 0; i < numtaskmem; i++){	

									 appendHTML+='<li>'+
                                                '<a data-toggle="modal" href="#userprof" onclick="userprofile('+taskmemid[i]+');"><img data-toggle="modal" href="#task" class="img-circle" src="data:image/gif;base64,'+taskmempic[i]+'" width="50" height="50" width="50" alt="Image">'+
                                                '</a>'+
                                            '</li>';			  
								}	
						
						appendHTML +='</ul></div></div>';
						
						 appendHTML +='<div class="right-border">'+
                                    '<div class="link-wrapper">'+
                                       ' <a  class="arrow-link"><span class="flaticon-arrow-right" data-toggle="modal" href="#newpost" onclick="posttask('+cur_pid+','+id+','+task_name+');"></span></a>'+
                                    '</div>'+
                                '</div></div></div>';
						
						
					 }
								
				}
				
				
				if (appendHTML.length >0){
				 //window.localStorage["get"+type+"task"]= appendHTML; 
				 document.getElementById(""+type+"-task").innerHTML=appendHTML;
				
				}
				else{
				 //window.localStorage["get"+type+"task"]= ""; 
				 document.getElementById(""+type+"-task").innerHTML="";
				
				}
				
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});
//document.getElementById(""+type+"-task").innerHTML=window.localStorage.getItem('get'+type+'task');
	
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
						var task_name ="'"+task_title+"'";
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
                                    '</div>';
                                    /* '<div class="progress">'+
                                        '<div class="progress-bar '+progbarclass+'" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: '+progval+'%">'+
                                            '<span class="progress-type">'+progval+'%</span>'+
                                        '</div>'+
                                    '</div>'+ */
                                   /*  '<div class="task-description">'+task_description+'</div>'; */
									
						switch(priority){
							
							case '1': appendHTML += '<label style=" color:white; background:#aeafb1">Low</label>'; break;
							case '2': appendHTML += '<label style=" color:white; background:#2bbce0">Normal</label>'; break;
							case '3': appendHTML += '<label style=" color:white; background:#e73c3c">High</label>'; break;
						
						}			
									
						
						gettaskmemberspic(id);
						appendHTML +='<div class="task-user">'+
                                       '<ul>';
						 for(var i = 0; i < numtaskmem; i++){	

								 appendHTML+='<li>'+
                                                '<a data-toggle="modal" href="#userprof" onclick="userprofile('+taskmemid[i]+');"><img data-toggle="modal" href="#task" class="img-circle" src="data:image/gif;base64,'+taskmempic[i]+'" width="50" height="50" width="50" alt="Image">'+
                                                '</a>'+
                                            '</li>';			  
								}	
						
						appendHTML +='</ul></div></div>';
						
						 appendHTML +='<div class="right-border">'+
                                    '<div class="link-wrapper">'+
                                       ' <a  class="arrow-link"><span class="flaticon-arrow-right" data-toggle="modal" href="#newpost" onclick="posttask('+cur_pid+','+id+','+task_name+');"></span></a>'+
                                    '</div>'+
                                '</div></div></div>';
						
						
					 }
								
				}
				
				
				if (appendHTML.length >0){
				 //window.localStorage["get"+type+"task"]= appendHTML; 
				 document.getElementById(""+type+"-task").innerHTML=appendHTML;
				
				}
				else{
				 //window.localStorage["get"+type+"task"]= ""; 
				 document.getElementById(""+type+"-task").innerHTML="";
				
				}
				
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});
//document.getElementById(""+type+"-task").innerHTML=window.localStorage.getItem('get'+type+'task');
	
}
function gettaskmemberspic(tid)
{
	
	
	 jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/task/members/'+tid, 
			data: { sid: ses_id}, 
			success: function (data) { 
			
			if(data.status == 1){
					
				numtaskmem=data.items.length;
			    for(var x = 0; x < data.items.length; x++){
						 
					 taskmemid[x]= data.items[x].id;
					 taskmempic[x]= data.items[x].profile_pic;
						
					
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




function getrequesttask(tid)
{
	var appendHTML="";
	 jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/task/member_requests/'+tid, 
			data: { sid: ses_id}, 
			success: function (data) { 
			
			if(data.status == 1){
					
				
			    for(var x = 0; x < data.items.length; x++){
						 
						var id=data.items[x].id;
						var project_id= data.items[x].project_id;
						var assigned_by= data.items[x].assigned_by;
						var display_name= data.items[x].display_name;
						var email= data.items[x].email;
						var profile_pic= data.items[x].profile_pic;
						
						 appendHTML +='<tr class="checked-list">'; 
						 appendHTML +='<td><div class="portrait-status chat"><a  ><img data-toggle="modal" href="#newtask" src="data:image/gif;base64,'+profile_pic+'" height="45" width="45" class="img-circle"></a></div>';
						  
						appendHTML +='<td><a ><i data-toggle="modal" href="#userprof" onclick="userprofile('+id+');" ></i>'+display_name+'</a><p style="font-size:10px;"><i class="flaticon-email" > '+email+'</i></p></td></td><td><div class="checkbox" name="chk_members" >'+
										
									'<span class="actions">'+
													'<div class="options btn-group">'+
														'<button class="btn btn-success btn-xs tooltips" data-title="Accept" data-original-title="" title=""><span class="flaticon-check"></span></button>'+
														'<button  class="btn btn-default btn-xs tooltips" data-title="Decline" data-original-title="" title="">X</button>'+
													'</div>'+
													'</span>'+	
									'</div></td></tr>';
					}			
				}
			
			
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});   
document.getElementById("task-request-list").innerHTML=appendHTML;

	
}
function cancel_taskrequest()
{
	
}


function gettaskmembers(tid)
{
	var appendHTML="";
	 jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/task/members/'+tid, 
			data: { sid: ses_id}, 
			success: function (data) { 
			
			if(data.status == 1){
					
				
			    for(var x = 0; x < data.items.length; x++){
						 
						var id=data.items[x].id;
						var uid=data.items[x].user_id;
						var project_id= data.items[x].project_id;
						var assigned_by= data.items[x].assigned_by;
						var display_name= data.items[x].display_name;
						var email= data.items[x].email;
						var profile_pic= data.items[x].profile_pic;
						
						appendHTML +='<tr class="checked-list" id="task-assigned-'+id+'">'; 
						appendHTML +='<td><div class="portrait-status chat"><a  ><img data-toggle="modal" href="#userprof" onclick="userprofile('+uid+');" src="'+getprofpic(uid)+'" height="45" width="45" class="img-circle"></a></div>';
						  
						appendHTML +='<td><a  ><i data-toggle="modal" href="#userprof" onclick="userprofile('+uid+');" ></i>'+display_name+'</a><p style="font-size:10px;"><i class="flaticon-email" > '+email+'</i></p></td></td><td><div class="checkbox" name="chk_members" ><button type="button" class="close" onclick="delete_assignedtask('+id+','+tid+','+uid+')">×</button></div></td></tr>';
						
						
					
					}			
				}
			
			
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});   
document.getElementById("task-assigned-list").innerHTML=appendHTML;

	
}

function delete_assignedtask(id,tid,uid)
{
	del_assid=id;
	del_tid=tid;
	del_uid=uid;
	navigator.notification.confirm(
        'Are you sure you want to remove this user from task?', 
        delete_taskmember, // <-- no brackets
        'Confirmation Message',
        ['Ok','Cancel']
    );
	
}

function delete_taskmember(buttonIndex)
{
	if (buttonIndex==1)
		{
			jQuery.ajax({ 
			type: 'post', 
			async : true,  
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/task/remove_member/'+del_tid+'/'+del_uid, 
			data: { sid: ses_id
					}, 
			beforeSend: function () {
			 preloading2();
			},						
			success: function (data) { 
				
				if (data.status==1)
				{
					var parent = document.getElementById("task-assigned-list");
					var child = document.getElementById('task-assigned-'+del_assid);
					parent.removeChild(child);
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
var members=document.getElementById("txtmember").value;	
	jQuery.ajax({ 
			type: 'post', 
			async : true,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/create', 
			data: { sid: ses_id,
					name:pname,
					description:pdesc,
					members:members}, 
			beforeSend: function () {
			 preloading2();
			},
			success: function (data) { 
			
				if(data.status == 1){
					clearprj_text();
					getproject();
					navigator.notification.alert('New Project Created',alertDismissed,'TeamStorm App','Ok');
                    getmytask();
				}
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
}); 	
	
}
function new_task(id)
{	
	isnewtask=1;
	cur_pid=id;
	cleartsk_text();
	preloading2();
	dependanttask_select();
	get_proj_mem_for_task();
	document.getElementById("viewnewtaskhdr").innerHTML="Create Task";
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
						var profile_pic= data.items[x].profile_pic;
						
						 appendHTML +='<tr class="checked-list">'; 
						 //getmemprofpic(id);
						 appendHTML +='<td><div class="portrait-status chat"><a data-toggle="modal" href="#userprof" onclick="userprofile('+id+');" ><img data-toggle="modal" href="#newtask" src='+profile_pic+' height="45" width="45" class="img-circle"></a></div>';
						  
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
	
	
	if (isnewtask>0){	
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
	else{
		
		
		jQuery.ajax({ 
					type: 'post', 
					async : false,     
					global : false,
					cache: false,
					dataType : 'json',
					url: 'http://teamstormapps.net/mobile/task/edit/'+onedit_id, 
					data: { sid: ses_id,
							project_id: cur_pid,
							title: title,
							description:desc,
							/* startdate:startdate,
							duedate:duedate, */
							priority:priority,
							dependent:depentask
							}, 
					success: function (data) { 
					
						if(data.status == 1){
							
							
							cleartsk_text();
							
							getmytaskinfo(cur_pid,cur_tid);
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

function newproject()
{
	
	member_search();
	document.getElementById("txt_prj_name").value='';
	document.getElementById("txt_prj_desc").value='';
	document.getElementById("txtmember").value='';	
	document.getElementById('search-prj-member').innerHTML='';
}

function member_search()
{
	/* project member search */
	 $('.txt-search-member').keyup(function(){
		$(".mem-list .mem-list-content .mem-list-info-name ").each(function() {
			$(this).text().toLowerCase().search($('.txt-search-member').val().toLowerCase()) > -1 ?	$(this).parent().parent().fadeIn(200) :	$(this).parent().parent().fadeOut(200)
		});
	}); 
	
	/* member search addressbook */
/* 	$('#txt-search-directory').keyup(function(){
		$(".member-list .panel-comments li").each(function() {
			$(this).text().toLowerCase().search($('#txt-search-directory').val().toLowerCase()) > -1 ?	$(this).parent().parent().fadeIn(200) :	$(this).parent().parent().fadeOut(200)
		});
	}); */
	
	var site_url = 'http://teamstormapps.net/';

	/* autocomplete search for header */
	$("#txt_prj_emailadd").autocomplete({
		source: site_url + "search/member",
		selectFirst: true,
		autoFocus: true,
		search: function (e, u) {$('.btn-proj-add-member > span').removeClass('fa-search').addClass('fa-spinner fa-spin'); $('.btn-proj-add-member > span').click(function(){return false;});},
		response: function (e, u) {	$('.btn-proj-add-member > span').addClass('fa-plus').removeClass('fa-spinner fa-spin');!u.content.length ? $(".no-result").text('No match found.') : $(".no-result").text('')},
		select: function (e,u) { /* $("#txtmember").val(u.item.email); */	
								var email="'"+u.item.email+"'";
								var pm = document.getElementById('txtmember').value;
								var pm_arr = pm.split(',');
								
								if(u.item.email== window.localStorage.getItem('username'))
								{
									navigator.notification.alert('You cannot add yourself!.',alertDismissed,'TeamStorm App','Ok');
								}				
								else{
										if(jQuery.inArray(u.item.email, pm_arr ) > -1){
										navigator.notification.alert(u.item.email+' is already in the list.',alertDismissed,'TeamStorm App','Ok');
									}
									else{
									var htmldata;
									htmldata ='<tr class="checked-list">'; 
									htmldata +='<td><div class="portrait-status chat"><a data-toggle="modal" href="#userprof" onclick="userprofile('+u.item.id+');"  ><img data-toggle="modal" href="#newproject" src="'+site_url+'thumbs/profile?id='+ u.item.id +'&hash=' + u.item.image + '" height="45" width="45" class="img-circle"></a></div>';
									htmldata +='<td><a data-toggle="modal" href="#userprof" onclick="userprofile('+u.item.id+');"><i data-toggle="modal" href="#newproject" ></i>'+u.item.fullname+'</a><p style="font-size:10px;"><i class="flaticon-email" > '+u.item.email+'</i></p></td></td><td><div class="checkbox" name="chk_members" >'+
										'<span class="actions">'+
														'<div class="options btn-group">'+
															'<button  class="btn btn-default btn-xs tooltips" data-title="Decline" data-original-title="" onclick="delete_member('+email+')" title="">X</button>'+
														'</div>'+
														'</span>'+	
										'</div></td></tr>';
									
									
										var e = document.createElement('tr');
										e.id = 'tr_'+u.item.email;
										e.innerHTML = htmldata;
										document.getElementById('search-prj-member').insertBefore(e,document.getElementById('search-prj-member').childNodes[0]);
										
										$("#txt_prj_emailadd").val('');
										document.getElementById('txtmember').value = pm + ',' + u.item.email  ;
									}
								}	
								$('.btn-proj-add-member > span').removeClass('fa-search').removeClass('fa-spinner fa-spin').addClass('fa-plus');
								$('.btn-proj-add-member > span').click(function(){return true;});
								return false; 
								},
		}).focus(function() {
			$(this).autocomplete("search", this.value);
		}).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
			/* var inner_html = '<a href="javascript:void(0);"><div class="dv-search-list">';
			inner_html +='<div class="image"><img class="media-object img-circle" src="'+site_url+'thumbs/profile?id='+ item.id +'&hash=' + item.image + '" width="50" height="50"  alt="Image"/></div>';
			inner_html +='<div class="info"><span class="name">' + item.fullname + '</span><span class="email">' + item.email + '</span></div>';
			inner_html +='</div></a>'; */
			
			
			var inner_html ='<a href="javascript:void(0);"><img src="'+site_url+'thumbs/profile?id='+ item.id +'&hash=' + item.image + '" width="45" height="45" class="img-circle" />  <td>'+item.fullname +'</a><p style="font-size:10px;"><i class="flaticon-email" > '+item.email+'</i></p></td>'; 
						
			
			return $( "<li></li>" )
				.data( "item.autocomplete", item )
				.append(inner_html)
				.appendTo( ul );
				
	};
	$("#txt_prj_emailadd").keypress(function(e){
        if(e.which == 13){//Enter key pressed
            $('.btn-info.prj_btn_add').click();//Trigger search button click event
        }
    });
}
function delete_member(li_id){
	var txtmember = document.getElementById('txtmember').value;
	document.getElementById('txtmember').value = txtmember.replace(li_id+",","");
	//document.getElementById("li_"+li_id).remove();
			
	var holder = document.getElementById("search-prj-member");
	var old_data = document.getElementById("tr_"+li_id);
			
	holder.removeChild(old_data);
}

