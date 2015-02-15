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
	
	$("#notification_coupon_distance").attr('onclick',"event.preventDefault();launchnavigator.navigateByLatLon("+e.payload.lat+", "+e.payload.lon+")");
		
	$("#notification_coupon_merchantid").attr("merchant-id",e.payload.merchant_id);
	$("#notification_coupon_exipry").attr("data-countdown",e.payload.expire_time);
	
	$('#notification_coupon_exipry').countdown(e.payload.expire_time, function(event) {
		$(this).html(event.strftime('%D days %H:%M:%S'));
	});
	
	$("#notification_coupon_code").text(e.payload.coupon_code);
	$("#notification_coupon_title").text(e.payload.coupon_title);
	$("#notification_coupon_desc").text(e.payload.coupon_desc);
	$("#notification_coupon_merchant").text(e.payload.merchant_name);
	$("#app-status-ul-notification").listview("refresh");

	if(e.payload.sharable!="on")
	{
		//alert(e.payload.sharable+"not Sharable");
		$("#notification_sharable").hide("fast");
	}
	else
	{
		//alert(e.payload.sharable+"Sharable");
		$("#notification_sharable").show("fast");
	}
	
	if ( device.platform == 'android' || device.platform == 'Android' || device.platform == 'ANDROID'){
		$(".notification-facebook-share").attr("onclick","event.preventDefault();$.mobile.loading('show');window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint('Use Coupon code :"+e.payload.coupon_code+" And get "+e.payload.coupon_desc+" at "+e.payload.merchant_name+" Locate merchant using this link: http://maps.google.com/maps?q=loc:"+e.payload.lat+","+e.payload.lon+"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', null, 'Please paste message from clipboard!', function() {$.mobile.loading('hide');}, function(errormsg){alert(errormsg);$.mobile.loading('hide');})");
	}
	else
	{
		$(".notification-facebook-share").attr("onclick","event.preventDefault();$.mobile.loading('show');window.plugins.socialsharing.shareViaFacebook('Use Coupon code :"+e.payload.coupon_code+" And get "+e.payload.coupon_desc+" at "+e.payload.merchant_name+"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', 'http://maps.google.com/maps?q=loc:"+e.payload.lat+","+e.payload.lon+"', function() {$.mobile.loading('hide');}, function(errormsg){alert(errormsg);$.mobile.loading('hide');})");
	}
	
	//$(".notification-twitter-share").attr("onclick","event.preventDefault();$.mobile.loading('show');window.plugins.socialsharing.shareViaTwitter('Use Coupon code :"+e.payload.coupon_code+" And get "+e.payload.coupon_desc+" at "+e.payload.merchant_name+"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', 'https://www.google.com/maps/@"+e.payload.lat+","+e.payload.lon+",18z');$.mobile.loading('hide');");
	$(".notification-twitter-share").attr("onclick","event.preventDefault();$.mobile.loading('show'); setTimeout(function(){		window.plugins.socialsharing.shareViaTwitter('Use Coupon code :"+e.payload.coupon_code+" And get "+e.payload.coupon_desc+" at "+e.payload.merchant_name+"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', 'http://maps.google.com/maps?q=loc:"+e.payload.lat+","+e.payload.lon+"'); $.mobile.loading('hide'); }, 5000);");
	
	$(".notification-whatsapp-share").attr("onclick","event.preventDefault();$.mobile.loading('show');window.plugins.socialsharing.shareViaWhatsApp('Use Coupon code :"+e.payload.coupon_code+" And get "+e.payload.coupon_desc+" at "+e.payload.merchant_name+"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', 'http://maps.google.com/maps?q=loc:"+e.payload.lat+","+e.payload.lon+"',function() {$.mobile.loading('hide');}, function(errormsg){alert(errormsg);$.mobile.loading('hide');})");
	//$(".whatsapp-share").attr("onclick","$.mobile.loading('show');window.plugins.socialsharing.canShareVia('whatsapp','Use Coupon code :"+testJSON.nearby_single_coupon_code+" And get "+testJSON.nearby_single_coupon_desc+" at "+testJSON.nearby_single_coupon_merchant+"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', 'http://maps.google.com/maps?q=loc:"+testJSON.nearby_single_coupon_lat+","+testJSON.nearby_single_coupon_lon+"',function(e) {$.mobile.loading('hide');alert(e);}, function(errormsg){alert(errormsg);$.mobile.loading('hide');})");
	
	//$(".mail-share").attr("onclick","window.plugins.socialsharing.shareViaEmail('"+e.payload.coupon_desc+" Locate dealer : https://www.google.com/maps/@"+e.payload.lat+","+e.payload.lon+"','"+e.payload.merchant_name+" : "+e.payload.coupon_code"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', null, function(msg) {alert('ok: ' + msg)}, function(msg) {alert('error: ' + msg)})");
	
	$(".notification-sms-share").attr("onclick","event.preventDefault();$.mobile.loading('show'); window.plugins.socialsharing.shareViaSMS('Use Coupon code :"+e.payload.coupon_code+" And get "+e.payload.coupon_desc+" at "+e.payload.merchant_name+" : Location : http://maps.google.com/maps?q=loc:"+e.payload.lat+","+e.payload.lon+"', null, function(msg) {$.mobile.loading('hide');  }, function(msg) {$.mobile.loading('hide');alert('error: ' + msg)})");
	
	//alert(e.payload.expire_time);
	
	/*
	var $this = $("#notification_coupon_exipry"), finalDate = e.payload.expire_time;
	$this.countdown(finalDate, function(event) {
		//alert(finalDate);
		$this.html(event.strftime('%D days %H:%M:%S'));
	});
		*/	
	//Only works for GCM
	//$("#app-status-ul-notification").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
	$("#app-status-ul-notification").listview("refresh");
	//Only works on Amazon Fire OS
	//add coupon in local database
	
	//coupon.deleteExpires();
	$status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
	e.preventDefault();
	e.stopPropagation();
	
	navigator.splashscreen.hide();
}
