var ses_id = window.localStorage.getItem('session_id');
var curdate= new Date();
var cur_todoid;

function load_todo()
{
	
	preloading2();
	var appendHTML ='';
	var appendHTMLA='';
	var appendHTMLC='';
	var appendHTMLO='';
	
	jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/todo', 
			data: { sid: ses_id}, 
			success: function (data) { 
			
				if(data.length > 0){
						
					for(var x = 0; x < data.length; x++){
						var parts,parts2,tododate;
						
						var id =data[x].id;
						var status =data[x].status;
						var priority =data[x].priority;
						var title= data[x].title;
						var description =data[x].description;
						var target_date=data[x].target_date;
						var create_date=data[x].create_date;
						
						parts =target_date.split('/');
						parts2 =create_date.split('/');
						
						tododate = new Date(parts[2],parts[0]-1,parts[1]); 
						months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
						var targetdate;
						
						if (target_date=='n/a'){ 
						targetdate=months[parts2[0]-1]+" "+parts2[1]+", "+parts2[2];
						}else { targetdate =months[parts[0]-1]+" "+parts[1]+", "+parts[2];}
						
						
						
						appendHTML ='<div class="panel" id="todo-'+id+'">'+
											'<button type="button" class="close"   onclick="conf_delete_todo('+id+')">×</button>'+
											'<div class="panel-heading">'+
												'<h4 class="panel-title">'+
											'<a >'+title+'</a>';
											
						
						switch(priority){
							
							case '1': appendHTML += '<label style=" color:white; background:#aeafb1">Low</label>'; break;
							case '2': appendHTML += '<label style=" color:white; background:#2bbce0">Normal</label>'; break;
							case '3': appendHTML += '<label style=" color:white; background:#e73c3c">High</label>'; break;
						
						}
						appendHTML+='<p>'+targetdate+'</p></h4></div></div>';	
						
						if (target_date!=='n/a')
						{
							
							if (tododate<curdate)
							{
								
								appendHTMLO +=appendHTML;
							}
							else if(status=='active'){
								
								appendHTMLA +=appendHTML;
							}
							else if(status=='completed')
							{
								appendHTMLC +=appendHTML;
							}		
							
						}
						else if  (target_date =='n/a'){
							
							appendHTMLA +=appendHTML;
							
						}	
						
						
					}
					
				}
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		
		console.log(err.message);
    }
      	
});

	
document.getElementById("activetodolist").innerHTML=appendHTMLA;	
document.getElementById("completedtodolist").innerHTML=appendHTMLC;	
document.getElementById("overduetodolist").innerHTML=appendHTMLO;	
	
}

function do_todo()
{
	
	
	
	var title = document.getElementById('txt_todotitle').value;
	var duedate = document.getElementById('txt_tododate').value;
	var priority = document.getElementById('select_todopriority').value;
	var desc = document.getElementById('txt_tododesc').value


	jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/todo/create', 
			data: { sid: ses_id,
					title: title,
					description: desc,
					priority:priority,
					duedate:duedate
					}, 
			success: function (data) { 
			
				if(data.status == 1){
				document.getElementById('txt_todotitle').value="";
				document.getElementById('txt_tododate').value="";
				document.getElementById('select_todopriority').value=1;
				document.getElementById('txt_tododesc').value="";
				}
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
}); 	
	
}

function conf_delete_todo(id)
{	 //test_delete();

	cur_todoid =id;
	navigator.notification.confirm(
        'Delete this note?', 
        delete_todo, // <-- no brackets
        'Confirmation Message',
        ['Ok','Cancel']
    );
	
	
}


function delete_todo(buttonIndex)
{
	
if (buttonIndex==1)
{
	jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/todo/delete/'+cur_todoid, 
			data: { sid: ses_id
					}, 
			success: function (data) { 
			
				if(data.status == 1){
					load_todo();
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




