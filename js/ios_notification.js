function onNotificationAPN (event) {
	alert(event);
    if ( event.alert )
    {
		alert(event.alert+"in alert");
        navigator.notification.alert(event.alert);
    }

    if ( event.sound )
    {
		alert(event.sound+"in sound");
        var snd = new Media(event.sound);
        snd.play();
    }

    if ( event.badge )
    {
        alert(event.badge+"in badge");
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}

function tokenHandler (result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    alert('device token = ' + result);
    $("#app-status-ul").append('<li class="ui-icon-carat-r ui-btn-icon-right">Register Device Successfully</li>');
	$("#app-status-ul").listview("refresh");
	window.localStorage.setItem("gcm_id", result);
	// Your GCM push server needs to know the regID before it can push to this device
	
	//var langtitude=window.localStorage.getItem("langtitude");
	//var longtitude=window.localStorage.getItem("longtitude");
	var gcm_id=window.localStorage.getItem("gcm_id");
	
	var device_info = 'Device Model: ' + device.model + 'Device Cordova: ' + device.cordova  + 'Device Platform: ' + device.platform + 'Device UUID: ' + device.uuid + 'Device Version: '  + device.version;
	
	//alert(web_url+"users/mob_user_reg.php");
	$("#app-status-ul").append('<li class="ui-icon-location ui-btn-icon-right">Updating location information</li>');
	$("#app-status-ul").listview("refresh");
		
	//alert(window.localStorage.getItem("mob_user_id"));
	if(window.localStorage.getItem("mob_user_id") === null)
	{
		//$.post( web_url+"users/mob_user_reg.php", { gcm_id: gcm_id, uuid: device.uuid,lat: langtitude, lon: longtitude, device_info: device_info} ).done(function( data ) {
		$.post( web_url+"users/mob_user_reg.php", { gcm_id: gcm_id, uuid: device.uuid,lat: "23", lon: "73", device_info: device_info} ).done(function( data ) {
			//alert( "Data Loaded without set mob_user_id: " + data );
			
			window.localStorage.setItem("mob_user_id", data);
			//app.countMerchants();
			$("#app-status-ul").append('<li class="ui-icon-arrow-r ui-btn-icon-right">Update location info successfully</li>');
			$("#app-status-ul").listview("refresh");
			$.mobile.loading("hide");
			var changewindow=window.localStorage.getItem("notification");
			//navigator.splashscreen.hide();
			if(changewindow!="yes" && window.localStorage.getItem("registration")!="yes")
			{
				//alert("notification:-- "+changewindow+" : registration : "+window.localStorage.getItem("registration"));
				$(':mobile-pagecontainer').pagecontainer('change', '#registration', {
					reload: false
				});
			}

			else if(window.localStorage.getItem("registration")=="yes" && changewindow!="yes")
			{

				$(':mobile-pagecontainer').pagecontainer('change', '#coupon', {
					reload: false
				});
			}
		});
	}
	else
	{
		//$.post( web_url+"users/mob_user_reg.php", { gcm_id: gcm_id, id: window.localStorage.getItem("mob_user_id"),lat: langtitude, lon: longtitude, device_info: device_info} ).done(function( data ) {
		$.post( web_url+"users/mob_user_reg.php", { gcm_id: gcm_id, id: window.localStorage.getItem("mob_user_id"),lat: "23", lon: "73", device_info: device_info} ).done(function( data ) {
			//app.countMerchants();
			
			
			$("#app-status-ul").append('<li class="ui-icon-arrow-r ui-btn-icon-right">Update location info successfully</li>');
			$("#app-status-ul").listview("refresh");
			$.mobile.loading("hide");
			var changewindow=window.localStorage.getItem("notification");
			//alert( "Data Loaded in set mob_user_id: " + changewindow +" : "+ window.localStorage.getItem("registration"));
			//navigator.splashscreen.hide();
			if(changewindow!="yes" && window.localStorage.getItem("registration")!="yes")
			{
				//alert("notification:-- "+changewindow+" : registration : "+window.localStorage.getItem("registration"));
				$(':mobile-pagecontainer').pagecontainer('change', '#registration', {
					reload: false
				});
			}
				
			else if(window.localStorage.getItem("registration")=="yes" && changewindow!="yes")
			{
				//alert("notification:-- "+changewindow+" : registration : "+window.localStorage.getItem("registration"));
				$(':mobile-pagecontainer').pagecontainer('change', '#coupon', {
					reload: false
				});
			}
		});
	}
	navigator.splashscreen.hide();
}
