var ses_id = window.localStorage.getItem('session_id');
var cur_notifcount = 0;
var cur_notifcount2 = 0;
var first_notif_id;
var notifid, mess;
//NOTIFICATION AUTO REFRESH
setInterval(function() {
    notification_refresh()
}, 20000);

function notification_refresh() {
    var gennotf = 0;
    var prjnotif = 0;
    var tasknotif = 0;
    var appendHTML = '';
    //NEW NOTIFICATIONS
    $.ajax({
        type: 'post',
        async: true,
        global: false,
        cache: false,
        dataType: 'json',
        url: 'http://teamstormapps.net/mobile/notification',
        data: {
            sid: ses_id
        },
        success: function(data) {
           
            first_notif_id = data[0].id
            for (var x = 0; x < data.length; x++) {
                var row = data[x];
                var is_new = row.is_read == 0 ? true : false;
                var profile_pic = row.profile_pic;
                var des = row.description.replace(row.fullname,
                    "");
                appendHTML += '<li>';
                appendHTML +=
                    '<a  data-toggle="modal" href="#notification" ontouchstart="notif_click(' +
                    row.id + ');">';
                appendHTML += '<div class="dv-notif ' + (is_new ?
                        'un-read' : '') + '"  id="notif-info-' +
                    row.id + '">';
                appendHTML +=
                    '<img src="data:image/gif;base64,' +
                    profile_pic +
                    '" class="img-circle" width="60" height="60"  alt="Image" />';
                appendHTML += '<div class="dv-info">';
                appendHTML += '<span class="name">' + row.fullname +
                    '</span><span> ' + des + '</span>';
                appendHTML +=
                    '<span class="n-time"><span class="fa fa-clock-o"></span> ' +
                    row.date_notified + '</span>';
                appendHTML += '</div>';
                appendHTML += '</div>';
                appendHTML += '</a>';
                appendHTML += '</li>';
            }
            
        }
    }).done(function() {
      $("#notif_gen_holder").html(appendHTML);   
  });
    //NEW Project NOTIFICATIONS
    getprojectnotiflist();
    //NEW Tasks NOTIFICATIONS
    gettasknotiflist();
    //NOTIFICATIONS COUNT
    $.ajax({
        type: 'post',
        async: true,
        global: false,
        cache: false,
        dataType: 'json',
        url: 'http://teamstormapps.net/mobile/notification/notif_count',
        data: {
            sid: ses_id
        },
        success: function(data) {
            if (data.count > 0) {
                $("#notif_gen_count").html(data.count);
                gennotf = data.count;
                cur_notifcount = data.count;
                if (data.count > cur_notifcount2) {
                    navigator.notification.vibrate(2000);
                    cur_notifcount2 = data.count;
                    pushnotification();
                }
            }
        },
        error: function(err) {
            //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
            //alert(err.message);
            console.log(err.message);
        }
    });
    var allnotifcount = parseInt(gennotf) + parseInt(prjnotif) + parseInt(
        tasknotif);
    if (allnotifcount > 0) {
        $("#notif_all_count").html(allnotifcount);
    } else {
        $("#notif_all_count").html('');
    }
    
   delete notification_refresh;
}

function getprojectnotiflist() {
    var appendHTML = '';
    $.ajax({
        type: 'post',
        async: true,
        global: false,
        cache: false,
        dataType: 'json',
        url: 'http://teamstormapps.net/mobile/notification/projects',
        data: {
            sid: ses_id
        },
        success: function(data) {
            if (data.length > 0) {
                tasknotif = data.length;
                document.getElementById('notif_prj_count').innerHTML =
                    data.length;
               
                for (var x = 0; x < data.length; x++) {
                    var profile_pic = data[x].profile_picture;
                    var des = data[x].content.replace(data[x].actor_name,
                        "");
                    appendHTML += '<li id="notif_prj_' + data[x]
                        .project_id + '">';
                    appendHTML += '<div class="dv-notif new">';
                    appendHTML +=
                        '<img src="data:image/gif;base64,' +
                        profile_pic +
                        '" class="img-circle" width="60" height="60"  alt="Image" />';
                    appendHTML += '<div class="dv-info">';
                    /*appendHTML += '<span class="name"><a data-toggle="modal" href="#userprof" ontouchstart="userprofile('+data[x].actor_id+');">'+data[x].actor_name+'</a></span>';*/
                    appendHTML += '<span class="name">' + data[
                        x].actor_name + '</span>';
                    appendHTML += '<span class="msg">' + des +
                        '</span>';
                    appendHTML += '<span><a ></a></span>';
                    appendHTML += '<span class="n-time">' +
                        data[x].timestamp + '</span>';
                    appendHTML +=
                        '<div class="pull-right options btn-group">';
                    appendHTML +=
                        '<button class="btn btn-success btn-xs tooltips" data-placement="top" data-title="Accept" ontouchstart="n_project_accept(' +
                        data[x].project_id +
                        ')" style="width:50px;"><span class="flaticon-check"></span></button>';
                    appendHTML +=
                        '<button class="btn btn-default btn-xs tooltips" data-placement="top" data-title="Decline" ontouchstart="n_project_decline(' +
                        data[x].project_id +
                        ')" style="width:50px;">X</button>';
                    appendHTML += '</div>';
                    appendHTML += '</div>';
                    appendHTML += '</div>';
                    appendHTML += '</li>';
                }
               
               
            } else {
                document.getElementById('notif_prj_count').innerHTML =
                    '';
            }
        }
    }).done(function() {
     $("#notif_prj_holder").html(appendHTML); 
         $('.dropdown-menu .dv-notif').click(function(e) {
                    e.stopPropagation();
                });
  });
}

