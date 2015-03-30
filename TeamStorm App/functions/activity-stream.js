var ses_id = window.localStorage.getItem('session_id');
var getnfeeduname ="";
var getnfeedprofpic="";
var cur_postid,cur_set_postid;

function init() {
	
	
	
	getmyprofile();
	 document.getElementById("main_prof_fullname").innerHTML = window.localStorage.getItem('name');
	 document.getElementById("user_menu_profpic").src = "data:image/gif;base64,"+ window.localStorage.getItem('ts_myprofpic') ;
	  document.getElementById("user_comment_profpic").src = "data:image/gif;base64,"+ window.localStorage.getItem('ts_myprofpic') ;
	//$("#con_appsettings").show();
	window.localStorage["host"] = 'http://teamstormapps.net/';
	getaddressbook();
	loadaddress();
	loadnewsfeed();		
	 
	//document.getElementById("streamlist").innerHTML=window.localStorage.getItem('latestnewsfeed');
	
	//getprojectlist();
	getproject();
	
}
/* $(function() {
setTimeout(function() {
    $('feednotif').fadeOut('fast');
	
}, 1000);
}); */

$(document).mousedown(function(e) {
    
        $('#postsettings').dialog("close");
    
});


function loadaddress()
{
	var conlist =  '<table class="table table-responsive" > <tbody ><tr>'+
                                   '<td>'+
                                        '<div class="checkbox">'+
											'<div class="icheckbox_flat checked" style="position: relative;"><input type="checkbox" id="flat-checkbox-1" style="position: absolute; top: -20%; left: -20%; display: block; width: 140%; height: 140%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"><ins class="iCheck-helper" style="position: absolute; top: -20%; left: -20%; display: block; width: 140%; height: 140%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div>'+
                                    '</td>'+
                                   '<td>'+
                                        '<div class="portrait-status chat">'+
                                           
                                            '<img src="img/user/thumb-user-small.jpg" height="35" class="img-circle" ></td>'+
                                        '</div>'+
                                        '<td><a href="">ABCDE</a>'+
                                        '</td>'+
									 '</td>'+
								'</tr>'+
								 '<tr >'+
                                   '<td>'+
                                        '<div class="checkbox">'+
                                           '<input type="checkbox" id="flat-checkbox-1">'+
                                        '</div>'+
                                    '</td>'+
                                   '<td>'+
                                        '<div class="portrait-status chat">'+
                                          
                                            '<img src="img/user/thumb-user-small.jpg" height="35" class="img-circle"> </td>'+
                                        '</div>'+
                                        '<td><a href="">FGHIJK</a>'+
                                        '</td>'+
									 '</td>'+
								'</tr>'+
								 '<tr>'+
                                   '<td>'+
                                        '<div class="checkbox">'+
                                            '<input type="checkbox" id="flat-checkbox-1">'+
                                        '</div>'+
                                    '</td>'+
                                   '<td>'+
                                        '<div class="portrait-status chat">'+
                                           
                                            '<img src="img/user/thumb-user-small.jpg" height="35" class="img-circle"></td>'+
                                        '</div>'+
                                        '<td><a href="">LMNOP</a>'+
                                        '</td>'+
									 '</td>'+
								'</tr></tbody></table>';
	 //document.getElementById("all").innerHTML =conlist;
	 document.getElementById("addressall").innerHTML=window.localStorage.getItem('latestcontacts');
}

function hideMessage() {
document.getElementById("feednotif").style.display="none"; 
}

