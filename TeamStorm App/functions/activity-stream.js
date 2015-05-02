var ses_id = window.localStorage.getItem('session_id');
var getnfeeduname ="";
var getnfeedprofpic="";
var cur_postid,cur_set_postid;
var cur_commentid;
var cur_posterid;

var numoffeed = window.localStorage.getItem('numoffeed');

function init() {
	
	
	
	load_myprofile();
	document.getElementById("main_prof_fullname").innerHTML = window.localStorage.getItem('name');
	document.getElementById("user_menu_profpic").src = "data:image/gif;base64,"+ window.localStorage.getItem('ts_myprofpic') ;
	document.getElementById("user_comment_profpic").src = "data:image/gif;base64,"+ window.localStorage.getItem('ts_myprofpic') ;
	window.localStorage["host"] = 'http://teamstormapps.net/';
	
	loadaddress();
	loadnewsfeed();		
	 

	
	getmytask();
	getproject();
	//getprojectlist();
	loadprojects_select();
	
	
	setCookie('PHPSESSID','eutg1jbdbi6uu6gnt506b57mv2',90);
	setCookie('cc_loggedin','1',90);
    
    var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function() {
	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
		var response = xmlhttp.responseText; //if you need to do something with the returned value
		}
	}

xmlhttp.open("GET","http://teamstormapps.net/",true);
xmlhttp.send();
    
}
/* $(function() {
setTimeout(function() {
    $('feednotif').fadeOut('fast');
	
}, 1000);	
}); */

/* $(document).mousedown(function(e) {
    
        $('#postsettings').dialog("close");
    
}); */


function setCookie(cname,cvalue,exdays) {
				var d = new Date();
				d.setTime(d.getTime() + (exdays*24*60*60*1000));
				var expires = "expires=" + d.toGMTString();
				document.cookie = cname+"="+cvalue+"; "+expires;
}
function loadaddress()
{
	getaddressbook();
	document.getElementById("addressall").innerHTML=window.localStorage.getItem('latestcontacts');
}

function hideMessagefeed() {
document.getElementById("feednotif").style.display="none"; 
}

function getnewsfeed()
{
	var appendHTML = '';
if (checkConnection() >2){
	 jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global :false,
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
						projname = ' posted in <a onclick="viewprojectpost('+project_id+');"  >' + title  + '</a>';
					}	
					if(to_user_id > 0 && to_user_id != localStorage.getItem("ts_myid")) { 
						getnfeeduserinfo(to_user_id);
						var to_user_name = getnfeeduname;
						projname = '<i class="flaticon-arrow-right"></i> <a data-toggle="modal" href="#userprof" onclick="userprofile('+to_user_id+');" >' + to_user_name + '</a>'; 						
					}
					if(task_id > 0){
						
						projname = ' posted on task <a data-toggle="modal" href="#taskinfo" onclick="getmytaskinfo('+project_id+','+task_id+');" >' + gettaskname(project_id,task_id) + '</a>'; 
					}
					
					appendHTML += '<div class="inner-wrapper" id ="newsfeed-'+postid+'">'+
										'<div class="main-user-post">'+
											'<div class="media">'+
												'<a class="pull-left" data-toggle="modal" href="#userprof"  onclick="userprofile('+poster_id+');"  >'+
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
					
																
					appendHTML +='<h4 class="media-heading"><a data-toggle="modal" href="#userprof"  onclick="userprofile('+poster_id+');" >'+poster_name+'</a>'+projname+' </h4>'+
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
								var imgpath =attachment_images[attimg].preview;	
								//var imgpath2 = site_url + 'thumbs/attach_thumb2?id=' + attachment_images[attimg].user_id + '&hash=' + attachment_images[attimg].filepath;
							
								var imgpath2 =attachment_images[attimg].download_url;
								var fname = attachment_images[attimg].filename;
								//var fid = attachment_images[attimg].id;
								/* encodeImage(attachment_images[attimg].download_url, function(encodedImage) { 
									imgpath2=encodedImage;
								}); */
								
								
								if(attimg < min_images_show){
										appendHTML += '<div class="media-body">';
										 appendHTML += '<a>'; 
										appendHTML += '<img class="img-responsive" src="data:image/gif;base64,'+imgpath+'" width:100% alt="'+fname+'"  >';
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
							var fsize = attachment_others[atto].size;
							var fid = attachment_others[atto].id;
							var download_url = attachment_others[atto].download_url;
							
							appendHTML += '<li><a href="'+download_url+'" >'+fname+'</a> - '+fsize+' </li>';
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
													'<button type="button" class="btn btn-default btn-block" onclick="viewpostcomment('+postid+','+poster_id+');" data-toggle="modal" href="#comments"><i class="flaticon-comment-more"></i> Comments ('+comment_count+')</button>'+
												'</li>'+
											'</ul>'+
										'</div>'+
									'</div>';

				}
				if (appendHTML.length >0){
					
				 window.localStorage["latestnewsfeed"]= appendHTML;
				 //window.localStorage["numoffeed"]= data.items-1;
			
				}			
				/* else
				{
					$("#feednotif").show();
					window.setTimeout("hideMessage()", 4000);
					alert(window.localStorage.getItem('latestnewsfeed'));
				} */			
			}
			
		
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		document.getElementById('feednotif').style.display = "block";
		window.setTimeout('hideMessagefeed()', 4000);
		//alert("");
		//alert(window.localStorage.getItem('latestnewsfeed'));
		//alert(err.message);
		console.log(err.message);
		//window.localStorage["numoffeed"]= 0;
		
    }
      	
});   

}
else{

document.getElementById('feednotif').style.display = "block";
window.setTimeout('hideMessagefeed()', 4000);
}
	
}

