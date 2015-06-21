var ses_id = window.localStorage.getItem('session_id');
var curmemoid;


function load_memo()
{
   
    document.getElementById("txt_memopad").focus();
	
	preloading2();
	var appendHTML ='';
	
	jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/memopad', 
			data: { sid: ses_id}, 
			success: function (data) { 
			
				if(data.length > 0){
						
					for(var x = 0; x < data.length; x++){
					
						var id =data[x].id;
						var content =data[x].content;
						var date_created =data[x].date_created;
						var last_update =data[x].last_update;
						
						var parts =content.split('\n');
					
						appendHTML +='<div class="panel" id="memo-'+id+'">'+
                                '<button type="button" class="close"   ontouchstart="conf_delete_memo('+id+');">×</button>'+
                            '<div class="panel-heading">'+
                                '<h4 class="panel-title">'+
                                '<a data-toggle="collapse" data-parent="#accordion1" href="#note-'+id+'">'+parts[0]+'</a></h4>'+
                                
                            '</div>'+
                            '<div id="note-'+id+'" class="panel-collapse collapse">'+
                                '<div class="panel-body">'+content+'</div>'+
                            '</div>'+
                        '</div>';
						
						
					}
					
				}
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		
		console.log(err.message);
    }
      	
});
	

document.getElementById("memolist").innerHTML=appendHTML;	
	
}
function addnote()
{
	var appendHTML;
	appendHTML ='<div class="panel" id="memo-0">'+
                                '<button type="button" class="close" data-dismiss="alert" aria-hidden="true" ontouchstart="clearnote();">×</button>'+
                            '<div class="panel-heading">'+
                                '<h4 class="panel-title">'+
                                '<a data-toggle="collapse" data-parent="#accordion1" href="#note-0" id="tempmemo">Untitled</a></h4>'+
                            '</div>'+
                            '<div id="note-0" class="panel-collapse collapse">'+
                                '<div class="panel-body" id="tempnote">(No Content)</div>'+
                            '</div>'+
                        '</div>';
	
	var memolist =document.getElementById("memolist");
	var content = document.createElement('div');
	content.innerHTML  =appendHTML;
	memolist.insertBefore(content, memolist.childNodes[0]);
	document.getElementById("btn_addnote").disabled = true; 
}

function memoonwrite()
{
	var content = document.getElementById('txt_memopad').value;
	var parts =content.split('\n');
	
	if (content.length<1)
	{
	document.getElementById('tempmemo').innerHTML="Untitled";
	document.getElementById('tempnote').innerHTML="(No Content)";
	document.getElementById("btn_savememo").disabled = true; 
	}
	else{
	document.getElementById('tempmemo').innerHTML=parts[0];
	document.getElementById('tempnote').innerHTML=content;
	document.getElementById("btn_savememo").disabled = false; 
	}
	
}


function clearnote()
{
	
	document.getElementById('txt_memopad').value="";
		
	document.getElementById("btn_addnote").disabled = false; 
}
function do_memo()
{
	
	var content = document.getElementById('txt_memopad').value;


	jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/memopad/create', 
			data: { sid: ses_id,
					content: content
					}, 
			success: function (data) { 
			
				if(data.status == 1){
					
				document.getElementById('txt_memopad').value="";
				load_memo();
				document.getElementById("btn_addnote").disabled = false; 
				}
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
}); 	
	
	
}

function conf_delete_memo(id)
{	 //test_delete();

	curmemoid =id;
	navigator.notification.confirm(
        'Are you sure you want to delete this note?', 
        delete_memo, // <-- no brackets
        'Confirmation Message',
        ['Ok','Cancel']
    );
	
	
}


function delete_memo(buttonIndex)
{
	if (buttonIndex==1)
		{
		
			jQuery.ajax({ 
				type: 'post', 
				async : false,     
				global : false,
				cache: false,
				dataType : 'json',
				url: 'http://teamstormapps.net/mobile/memopad/delete/'+curmemoid, 
				data: { sid: ses_id
						}, 
				success: function (data) { 
				
					if(data.status == 1){
						
					load_memo();
					
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





