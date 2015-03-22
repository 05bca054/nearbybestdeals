var web_url = "https://nearbybestdeals.com/misc/web_service_new/web_services/";

/*for device testing testing
var imei_no = "355004054535961"; 
var gcm_id = "APA91bG1THRDAPMJNrHYXyXN00K9yum96DtRB3SVeaaafC2JT774dzVTAcCCdmvDNwPMA2fGZkfct94RCAQlR5U3HCjJ1KDYDaqvirylL2uSzWilYbwSIlG9DTe8VbyeWaqYqn7G8F0hBID3g_y-IJgANK_U3XsKtQ"; 
var langtitude = "23.0470597"; 
var longtitude = "72.5330996"; 
var device_info = "Android";

//for handset testing

//setting imei number
window.plugins.imeiplugin.getImei(callback);
*/
function notifCouponFBshare(coupon_code,coupon_desc,coupon_merchant,coupon_lat,coupon_lon) {
	//alert("in notifCouponFBshare");
	appAvailability.check('com.facebook.katana', // Package Name
		function() {// Success callback
			//alert("available");
			//console.log('Twitter is available');
			//event.preventDefault();
			$.mobile.loading('show');
			//var msg = "Use Coupon code :"+testJSON.nearby_single_coupon_code+" And get "+testJSON.nearby_single_coupon_desc+" at "+testJSON.nearby_single_coupon_merchant+" Locate merchant using this link: http://maps.google.com/maps?q=loc:"+testJSON.nearby_single_coupon_lat+","+testJSON.nearby_single_coupon_lon;
			var msg = "Use Coupon code :"+coupon_code+" And get "+coupon_desc+" at "+coupon_merchant+". Locate merchant using this link: http://maps.google.com/maps?q=loc:"+coupon_lat+","+coupon_lon;
			var img = "https://nearbybestdeals.com/wp-content/uploads/2015/02/logo_colored.png";
			var lnk = "http://maps.google.com/maps?q=loc:"+coupon_lat+","+coupon_lon;
			 
			window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint(msg, img, lnk, 'Please paste message from clipboard!', 
				function() {
					$.mobile.loading('hide');
				},
				function(errormsg){
					alert(errormsg);
					$.mobile.loading('hide');
				}
			);//share plugin ends
			event.preventDefault();
		},
		function() {           // Error callback			
			alert('Facebook is not available or installed');
		}
	);
}
	
function notifCouponTwittershare(coupon_code,coupon_desc,coupon_merchant,coupon_lat,coupon_lon) {
	appAvailability.check('com.twitter.android', // Package Name
		function() {// Success callback
			//console.log('Twitter is available');
			event.preventDefault();
			$.mobile.loading('show');
			//var msg = "Use Coupon code :"+testJSON.nearby_single_coupon_code+" And get "+testJSON.nearby_single_coupon_desc+" at "+testJSON.nearby_single_coupon_merchant+" Locate merchant using this link: http://maps.google.com/maps?q=loc:"+testJSON.nearby_single_coupon_lat+","+testJSON.nearby_single_coupon_lon;
			var msg = "Use Coupon code :"+coupon_code+" And get "+coupon_desc+" at "+coupon_merchant;
			var img = "https://nearbybestdeals.com/wp-content/uploads/2015/02/logo_colored.png";
			var lnk = "http://maps.google.com/maps?q=loc:"+coupon_lat+","+coupon_lon;
			setTimeout(function(){	
				 window.plugins.socialsharing.shareViaTwitter(msg, null, lnk);
				 $.mobile.loading('hide'); 
			}, 5000);
		},
		function() {           // Error callback
			alert('Twitter is not available or installed');
		}
	);	
}

function notifCouponWhatsappshare(coupon_code,coupon_desc,coupon_merchant,coupon_lat,coupon_lon) {
	appAvailability.check('com.whatsapp', // Package Name
		function() {// Success callback
			//console.log('Twitter is available');
			event.preventDefault();
			$.mobile.loading('show');
			//var msg = "Use Coupon code :"+testJSON.nearby_single_coupon_code+" And get "+testJSON.nearby_single_coupon_desc+" at "+testJSON.nearby_single_coupon_merchant+" Locate merchant using this link: http://maps.google.com/maps?q=loc:"+testJSON.nearby_single_coupon_lat+","+testJSON.nearby_single_coupon_lon;
			var msg = "Use Coupon code :"+coupon_code+" And get "+coupon_desc+" at "+coupon_merchant;
			var img = "https://nearbybestdeals.com/wp-content/uploads/2015/02/logo_colored.png";
			var lnk = "http://maps.google.com/maps?q=loc:"+coupon_lat+","+coupon_lon;
			
			window.plugins.socialsharing.shareViaTwitter(msg, img, lnk);
			$.mobile.loading('hide'); 
			
		},
		function() {           // Error callback
			alert('Whatsapp is not available or installed');
		}
	);	
}

