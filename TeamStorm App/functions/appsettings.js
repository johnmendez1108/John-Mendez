

$(document).ready(function() {
	
	//alert(window.localStorage.getItem('auto_signin'));
	//$("#auto_signin").attr("checked", false);
		
	if (window.localStorage.getItem('auto_signin')==1)
	{
		
		document.getElementById("auto_signin").checked = true;
	}
	if (window.localStorage.getItem('notif_settings')==1)
	{
		document.getElementById("notif_settings").checked = true;
	}
	if (window.localStorage.getItem('auto_addemp')==1)
	{
		document.getElementById("auto_addemp").checked =true;
	}
	if (window.localStorage.getItem('show_prof')==1)
	{
		document.getElementById("show_prof").checked = true;
	}
	
	//document.getElementById("auto_signin").checked = true;
	//$("#auto_signin").prop('checked', true).checkboxradio('refresh');
	
	 //$("#auto_signin").toggle(this.checked);
	
});


	
function togglecheckbox(element)
{
	if (element.checked)
	{
		window.localStorage[element.id] = 1;

	}
	else
	{
		window.localStorage[element.id] = 0;
		
	}

	
     
	
}


function back_stream() {
window.history.back();
 //location.reload();
}