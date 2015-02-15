function successHandler(result) {
	//alert('registered###' + result.uri+"test");
	if(device.plateform=="iOS" || device.plateform=="IOS")
	{
		alert('registered###' + result );
	}
	// send uri to your notification server
}
//push notificaation error handler
function errorHandler(error) {
	alert('error###' + error);
}

//Ecb handler
function onNotification(e) {
	//$("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');
	//$("#app-status-ul").listview("refresh");
	switch( e.event )
	{
	case 'registered':
		if ( e.regid.length > 0 )
		{
			$("#app-status-ul").append('<li class="ui-icon-carat-r ui-btn-icon-right">Register Device Successfully</li>');
			$("#app-status-ul").listview("refresh");
			window.localStorage.setItem("gcm_id", e.regid);
			// Your GCM push server needs to know the regID before it can push to this device
			// here is where you might want to send it the regID for later use.
			//navigator.geolocation.getCurrentPosition(onSuccess1, onError1, {timeout: 10000, enableHighAccuracy: true});
			
			//alert("regID = " + e.regid);
			//alert("   imei  -- >"+imei_no);
			//alert("   latitude  -- >"+langtitude);
			//alert("   longtitude  -- >"+longtitude);
			//alert("end testing")
			var langtitude=window.localStorage.getItem("langtitude");
			var longtitude=window.localStorage.getItem("longtitude");
			var gcm_id=window.localStorage.getItem("gcm_id");
			
			var device_info = 'Device Model: ' + device.model + 'Device Cordova: ' + device.cordova  + 'Device Platform: ' + device.platform + 'Device UUID: ' + device.uuid + 'Device Version: '  + device.version;
			
			//alert(device_info);
			//alert(langtitude);
			//alert(longtitude);
			//alert(gcm_id);
			//alert(web_url+"users/mob_user_reg.php");
			$("#app-status-ul").append('<li class="ui-icon-location ui-btn-icon-right">Updating location information</li>');
			$("#app-status-ul").listview("refresh");
			
			//if mobuser id has been set
			//localStorage.getItem("username") === null
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
	break;

	case 'message':
		$(':mobile-pagecontainer').pagecontainer('change', '#notification', {
			reload: false
		});
		
		coupon.openDatabase();
		coupon.createTable();
		coupon.addCoupon(e.payload.merchant_name, e.payload.coupon_title, e.payload.coupon_desc, e.payload.coupon_code, e.payload.expire_time, e.payload.merchant_id, e.payload.lat, e.payload.lon, e.payload.sharable);
		coupon.countCoupon();
		coupon.getCoupons();
		//alert("coupon added successfully");
		//coupon.deleteAllExpires();
		
		window.localStorage.setItem("notification", "yes");
		// if this flag is set, this notification happened while we were in the foreground.
		// you might want to play a sound to get the user's attention, throw up a dialog, etc.
		if ( e.foreground )
		{
			//$("#app-status-ul-notification").empty().append('<li>--INLINE NOTIFICATION--' + '</li>');
			//$("#app-status-ul-notification").listview("refresh");

			// on Android soundname is outside the payload.
			// On Amazon FireOS all custom attributes are contained within payload
			var soundfile = e.soundname || e.payload.sound;
			var path = window.location.pathname;
			
			// if the notification contains a soundname, play it.
			
			path = path.substr( path, path.length - 10 );
			//alert(path);
			var my_media = new Media("file://"+path+"beep.wav");
			//alert(my_media);
			my_media.play();
			//alert("inline notification ends");
			
		}
		else
		{  // otherwise we were launched because the user touched a notification in the notification tray.
			if ( e.coldstart )
			{
				//$("#app-status-ul-notification").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
				//$("#app-status-ul-notification").listview("refresh");
			}
			else
			{
				//$("#app-status-ul-notification").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
				//$("#app-status-ul-notification").listview("refresh");
			}
		}
		
		// attribute does not exist
		//$("#notification_coupon_distance").attr('onclick',"event.preventDefault();window.open('https://www.google.com/maps/?saddr="+window.localStorage.getItem("langtitude")+","+window.localStorage.getItem("longtitude")+"&daddr="+e.payload.lat+','+e.payload.lon+"', '_system')");
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
	break;

	case 'error':
		$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
		$("#app-status-ul").listview("refresh");
	break;

	default:
		$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
		$("#app-status-ul").listview("refresh");
	break;
	}
}
