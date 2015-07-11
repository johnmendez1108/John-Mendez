$(document).ready(function() {
    document.getElementById('username').value = window.localStorage.getItem(
        'username');
    window.localStorage["auto_signin"] = 0;
    window.localStorage["session_id"] = "";
    window.localStorage["getmytask"] = "";
    window.localStorage["getprojects"] = "";
    window.localStorage["latestcontacts"] = "";
    window.localStorage["latestnewsfeed"] = "";
    window.localStorage["getprojectlist"] = "";
});

function forgotpass() {
    window.location.replace("forgot-password.html");
}

function signup() {
    window.location.replace("sign-up.html");
}

function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    if (checkConnection() > 2) {
        $.ajax({
            type: 'post',
            //async : false,     
            global: false,
            cache: false,
            dataType: 'json',
            url: 'http://teamstormapps.host/mobile/auth/login',
            data: {
                username: username,
                password: password
            },
            beforeSend: function() {
                preloading2();
            },
            success: function(data, textStatus, XMLHttpRequest) {
                if (data.status == 0) {
                    //navigator.notification.alert(data.status_message, function() {}); 
                    navigator.notification.alert(data.status_message,
                        alertDismissed, 'Login Error', 'Ok'
                    );
                    //alert(data.status_message); 
                    document.getElementById('password').value =
                        "";
                } else if (data.status == 1) {
                    //navigator.notification.alert("Your User ID is " +  data.user_id + "\n "+ "Session ID is " + data.session_id + "\n" + "Is Successful "+ data.success , function() {});
                    //alert("Your User ID is " +  data.user_id + "\n "+ "Session ID is " + data.session_id + "\n" + "Is Successful "+ data.success );
                    //window.location="http://www.google.com";
                    //$.mobile.changePage($('#modalview-login'));
                    //$.mobile.changePage("Index2.html");
                    //alert(data.session_id);
                    window.localStorage["session_id"] = data.session_id;
                    window.localStorage["name"] = data.name;
                    window.localStorage["islogin"] = 1;
                    window.localStorage["username"] = username;
                    window.localStorage["password"] = password;
                    window.location.replace(
                        "activity-stream.html");
                    //window.location = "activity-stream.html";
                    forcc_login();
                }
            },
            error: function(XMLHttpRequest, textStatus, err) {
                //navigator.notification.alert("Network Connection Error Kindly Check your Internet Connection", function() {}); 
                //alert(err.description);
                navigator.notification.alert(
                    'Network Connection Error Kindly Check your Internet Connection',
                    alertDismissed, 'TeamStorm App', 'Ok');
                console.log(err.description);
            }
        });
    } else {
        //alert('Network Connection Error Kindly Check your Internet Connection');
        navigator.notification.alert(
            'Network Connection Error Kindly Check your Internet Connection',
            alertDismissed, 'TeamStorm App', 'Ok');
    }
    //getmyprofile();
    delete login;
}

function forcc_login() {
    $.ajax({
        type: 'post',
        //async : false,     
        global: false,
        cache: false,
        dataType: 'json',
        url: 'http://teamstormapps.host/login',
        data: {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        },
        success: function(data, textStatus, XMLHttpRequest) {},
        error: function(XMLHttpRequest, textStatus, err) {
            console.log(err.description);
        }
    });
}

function alertDismissed() {}