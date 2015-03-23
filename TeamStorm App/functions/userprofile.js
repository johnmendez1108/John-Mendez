$(document).ready(function() {
	 document.getElementById("userprof_name").innerHTML = window.localStorage.getItem('name');
	 document.getElementById("userprof_pic").src = "data:image/gif;base64,"+ window.localStorage.getItem('ts_myprofpic') ;

	
});





function back_stream() {
window.history.back();
 //location.reload();
}

