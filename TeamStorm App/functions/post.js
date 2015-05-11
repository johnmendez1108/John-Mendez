var ses_id = window.localStorage.getItem('session_id');
function back_stream()
{
window.history.back();
 //location.reload();
}

function getmultiimage()
{
	/* window.imagePicker.getPictures(
                function(results) {
                    for (var i = 0; i < results.length; i++) {
                        alert('Image URI: ' + results[i]);

// read file type and size and file name like below(in comment)

/* window.resolveLocalFileSystemURI(results[i], function(fileEntry){
        fileEntry.file(function(fileObj) { 
            alert(fileEntry.name);
            alert(fileObj.size);
            alert(fileObj.type);
        }); 

    }, function (error) {
            alert('Error: ' + error);
        });
                    }
                }, function (error) {
					console.log('Error: ' + error);
                    alert('Error: ' + error);
                }
            ); */
			
			
			
			
			
}


$(document).ready(function() {




//document.getElementById('select_projlists').options.add(new Option("0", "Project List"))
	 //var ptype = $('input[type="radio"][name="post_type"]:checked').val();

});

function postonwrite()
{
	var content = document.getElementById('txt_post').value;

	if (content.length<1)
	{
	document.getElementById("bttndopost").disabled = true; 
	}
	else{
	document.getElementById("bttndopost").disabled = false; 
	}

}
function newpost()
{
clearposttext();
loadprojects_select();
document.getElementById("divselectproject").style.display="block"; 
document.getElementById("searchpostuser").style.display="table-row"; 
postmember_search();

}
function clearposttext()
{
document.getElementById('select_projlists').value='';
document.getElementById("tasknamepost").innerHTML='';
document.getElementById('txtposttoid').value ='';
}

function loadprojects_select(){	
	var appendHTML = '<option value="0">Project list</option>';
	
	
	 jQuery.ajax({ 
			type: 'post', 
		/* 	async : false,     
			global : false,
			cache: false, */
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/getlist', 
			data: { sid: ses_id}, 
			success: function (data) {

				for(var x = 0; x < data.length; x++){
				//$('#select_projlists').append($("<option></option>").attr("value", data[x].id).text(data[x].project_title));
				//appendHTML += '<option value="'+data[x].id+'">'+escapeHtml(data[x].project_title)+'</option>';
				/*var x = document.getElementById("select_projlists");
				var option = document.createElement("option"); */
				//option.value= data[x].id;
				/* option.text = data[x].project_title; */
				//alert( data[x].project_title);
				/* x.add(option); */
				appendHTML += '<option value="'+data[x].id+'">'+data[x].project_title+'</option>';
				//document.getElementById('select_projlists').innerHTML=appendHTML;
				//alert(appendHTML);
				//document.getElementById('select_projlists').options.add(new Option(data[x].id, data[x].project_title))
			}
			window.localStorage["projlist"]= appendHTML; 
			},				
			error: function (err) {
        
		console.log(err.message);
    }});
	
 document.getElementById('select_projlists').innerHTML=window.localStorage.getItem('projlist');     	
}

function do_post(){	
	var cur_loc =window.localStorage.getItem('cur_loc');
	var ptype = 0;
	var sendtoemail = document.getElementById('chk_txt_post').checked;
	var postmsg = document.getElementById('txt_post').value;
	var e = document.getElementById('select_projlists');
	
	var uid=0;
	var tid=0;
	var pid=0;
	
	 if (document.getElementById('option1').checked) {
		ptype = document.getElementById('option1').value;
	 }	
	 if (document.getElementById('option2').checked) {
		ptype = document.getElementById('option2').value;
	 }
	 if (document.getElementById('option3').checked) {
		ptype = document.getElementById('option3').value;
	 }
	 if (document.getElementById('option4').checked) {
		ptype = document.getElementById('option4').value;
	 }
	  

	tid= document.getElementById('txtposttotaskid').value;
	uid= document.getElementById('txtposttoid').value;
	
	
	if (tid>0)
	{
	pid = document.getElementById('txtposttotaskprjid').value;
	}
	else if (tid==0)
	{
	pid = e.options[e.selectedIndex].value;	
	}
	
	
	
	if(postmsg.trim().length > 0){
		
	if (checkConnection() >2){
		jQuery.ajax({ 
			type: 'post', 
			async : true,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/post/dopost', 
			data: { sid: ses_id,
			post_type :ptype,
			message : postmsg,
			sendtomail: sendtoemail,
			project_id:pid,
			to_uid :uid,
			task_id:tid,
			location: cur_loc
			}, 
			beforeSend: function () {
			 preloading2();
			},
			success: function (data) {
				if (data.status==1)
				{
					
				//alert(data.message);
				loadnewsfeed();
				document.getElementById('option1').checked = true;
				document.getElementById('chk_txt_post').checked	= false;
				document.getElementById('txt_post').value="";
				document.getElementById('select_projlists').value=0;
				document.getElementById('txtposttoid').value=0;
				document.getElementById('search-contacts').value="";
				document.getElementById('txtposttotaskprjid').value=0;
				document.getElementById('txtposttotaskid').value=0;
				document.getElementById('txtposttoid').value=0;
				document.getElementById('search-contacts').value="";
				clearimg_count();
				}
		
			},				
			error: function (err) {
        
		console.log(err.message);
		}}); 
	}
	else{
		navigator.notification.alert('Network Connection Error Kindly Check your Internet Connection',alertDismissed,'TeamStorm App','Ok');
	
	}
	}
	else{
		navigator.notification.alert('Please type message before posting',alertDismissed,'TeamStorm Post','Ok');
	}
      	
}
 function alertDismissed()
{
    
}


