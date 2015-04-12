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
function newpost()
{
loadprojects_select();
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
	var pid = document.getElementById('select_projlists');
	
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
	 
	 
	pid = pid.options[pid.selectedIndex].value;
	
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
		
   /*  var imageURI = src;
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
	alert(imageURI); */	
		
	/* var url = 'http://teamstormapps.net/upload';
	var params = { sid: ses_id,files: src};
		
		
	$.post(url, params, function(data) {

           alert(data.files[0].deleteUrl);

        });	 */	
		
		//var fd = new FormData(document.getElementById("pic_map"));
		jQuery.ajax({ 
			type: 'post', 
			enctype: 'multipart/form-data',
			processData: false,  // tell jQuery not to process the data
			contentType: fals,  // tell jQuery not to set contentType
			url: 'hhttp://teamstormapps.net/upload', 
			data: { sid: ses_id,files: src}, 
			beforeSend: function () {
			 preloading2();
			}}).done(function( data ) {
            console.log("PHP Output:");
            console.log( data );
        }); 
		
		
	
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



        } , true);