function getnewsfeed()
{
	var appendHTML = '';
	
	
	
	 jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/newsfeed', 
			data: { sid: ses_id, mypost: 0 }, 
			success: function (data) { 
			if(data.items > 0){
				 for(var x = 0; x < data.items; x++){
					var postid= data.feeds[x].id;
					var poster_id= data.feeds[x].poster_id;
					var poster_name = data.feeds[x].poster_name;
					var poster_picture = data.feeds[x].poster_picture;
					var date_posted = data.feeds[x].date_posted;
					var post_mood = data.feeds[x].post_mood;
					var post_mood_desc = data.feeds[x].post_mood_desc;
					var can_modify = data.feeds[x].can_modify;
					var project_id = data.feeds[x].project_id;
					var task_id = data.feeds[x].task_id;
					var to_user_id = data.feeds[x].to_user_id;
					var title = data.feeds[x].title;
					var content = data.feeds[x].content;
					var agree_count = data.feeds[x].agree_count;
					var disagree_count = data.feeds[x].agree_count;
					var comment_count = data.feeds[x].comment_count;
					var location = data.feeds[x].location;
					var is_agree = data.feeds[x].is_agree;
					var is_disagree = data.feeds[x].is_disagree;					
					//alert(data.feeds[x].content);
					var projname= '';
					var is_agree_atr;
					
					getposterpic(poster_id);
					if(project_id > 0){
						projname = ' posted in <a href="" onclick="viewprojectpost('+project_id+');"  >' + title  + '</a>';
					}	
					if(to_user_id > 0 && to_user_id != localStorage.getItem("ts_myid")) { 
						getnfeeduserinfo(to_user_id);
						var to_user_name = getnfeeduname;
						projname = '<i class="flaticon-arrow-right"></i> <a href=""   onclick="viewuserprof('+to_user_id+');" >' + to_user_name + '</a>'; 						
					}
					if(task_id > 0){
						
						projname = ' posted on task <a href="" >' + task_id + '</a>'; 
					}
					
					appendHTML += '<div class="inner-wrapper" id ="newsfeed '+postid+'">'+
										'<div class="main-user-post">'+
											'<div class="media">'+
												'<a class="pull-left" a  onclick="viewuserprof('+poster_id+');"  >'+
													'<img class="media-object img-circle" src="data:image/gif;base64,'+getnfeedprofpic+'" width="50" height="50" alt="Image">'+
												'</a>'+
												'<div class="media-body">';
												
					if(poster_id == localStorage.getItem('ts_myid')){
						
					appendHTML +=	'<div class="btn-group pull-right" ><span class="ico flaticon-arrow-bottom dropdown-toggle" data-toggle="modal" href="#postsettings" onclick="postsettings('+postid+')"></span></div>';								 
								
								
								
								/* '<ul class="dropdown-menu" role="menu">'+
								'<li><a href="javascript:void(0);" data-id="'+postid+'" data-type="edit class="lnk-edit-post">Edit</a></li>'+
								'<li><a href="javascript:void(0);"  data-id='+postid+'"  class="lnk-remove-post">Remove</a></li>'+
								'</ul></div>'; */
						
						
						/* appendHTML += '<li><a href="javascript:void(0);" data-id="'+data[x].id+'" data-type="edit" class="lnk-edit-post">Edit</a></li>';
						appendHTML += '<li><a href="javascript:void(0);" data-id="'+data[x].id+'" class="lnk-remove-post">Remove</a></li>'; */
					}		
					
																
					appendHTML +='<h4 class="media-heading"><a href=""  onclick="viewuserprof('+poster_id+');" >'+poster_name+'</a>'+projname+' </h4>'+
													'<small>'+date_posted+'</small>';
													
					switch(post_mood){
						case '1': appendHTML += ' <span class="ico flaticon-lamp"></span>'; break;
						case '2': appendHTML += ' <span class="ico flaticon-amplifier"></span>'; break;
						case '3': appendHTML += ' <span class="ico flaticon-important"></span>'; break;
						default: appendHTML += ' <span class="ico flaticon-normal"></span>';
					}
					
					
					if (location.length>0){				
					appendHTML+='<small>at '+location+'</small>';
					}
					appendHTML+='</div>'+

											'</div>'+
											'<p class="post emojis-wysiwyg">'+content+'</p>';
											
					
					var images = ["jpg","jpeg","gif","png","bmp"];
					var sql_attachment = data.feeds[x].attachments;
					var attachment_images = [];
					var attachment_others = [];
					
					for(var attcx = 0; attcx < sql_attachment.length; attcx++){
						if(sql_attachment[attcx].is_deleted == 0 ){
							var ftype = sql_attachment[attcx].type;
							
							if(ftype=='image'){
								attachment_images.push(sql_attachment[attcx]); 
								}
							else {
								attachment_others.push(sql_attachment[attcx]); 
								} 				
						}
						
					}
					
					if(attachment_images.length > 0){
						appendHTML += '<div id="links" class="feed-content-post-img"><section class="Collage effect-parent">';
						var min_images_show = 3;
						
							for(var attimg = 0; attimg < attachment_images.length; attimg++){
								//var imgpath = site_url + 'thumbs?id=' + attachment_images[attimg].user_id + '&hash=' + attachment_images[attimg].filepath;
								var imgpath =attachment_images[attimg].download_url;	
								//var imgpath2 = site_url + 'thumbs/attach_thumb2?id=' + attachment_images[attimg].user_id + '&hash=' + attachment_images[attimg].filepath;
							
								var imgpath2 =attachment_images[attimg].download_url;
								var fname = attachment_images[attimg].filename;
								//var fid = attachment_images[attimg].id;
								/* encodeImage(attachment_images[attimg].download_url, function(encodedImage) { 
									imgpath2=encodedImage;
								}); */
								
								
								if(attimg < min_images_show){
										appendHTML += '<div class="media-body">';
										 appendHTML += '<a href="">'; 
										appendHTML += '<img class="img-responsive" src="'+imgpath2+'" alt="'+fname+'" >';
										appendHTML += '</a>';
										appendHTML += '</div>';
									
								} 
								var min_imgrshow = min_images_show - 1;
								if(attimg == min_imgrshow){  appendHTML += '</section>'; }
								
								
							}
							appendHTML += '</div>';
					}
					
						if(attachment_others.length > 0){
						appendHTML += '<div class="feed-content-post-attachment"><i>Attachments</i><ul>';
						
						for(var atto = 0; atto < attachment_others.length; atto++){
							var fname = attachment_others[atto].filename;
							var fsize = attachment_others[atto].filesize;
							var fid = attachment_others[atto].id;
							
							appendHTML += '<li><a href="'+site_url+'download/attachment?id='+fid+'">'+fname+'</a> - '+formatsize(fsize)+'</li>';
						}
						appendHTML += '</ul></div>';
					}
					
					
					if (is_agree==1)
					{
					
						is_agree_atr ='btn-agree-active';
					}
					else
					{
						is_agree_atr ='';
					}
					
					
	
					appendHTML+='<ul class="half-2 clearfix">'+
												'<li>'+
													'<button id="btn_post_ag_'+postid+'" type="button" class="btn btn-default btn-block '+is_agree_atr+'" onclick="postagree('+postid+');"><i class="flaticon-check-circle"></i> Agree ('+agree_count+')</button>'+
												'</li>'+
												'<li>'+
													'<button type="button" class="btn btn-default btn-block" onclick="viewpostcomment('+postid+');" data-toggle="modal" href="#comments"><i class="flaticon-comment-more"></i> Comments ('+comment_count+')</button>'+
												'</li>'+
											'</ul>'+
										'</div>'+
									'</div>';

				}
				if (appendHTML.length >0){
					
				 window.localStorage["latestnewsfeed"]= appendHTML;
				 
				}			
				/* else
				{
					$("#feednotif").show();
					window.setTimeout("hideMessage()", 4000);
					alert(window.localStorage.getItem('latestnewsfeed'));
				} */			
			}
			
			else{
				
				
				document.getElementById("streamlist").innerHTML="";
				window.localStorage["latestnewsfeed"]= '<div class="inner-wrapper">'+
							'<div class="main-user-post">'+
								'<div class="media">'+
								 '</div>'+
								  '<p class="post">No More Post to show</p>'+
							'</div>'+
							'</div>';				
			}
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		document.getElementById('feednotif').style.display = "block";
		window.setTimeout("hideMessage()", 4000);
		//alert("");
		//alert(window.localStorage.getItem('latestnewsfeed'));
		//alert(err.message);
		console.log(err.message);
    }
      	
});   
	
	
}