function gettasknotiflist() {
    $.ajax({
        type: 'post',
        async: true,
        global: false,
        cache: false,
        dataType: 'json',
        url: 'http://teamstormapps.net/mobile/notification/tasks',
        data: {
            sid: ses_id
        },
        success: function(data) {
            if (data.length > 0) {
                prjnotif = data.length;
                document.getElementById('notif_task_count').innerHTML =
                    data.length;
                var appendHTML = '';
                for (var x = 0; x < data.length; x++) {
                    var profile_pic = getprofpic(data[x].actor_id);
                    var des = data[x].content.replace(data[x].actor_name,
                        "");
                    appendHTML += '<li id="notif_task_' + data[
                        x].task_id + '">';
                    appendHTML += '<div class="dv-notif new">';
                    appendHTML +=
                        '<img src="data:image/gif;base64,' +
                        profile_pic +
                        '" class="img-circle" width="60" height="60"  alt="Image" />';
                    appendHTML += '<div class="dv-info">';
                    /*appendHTML += '<span class="name"><a data-toggle="modal" href="#userprof" ontouchstart="userprofile('+data[x].actor_id+');">'+data[x].actor_name+'</a></span>';*/
                    appendHTML += '<span class="name">' + data[
                        x].actor_name + '</span>';
                    appendHTML += '<span class="msg">' + des +
                        '</span>';
                    appendHTML += '<span><a ></a></span>';
                    appendHTML += '<span class="n-time">' +
                        data[x].timestamp + '</span>';
                    appendHTML +=
                        '<div class="pull-right options btn-group">';
                    appendHTML +=
                        '<button class="btn btn-success btn-xs tooltips" data-placement="top" data-title="Accept" ontouchstart="n_task_accept(' +
                        data[x].task_id +
                        ')" style="width:50px;"><span class="flaticon-check"></span></button>';
                    appendHTML +=
                        '<button class="btn btn-default btn-xs tooltips" data-placement="top" data-title="Decline" ontouchstart="n_task_decline(' +
                        data[x].task_id +
                        ')" style="width:50px;">X</button>';
                    appendHTML += '</div>';
                    appendHTML += '</div>';
                    appendHTML += '</div>';
                    appendHTML += '</li>';
                }
                
                
            } else {
                document.getElementById('notif_task_count').innerHTML ='';
            }
        }
    }).done(function() {
     $("#notif_task_holder").html(appendHTML);
     $('.dropdown-menu .dv-notif').click(function(e) {
                    e.stopPropagation();
                });   
  });
}

function notif_click(id) {
    $.ajax({
        type: 'post',
        async: false,
        global: false,
        cache: false,
        dataType: 'json',
        url: 'http://teamstormapps.net/mobile/notification/notif_click/' +
            id,
        data: {
            sid: ses_id
        },
        success: function(data) {
            jQuery("#notif-info-" + id).removeClass('un-read');
        },
        error: function(err) {
            //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
            //alert(err.message);
            console.log(err.message);
        }
    });
}

function notification_remove_count() {
        if (cur_notifcount > 0) {
            $("#notif_gen_count").html('');
            $.ajax({
                type: 'post',
                async: false,
                global: false,
                cache: false,
                dataType: 'json',
                url: 'http://teamstormapps.net/mobile/notification/notif_remove_count',
                data: {
                    sid: ses_id
                },
                success: function(data) {},
                error: function(err) {
                    //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
                    //alert(err.message);
                    console.log(err.message);
                }
            });
        }
    }
    //Accept Task

function n_task_accept(tid) {
        $.ajax({
            type: 'post',
            async: false,
            global: false,
            cache: false,
            dataType: 'json',
            url: 'http://teamstormapps.net/mobile/task/accept_member/' +
                tid,
            data: {
                sid: ses_id
            },
            success: function(data) {
                if (data.status == 1) {
                    gettasknotiflist();
                }
            },
            error: function(err) {
                //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
                //alert(err.message);
                console.log(err.message);
            }
        });
    }
    //Accept Project

function n_project_accept(pid) {
    $.ajax({
        type: 'post',
        async: false,
        global: false,
        cache: false,
        dataType: 'json',
        url: 'http://teamstormapps.net/mobile/project/accept_member/' +
            pid,
        data: {
            sid: ses_id
        },
        success: function(data) {
            if (data.status == 1) {
                getprojectnotiflist();
            }
        },
        error: function(err) {
            //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
            //alert(err.message);
            console.log(err.message);
        }
    });
}

function getprofpic(tsid) {
    var imagepath = "";
    $.ajax({
        type: 'post',
        async: false,
        global: false,
        cache: false,
        dataType: 'json',
        url: 'http://teamstormapps.net/mobile/user',
        data: {
            sid: ses_id,
            id: tsid
        },
        success: function(data) {
            imagepath = data.preview_pic;
        },
        error: function(err) {
            //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
            //alert(err.message);
            console.log(err.message);
        }
    });
    return imagepath;
}
document.addEventListener('deviceready', function() {
    window.plugin.notification.local.registerPermission(function(
        granted) {
        console.log('Permission has been granted: ' + granted);
    });
}, true);

function pushnotification() {
    $.ajax({
        type: 'post',
        async: false,
        global: false,
        cache: false,
        dataType: 'json',
        url: 'http://teamstormapps.net/mobile/notification',
        data: {
            sid: ses_id
        },
        success: function(data) {
            notifid = data[0].id;
            mess = data[0].description;
        }
    });
    var now = new Date().getTime(),
        _5_seconds_from_now = new Date(now + 5 * 1000);
    window.plugin.notification.local.add({
        id: notifid,
        title: 'TeamStorm App',
        message: mess,
        badge: 1,
        icon: 'file://favicon.png',
        autoCancel: true,
        sound: 'beep.caf',
        date: _5_seconds_from_now
    });
}