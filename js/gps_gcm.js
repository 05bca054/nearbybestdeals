function onSuccess1(position) {
	
	alert("on gps success");
	//play with page navigation when notification arrived
	
	window.localStorage.setItem("notification", "no");
	
	window.localStorage.setItem("langtitude", position.coords.latitude);
	window.localStorage.setItem("longtitude", position.coords.longitude);
	//langtitude = position.coords.latitude;
	//longtitude = position.coords.longitude;
	/*alert('Latitude: '          + position.coords.latitude          + '\n' +
		  'Longitude: '         + position.coords.longitude         + '\n' +
		  'Altitude: '          + position.coords.altitude          + '\n' +
		  'Accuracy: '          + position.coords.accuracy          + '\n' +
		  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
		  'Heading: '           + position.coords.heading           + '\n' +
		  'Speed: '             + position.coords.speed             + '\n' +
		  'Device ID: '         + device.uuid			            + '\n' +
		  'Timestamp: '         + position.timestamp                + '\n');*/
		  
	
	pushNotification = window.plugins.pushNotification;
	
	$("#app-status-ul").append('<li class="ui-icon-search ui-btn-icon-right">Detecting Enviroment</li>');

	//alert(device.platform);
	
	if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" || device.platform == 'ANDROID'){
		//alert("Android machine");
		$("#app-status-ul").append('<li class="ui-icon-android ui-btn-icon-right">Registering ' + device.platform + '....</li>');
		$("#app-status-ul").listview("refresh");
		//navigator.geolocation.getCurrentPosition(onSuccess1, onError1);
		pushNotification.register(
		successHandler,//Fist call success handler then call ecb(onNotification)
		errorHandler,
		{
			"senderID":"759809028856",
			"ecb":"onNotification"
		});
	} else if ( device.platform == 'blackberry10'){
		pushNotification.register(
		successHandler,
		errorHandler,
		{
			invokeTargetId : "replace_with_invoke_target_id",
			appId: "replace_with_app_id",
			ppgUrl:"replace_with_ppg_url", //remove for BES pushes
			ecb: "pushNotificationHandler",
			simChangeCallback: replace_with_simChange_callback,
			pushTransportReadyCallback: replace_with_pushTransportReady_callback,
			launchApplicationOnPush: true
		});
	} else {
		pushNotification.register(
		tokenHandler,
		errorHandler,
		{
			"badge":"true",
			"sound":"true",
			"alert":"true",
			"ecb":"onNotificationAPN"
		});
	}
}
	
	  
function onError1(error) {
		alert('code: '    + error.code    + '\n' +
			  'message: ' + error.message + '\n');
}