function viewpostcomment(id)
{
	cur_postid =id;
	var appendHTML = '';

	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/comment/get/'+id, 
			data: { sid: ses_id }, 
			success: function (data) { 
				
				
				  
				 
				 for(var x = 0; x < data.length; x++){
					//alert("Mine is " + i + "|" + item.user_id + "|" + item.fullname);
					var com_id= data[x].id;
					var commentor= data[x].commentor;
					var message= data[x].message;
					var date_commented= data[x].date_commented;
					
					
					
                     appendHTML +='<div class="media">'+
                            '<a class="pull-left" a href="">'+
                                '<img class="media-object img-circle" src="img/user/thumb-user-small.jpg" width="35" alt="Image">'+
                            '</a>'+
                            '<div class="media-body">'+
                                '<h4 class="media-heading"><a href="user-profile.html">'+commentor+'</a> <small>'+date_commented+'</small></h4>'+
                                '<p class="post">'+message+'</p>'+
                            '</div>';
										
				 }
                
                
			if (data.length<=0){
				document.getElementById("commentlist").style.display="none";
			}
			else
			{
			document.getElementById("commentlist").style.display="block";
			document.getElementById("commentlist").innerHTML=appendHTML;	
			}
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
         document.getElementById("commentlist").style.display="none";
		console.log(err.message);
    }
      	
});   




}

