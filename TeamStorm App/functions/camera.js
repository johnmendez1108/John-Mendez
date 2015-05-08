var ses_id = window.localStorage.getItem('session_id');
var pictureSource;   
var destinationType; 
var imgcount=1;

document.addEventListener("deviceready",onDeviceReady,false);
function startActivity(className) {
          cordova.exec(function() {console.log("Success");}, function(e) {console.log("Error: "+e);}, "Activity", "start", [className]);
      };


function onDeviceReady() 
{
	initialize();
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
	
}


function onPhotoURISuccess(imageURI) 
{
    console.log(imageURI);
    var largeImage = document.getElementById('post_image');
    largeImage.style.display = 'block';
    largeImage.src = imageURI;
}

//function onPhotoDataSuccess(imageURI) 
//{ 
 //   var imgProfile = document.getElementById('post_image');
 //   imgProfile.src =  "data:image/jpeg;base64," +imageURI;
   // if(sessionStorage.isprofileimage==1)
 ///  {
     //   getLocation();
   // }
   // movePic(imageURI);
//}

function encodeImage(src, callback) {
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        img = new Image();
    
      img.onload = function(){
        canvas.width  = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        callback(canvas.toDataURL());
      }
      img.src = src;;
}
function onPhotoDataSuccess(imageData) {
  var based64img = "";
   
  if (imgcount<=3) { 
  var img = document.getElementById('post_image'+imgcount);
  //img.style.display = 'block';
  	encodeImage(imageData, function(encodedImage) { 
		based64img= "data:image/gif;base64," + encodedImage;
	});
  
  img.setAttribute('src', imageData);
  img.setAttribute('height', '40%');
  img.setAttribute('width', '70%');
 // img.setAttribute('margin', '30px');
  img.setAttribute('border', '4');
     
    
  //smallImage.src = "data:image/gif;base64," + imageData;
	//img.src = imageData;
	
      document.getElementById('pstimg'+imgcount).style.display='block';
	//document.getElementById("upld_img").appendChild(img);
	//alert(document.getElementById("upld_img").innerhtml);

	
	 
    imgcount +=1;  
	// uploadfile(imageData);
     var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageData.substr(imageData.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
	options.httpMethod = "POST";
    options.chunkedMode = false;
	options.headers = {
          Connection: "close"
        };
    var params = new Object();
	//params.sid=ses_id;
    options.params = params;
    var ft = new FileTransfer();
    ft.upload(imageData, encodeURI("http://teamstormapps.net/upload"), upwin, upfail,
        options); 


	
   }
   else {
       navigator.notification.alert('Exceeded maximum attachment',alertDismissed,'New Post','Ok');
   }
   
}
function onFail(message) 
{
    
    navigator.notification.alert('Failed because: ' + message,alertDismissed,'New Post','Ok');
}

function clearimg_count()
{
    imgcount=1;
}

function movePic(file)
{ 
    window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError); 
} 

function resolveOnSuccess(entry)
{ 
    var d = new Date();
    var n = d.getTime();
    var newFileName = n + ".jpg";
    var myFolderApp = "MyAppFolder";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) 
    {      
        fileSys.root.getDirectory( myFolderApp,
                {create:true, exclusive: false},
                function(directory) 
                {
                    entry.moveTo(directory, newFileName,  successMove, resOnError);
                },
        resOnError);
    },
    resOnError);
}

function successMove(entry) 
{
    sessionStorage.setItem('imagepath', entry.fullPath);
}

function resOnError(error) 
{
     console.log(error.code);
}

function capturePhoto() {
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, {destinationType: Camera.DestinationType.FILE_URI, quality: 50, correctOrientation: true,
      targetWidth: 600,
      saveToPhotoAlbum: true });
}

function getPhoto(source) 
{
	

    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, 
    destinationType: Camera.DestinationType.FILE_URI,
    sourceType: source });
}

var maxPhotos = 10;
function getcameraroll() 
{
   window.plugins.cameraRoll.find(maxPhotos, cameraRollFindResult, onFail);
}

function cameraRollFindResult(photos) {
    var content = '';
    for (var i in photos) {
      content += '<br/><img src="data:image/png;base64,'+photos[i]+'" style="max-width:28%,max-height:25%"/>';
    }
    document.getElementById("upld_img").innerHTML = content;
}

function onFail(message) 
{
     console.log('Failed because: ' + message);
}