function gettaskname(pid,tid)
{
	var cur_taskname;
	jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/project/tasklist/'+pid, 
			data: { sid: ses_id}, 
			
			success: function (data) { 
			
				if(data.status == 1){
						
							
					 for(var x = 0; x < data.items.length; x++){	
						
						if (tid== data.items[x].id)
						{
							cur_taskname=data.items[x].task_title
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

return cur_taskname;
}



function viewpostcomment(id,pstrid)
{
	cur_postid =id;
	cur_posterid =pstrid;
	var appendHTML = '';
	document.getElementById("commentlist").innerHTML="";
	document.getElementById("commentlist").style.display="none";
	  jQuery.ajax({ 
			type: 'post', 
			async : false,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/comment/get/'+id, 
			data: { sid: ses_id }, 
			beforeSend: function () {
			 preloading2();
			},
			success: function (data) { 
				
				
				  
				 
				 for(var x = data.length-1; x >= 0; x--){
				
					//alert("Mine is " + i + "|" + item.user_id + "|" + item.fullname);
					var com_id= data[x].id;
					var commentor= data[x].commentor;
					var message= data[x].message;
					var date_commented= data[x].date_commented;
					var commentor_id= data[x].commentor_id;
					var deletehtml="";
					var edithtml="";
					 
					 if(pstrid == localStorage.getItem('ts_myid')){
						 
						 deletehtml='<button type="button" class="close" onclick="conf_delete_comment('+com_id+')">×</button>';
					 }	 
					 
					 
					 if (commentor==window.localStorage.getItem('name'))
					 {
						 edithtml = '<button type="button" class="close" style="font-size: 16px;" onclick="comment_edit('+com_id+')" >Edit</button>'
					 }	 
					
					
					
					
                     appendHTML +='<div class="media" id="comment-'+com_id+'">'+
                            '<a class="pull-left" a >'+
                                '<img class="media-object img-circle" src="'+showprofpic(commentor_id)+'" width="35" alt="Image">'+
                            '</a>'+
							'<div id="delete-button-'+com_id+'">'+deletehtml+'</div>'+	
                            '<div class="media-body">'+
                                '<h4 class="media-heading"><a  >'+commentor+'</a> <small>'+date_commented+'</small></h4>'+
                                '<p class="post" id="comment-content-'+com_id+'">'+message+'</p>'+
								'<div id="edit-comment-'+com_id+'"></div>'+
								'<div id="edit-cancel-button-'+com_id+'">'+edithtml+'</div>'+
                            '</div>'+
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

function showprofpic(tsid)
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
			
		
			pic = data.profile_pic;
			
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});   
return 	pic;
}



function comment_edit(id)
{
	document.getElementById('edit-comment-'+id+'').innerHTML='<div class="input-group"><input class="form-control" id="inpteditcomment-'+id+'"> <div class="input-group-btn"><button type="button" class="btn" tabindex="-1" onclick="do_editcomment('+id+');" style="background: transparent;color: #00BDFF;"><i class="flaticon-check"></i></button></div></div>';
	document.getElementById('inpteditcomment-'+id+'').value=document.getElementById('comment-content-'+id+'').innerHTML;
	document.getElementById('edit-cancel-button-'+id+'').innerHTML='<button type="button" class="close" style="font-size: 16px;" onclick="cancelcomment_edit('+id+')" >Cancel</button>'	
	document.getElementById('comment-content-'+id+'').style.display="none";
	document.getElementById('delete-button-'+id+'').innerHTML='';
}

function cancelcomment_edit(id)
{
	document.getElementById('edit-comment-'+id+'').innerHTML='';
	//document.getElementById('inpteditcomment').value=document.getElementById('comment-content-'+id+'').innerHTML;
	document.getElementById('edit-cancel-button-'+id+'').innerHTML='<button type="button" class="close" style="font-size: 16px;" onclick="comment_edit('+id+')" >Edit</button>'
	document.getElementById('comment-content-'+id+'').style.display="block";
	document.getElementById('delete-button-'+id+'').innerHTML='<button type="button" class="close" onclick="conf_delete_comment('+id+')">×</button>';
}

function do_editcomment(id)
{
	var commentmsg = document.getElementById('inpteditcomment-'+id+'').value
	
		  jQuery.ajax({ 
			type: 'post', 
			async : false,  
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/comment/update', 
			data: { sid: ses_id,
					id: id,
					comment: commentmsg
					}, 
			beforeSend: function () {
			 preloading2();
			},						
			success: function (data) { 
				
				if (data.id==id)
				{
					
					document.getElementById('edit-comment-'+id+'').innerHTML='';	
					document.getElementById('edit-cancel-button-'+id+'').innerHTML='<button type="button" class="close" style="font-size: 16px;" onclick="comment_edit('+id+')" >Edit</button>'
					document.getElementById('comment-content-'+id+'').innerHTML=commentmsg;
					document.getElementById('comment-content-'+id+'').style.display="block";
					document.getElementById('delete-button-'+id+'').innerHTML='<button type="button" class="close" onclick="comment_delete('+id+')">×</button>';
					
				}							 
			},
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});
		
}

function conf_delete_comment(id)
{	 //test_delete();
	cur_commentid=id;
	navigator.notification.confirm(
        'Do you want to remove this comment?', 
        delete_comment, // <-- no brackets
        'Confirmation Message',
        ['Ok','Cancel']
    );
	
	
}

function delete_comment(buttonIndex) {
        //alert('You selected button ' + buttonIndex);	
		if (buttonIndex==1)
		{
			
			jQuery.ajax({ 
			type: 'post', 
			async : true,  
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/comment/delete/'+cur_commentid, 
			data: { sid: ses_id
					}, 
			beforeSend: function () {
			 preloading2();
			},						
			success: function (data) { 
				
				if (data.status==1)
				{
					var parent = document.getElementById("commentlist");
					var child = document.getElementById('comment-'+cur_commentid);
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

function do_comment()
{
	var commentmsg = document.getElementById('inptcomment').value;
	var issuccess;
	  jQuery.ajax({ 
			type: 'post', 
			async : true,  
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/comment/new', 
			data: { sid: ses_id,
					post_id: cur_postid,
					comment: commentmsg
					}, 
			beforeSend: function () {
			 preloading2();
			},						
			success: function (data) { 
				
				if (data.status==1)
				{
				
				viewpostcomment(cur_postid,cur_posterid);
				document.getElementById('inptcomment').value="";
				loadnewsfeed(); // Replace if additional api comes
				
				
				
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
					
			jQuery.ajax({ 
			type: 'post', 
			async : false, 
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/post/delete/'+cur_set_postid, 
			data: { sid: ses_id},
			beforeSend: function () {
			 preloading2();
			},
			success: function (data) { 
				
				if (data.status==1)
				{
					//document.getElementById('newsfeed '+cur_set_postid).remove();
					//navigator.notification.alert('Post Successfully Removed', alertDismissed, 'Message', 'Ok');
					
					removepost();
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
function removepost() {
	var parent = document.getElementById("streamlist");
	var child = document.getElementById('newsfeed-'+cur_set_postid);
	parent.removeChild(child);
	
	
}

function postagree(id) {
	
	
	jQuery.ajax({ 
			type: 'post', 
			async : true,     
			global : false,
			cache: false,
			dataType : 'json',
			url: 'http://teamstormapps.net/mobile/post/agree/'+id, 
			data: { sid: ses_id
					},
			beforeSend: function () {
			 preloading2();
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

}

function calendar()
{
	window.location="calendar.html";
	
}

function appsettings()
{
	window.location="app-settings.html";
	
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

 
 if (checkConnection() >2){
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
			  window.localStorage["name"] = data.name;
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
 else{
		//navigator.notification.alert('Network Connection Error Kindly Check your Internet Connection',alertDismissed,'TeamStorm App','Ok');
	
	}
  
	
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
										 '<img src="data:image/gif;base64,'+preview_pic+'" height="35" height="35" class="img-circle" data-toggle="modal" href="#userprof" onclick="userprofile('+user_id+');"> </td>'+
                                        '</div>'+
                                        '<td><a data-toggle="modal" href="#userprof" onclick="userprofile('+user_id+');">'+fullname+'</a>'+
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
getaddressbookperletter();   					
}
function getaddressbookperletter(){




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
				
				
				  //appendHTML +=  '<table class="table table-responsive" > <tbody >';
				 
				 for(var x = 0; x < data.length; x++){
					 
					var fullname= data[x].fullname;
					var user_id= data[x].user_id;	
					var email= data[x].email;
					var profile_pic= data[x].profile_pic;
					var preview_pic= data[x].preview_pic;
							
							
							 appendHTML = '<tr id="'+user_id+'">'+
											'<td>'+
												'<div class="checkbox" style="left:20px;">'+
												   '<input type="checkbox" id="flat-checkbox-1" class="icheckbox_flat">'+
												'</div>'+
											'</td>'+
											'<td>'+
												'<div class="portrait-status chat" style="left:20px;">'+
												 '<img src="data:image/gif;base64,'+preview_pic+'" height="35" height="35" class="img-circle" data-toggle="modal" href="#userprof" onclick="userprofile('+user_id+');"> </td>'+
												'</div>'+
												'<td><a data-toggle="modal" href="#userprof" onclick="userprofile('+user_id+');">'+fullname+'</a>'+
												'</td>'+
											 '</td>'+
										  '</tr>';
										  
					
					var e = document.createElement('tr');
					e.innerHTML = appendHTML;
					document.getElementById("address_"+fullname.charAt(0).toUpperCase()).appendChild(e);
				 }
				 
				  //appendHTML +='</tbody ><table>';
			
			
	  },
	  error: function (err) {
        //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
		//alert(err.message);
		console.log(err.message);
    }
      	
});



	
}



function conf_signout()
{
	 navigator.notification.confirm(
        'Are you sure want to log out?', 
        signout, // <-- no brackets
        'TeamStormApps',
        ['Log Out','Cancel']
    );
}

function signout(buttonIndex)
{
	if (buttonIndex==1){
	
	 
	 		 jQuery.ajax({ 
				type: 'post', 
				//async : false,     
				global : false,
				cache: false,
				dataType : 'json',
				url: 'http://teamstormapps.net/mobile/auth/logout', 
		  data: { sid:ses_id }, 
		
		  success: function (data, textStatus,XMLHttpRequest) { 
			if(data.status ==0) {

				}
		   else  if(data.status ==1) {
			   window.location.replace("login.html");
		  }
		  },
		  error: function (XMLHttpRequest, textStatus,err) {
			 //navigator.notification.alert('Network Connection Error Kindly Check your Internet Connection',alertDismissed,'TeamStorm App','Ok');  
			  console.log(err.description);
		}
		  
		});
	}
}

function callchat(){
	 window.location.replace("chat.html");
}
 