function do_comment()
{
	var commentmsg = document.getElementById('inptcomment').value;

	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/comment/new', 
			data: { sid: ses_id,
					post_id: cur_postid,
					comment: commentmsg
					}, 
			success: function (data) { 
				
				if (data.status==1)
				{
					document.getElementById('inptcomment').value="";
					viewpostcomment(cur_postid);
					loadnewsfeed();
				}
				
				 
			},
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});   
}
function postsettings(id)
{
	
	cur_set_postid =id;

}

function conf_delete_post()
{	 //test_delete();
	navigator.notification.confirm(
        'Are you sure you want to remove this post?', 
        delete_post, // <-- no brackets
        'Confirmation Message',
        ['Ok','Cancel']
    );
	
	
}
function delete_post(buttonIndex) {
        //alert('You selected button ' + buttonIndex);
	
		if (buttonIndex==1)
		{
			alertDismissed();
			jQuery.ajax({ 
			type: 'post', 
			async : false, 
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/post/delete/'+cur_set_postid, 
			data: { sid: ses_id
					
					}, 
			success: function (data) { 
				
				if (data.status==0)
				{

					//document.getElementById('newsfeed '+cur_set_postid).remove();
					//navigator.notification.alert('Post Successfully Removed', alertDismissed, 'Message', 'Ok');
					loadnewsfeed();
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
function alertDismissed() {
   var parent = document.getElementById("streamlist");
	var child = document.getElementById('newsfeed '+cur_set_postid);
	parent.removeChild(child);
}

function postagree(id) {
	
	
	jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/post/agree/'+id, 
			data: { sid: ses_id
					}, 
			success: function (data) { 
				
				if (data.status==1)
				{
					var element = document.getElementById('btn_post_ag_'+id);
					if (data.is_agree==1)
					{
						
						element.classList.add("btn-agree-active");
						loadnewsfeed();
					}
					else
					{
						element.classList.remove("btn-agree-active");
						loadnewsfeed();
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



function call_emoticons(id)
{
	emojify.setConfig({
		emojify_tag_type : 'i',           // Only run emojify.js on this element
		only_crawl_id    : id, // Use to restrict where emojify.js applies
		img_dir          : 'images/emoji',  // Directory for emoji images
		ignore_emoticons : false,            // If true, only convert :emoji: and ignore :-)
		ignored_tags     : {                // Ignore the following tags
			'SCRIPT'  : 1,
			'TEXTAREA': 1,
			'A'       : 1,
			'PRE'     : 1,
			'CODE'    : 1
		}
	});
	 emojify.run();
}


function loadnewsfeed()
{
/* 		 var locpath =document.location.pathname;
	 locpath = 'file://'+locpath.substring(0, locpath.lastIndexOf("/"));
	 alert(locpath); */
	 
	getnewsfeed();
	document.getElementById("streamlist").innerHTML=window.localStorage.getItem('latestnewsfeed');
	getprojectlist();
}



$(document).ready(function() {

init();

	 
});



function myprofile(uid)
{
    var usrid=window.localStorage.getItem('ts_myid');
	window.location="my-profile.html";
    if(uid<=0)
    {
        usrid=window.localStorage.getItem('ts_myid');
        
    }
    else
    {
        usrid=uid;
    }
    
	
}

function userprofile()
{
	window.location="user-profile.html";
	
}

function memopad()
{
	window.location="memo-pad.html";
	
}


function todo()
{
	window.location="to-do.html";
	
}


function calendar()
{
	window.location="calendar.html";
	
}

function appsettings()
{
	window.location="app-settings.html";
	
}


function newpost()
{
	window.location="new-post.html";
	
}

function encodeImage(src, callback) {
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        img = new Image();
		img.setAttribute('crossOrigin', 'anonymous');
		img.onload = function(){
        canvas.width  = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        callback(canvas.toDataURL());
      }
      img.src = src;;
}

function getnfeeduserinfo(tsid){

	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/user', 
			data: { sid: ses_id, id: tsid}, 
			success: function (data) { 
			
			getnfeeduname = data.name;
			
			
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});   
	
}
function getposterpic(tsid){

	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/user', 
			data: { sid: ses_id, id: tsid}, 
			success: function (data) { 
			
		
			getnfeedprofpic = data.preview_pic;
			
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});   
	
}


 function getmyprofile(){

	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/user', 
			data: { sid: ses_id }, 
			success: function (data) { 
			
			 window.localStorage["ts_myid"] = data.id;
			 window.localStorage["ts_myusrlvl"] = data.userlevel;
			 window.localStorage["ts_myemail"] = data.email;
			 window.localStorage["ts_myfname"] = data.firstname;
			 window.localStorage["ts_mymname"] = data.middlename;
			 window.localStorage["ts_mylname"] = data.lastname;
			 window.localStorage["ts_mygender"] = data.gender;
			 window.localStorage["ts_myprofpic"] = data.preview_pic;
			 window.localStorage["ts_mycompany"] = data.company;
			 window.localStorage["ts_mylocation"] = data.location;
			 window.localStorage["ts_mycontact"] = data.contact;
			 window.localStorage["ts_mylast_school"] = data.last_school;
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});   
	
}


function getaddressbook(){

	var appendHTML = '';

	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/addressbook', 
			data: { sid: ses_id }, 
			success: function (data) { 
				
				
				   appendHTML +=  '<table class="table table-responsive" > <tbody >';
				 
				 for(var x = 0; x < data.length; x++){
					//alert("Mine is " + i + "|" + item.user_id + "|" + item.fullname);
					var user_id= data[x].user_id;
					var fullname= data[x].fullname;
					var email= data[x].email;
					var profile_pic= data[x].profile_pic;
					var preview_pic= data[x].preview_pic;
					
					
                     appendHTML += '<tr id="'+user_id+'">'+
                                    '<td>'+
                                        '<div class="checkbox" style="left:20px;">'+
                                           '<input type="checkbox" id="flat-checkbox-1" class="icheckbox_flat">'+
                                        '</div>'+
                                    '</td>'+
                                    '<td>'+
                                        '<div class="portrait-status chat" style="left:20px;">'+
										 '<img src="data:image/gif;base64,'+preview_pic+'" height="35" height="35" class="img-circle"> </td>'+
                                        '</div>'+
                                        '<td><a onclick="userprofile('+user_id+');">'+fullname+'</a>'+
                                        '</td>'+
									 '</td>'+
								  '</tr>';
										
				 }
				 
				  appendHTML +='</tbody ><table>';
				if (appendHTML.length >0){
				 window.localStorage["latestcontacts"]= appendHTML; 
				
				}
				
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});   
	
}


 