function uploadfile(src)
{
		
  /*   var imageURI = src;
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.chunkedMode = false;
    var params = new Object();
	params.sid=ses_id;
    options.params = params;
    var ft = new FileTransfer();
    ft.upload(imageURI, "http://teamstormapps.net/upload", upwin, upfail,
        options);
	alert(imageURI);	 */
		
	/* var url = 'http://teamstormapps.net/upload';
	var params = { sid: ses_id,files: src};
		
		
	$.post(url, params, function(data) {

           alert(data.files[0].deleteUrl);

        });	 */	
		
		//var fd = new FormData(document.getElementById("pic_map"));
	/* 	jQuery.ajax({ 
			type: 'post', 
			enctype: 'multipart/form-data',
			processData: false,  // tell jQuery not to process the data
			contentType: false ,  // tell jQuery not to set contentType
			url: 'http://teamstormapps.net/upload', 
			data: { sid: ses_id,files: src}, 
			beforeSend: function () {
			 preloading2();
			}}).done(function( data ) {
            console.log("PHP Output:");
            console.log( data );
        });  */
		
		
	jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/upload', 
			data: { sid: ses_id,files: src}, 
			success: function (data) {
				alert(data.files[0].url);
			
			},				
			error: function (err) {
        alert(err.message);
		console.log(err.message);
    }});	
		
	
}
function upwin(r) {
	alert("Sent = " + r.bytesSent);
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}

function  upfail(error)  {
    alert("An error has occurred: Code = " + error.code + error.source + error.target);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}

function postmember_search()
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
	$("#search-contacts").autocomplete({
		source: site_url + "search/member",
		selectFirst: true,
		autoFocus: true,
		search: function (e, u) {$('.btn-proj-add-member > span').removeClass('fa-search').addClass('fa-spinner fa-spin'); $('.btn-proj-add-member > span').click(function(){return false;});},
		response: function (e, u) {	$('.btn-proj-add-member > span').addClass('fa-plus').removeClass('fa-spinner fa-spin');!u.content.length ? $(".no-result").text('No match found.') : $(".no-result").text('')},
		select: function (e,u) {  $("#search-contacts").val(u.item.fullname); 	
								document.getElementById('txtposttoid').value = u.item.id; 
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
			
			
			var inner_html ='<a href="javascript:void(0);"><img src="'+site_url+'thumbs/profile?id='+ item.id +'&hash=' + item.image + '" width="45" height="45" class="img-circle" />  <td>'+item.fullname +'</a></td>'; 
						
			
			return $( "<li></li>" )
				.data( "item.autocomplete", item )
				.append(inner_html)
				.appendTo( ul );
				
	};
	$("#search-contacts").keypress(function(e){
        if(e.which == 13){//Enter key pressed
            $('.btn-info.prj_btn_add').click();//Trigger search button click event
        }
    });
}



/*
document.addEventListener("deviceready",function(){

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){ 
                var sdcard = fileSystem.root;

                sdcard.getDirectory('dcim/camera',{create:false}, function(dcim){
                    var directoryReader = dcim.createReader();
                    directoryReader.readEntries(function(entries){
                       for (var i=0; i<entries.length; i++) {
                           entries[i].file(function(f){
                                 var reader = new FileReader();
                                 reader.onloadend = function (evt) {
                                 var url= evt.target.result;//base64 data uri

                                 console.log(url)
                                 reader.abort();
                             };
                             reader.readAsDataURL(f);

                           },function(error){
                               console("Unable to retrieve file properties: " + error.code);

                           });

                       }

                    },function(e){
                        console.log(e.code);
                    });


                }, function(error){
                    console.log(error.code);
                });


            }, function(evt){ // error get file system
                 console.log(evt.target.error.code);
            });



        } , true);*/