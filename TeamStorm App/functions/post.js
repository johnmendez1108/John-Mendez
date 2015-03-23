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

loadprojects_select();
document.getElementById('select_projlists').innerHTML=window.localStorage.getItem('projlist');

//document.getElementById('select_projlists').options.add(new Option("0", "Project List"))
	 //var ptype = $('input[type="radio"][name="post_type"]:checked').val();
search_post_user();
});


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
	
	 jQuery.ajax({ 
			type: 'post', 
			async : false,     
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
			success: function (data) {
				if (data.status==1)
				{
					
				alert(data.message);
				loadnewsfeed();
				document.getElementById('option1').checked = true;
				document.getElementById('chk_txt_post').checked	= false;
				document.getElementById('txt_post').value="";
				pid.options[pid.selectedIndex].value=0;
				}
		
			},				
			error: function (err) {
        
		console.log(err.message);
    }}); 
	
	}
      	
}
function search_post_user()
{
	
var search = document.getElementById("search-contacts").autocomplete;
	
	
$("#search-contacts").autocomplete({
		source: 'http://teamstormapps.net/mobile/search',
		selectFirst: true,
		autoFocus: true,
		search: function (e, u) {$('.search-all-loading').addClass('show');},
		response: function (e, u) {$('.search-all-loading').removeClass('show');
			if (!u.content.length) {
				var noResult = { 
					subtitle:"No match found on `" + $("#search-all").val() + "`",
					title:"No result found",
					image: '../img/no-result-thumb-default.png'
				};
				u.content.push(noResult);
				}
			},
		select: function (e,u) { window.location.href = u.item.link; },
		open: function(e, u) {
			$('.ui-autocomplete').append('<li><a href="" class="search-hashtag"><div class="dv-search-list"><div class="image"><img src=".../img/hashtag-default.png" /></div><div class="info"><span class="name">Search for Hashtag?</span><span class="email">Search for hashtag `#' + $("#search-all").val() + '`</span></div></div></a></li><li><a href="" class="no-result">See All Result</a></li>'); //See all results
		},//
		}).focus(function() {
			$(this).autocomplete("search", this.value);
		}).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
			var inner_html = '<a href=""><div class="dv-search-list">';
			inner_html +='<div class="image"><img src="data:image/gif;base64,' + item.image + '" /></div>';
			inner_html +='<div class="info"><span class="name">' + item.title + '</span><span class="email">' + item.subtitle + '</span></div>';
			inner_html +='</div></a>';
			
			return $( "<li></li>" )
				.data( "item.autocomplete", item )
				.append(inner_html)
				.appendTo( ul );
		};
	
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