/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    
    app_loaded: false,
    testing_on_desktop: true,
      
	initCouponList: function () {
		//alert("dsad");
		//alert("[init]"+document.URL.indexOf("http://"));
 
		if (document.URL.indexOf("http://") === -1) {
			app.testing_on_desktop = false;
		}
						
		jQuery(document).ready(function () {
			alert("jQuery finished loading");
			
			var deviceReadyDeferred2 = jQuery.Deferred();
			var jqmReadyDeferred2    = jQuery.Deferred();
			//alert(app.testing_on_desktop);
			if (app.testing_on_desktop) {
				console.log("PhoneGap finished loading"+app.testing_on_desktop);
				_onDeviceReady();
				deviceReadyDeferred2.resolve();
			} else {
				//alert("in");
				document.addEventListener('deviceready', function () {
					alert("PhoneGap finished loading asdasdasd");
					//alert("in device ready");
					_onDeviceReady();
					deviceReadyDeferred2.resolve();
				}, false);
			}
	 
			jQuery(document).one("pageinit", function () {
				//alert("jQuery.Mobile finished loading");
				jqmReadyDeferred2.resolve();
			});
	 
			jQuery.when(deviceReadyDeferred2, jqmReadyDeferred2).then(function () {
				//alert("PhoneGap & jQuery.Mobile finished loading");
				
				window.localStorage.setItem("uuid", device.uuid);
				//navigator.geolocation.getCurrentPosition(onSuccess1, onError1);
				if (navigator.notification) { // Override default HTML alert with native dialog
					  window.alert = function (data) {
						  navigator.notification.alert(
							  data,    // message
							  null,       // callback
							  "Dealer", // title
							  'OK'        // buttonName
						  );
					  };
				}
								
				initPages();
				console.log("App finished loading");
				app.app_loaded = true;
			});			
		});
	 
		function _onDeviceReady () {
			//PGproxy.navigator.splashscreen.hide();			
			//alert("[onDeviceReady] calling phonegap api functions");
		};
		function initPages () {
				
			//alert("ininit pages");
			var dev_uuid=window.localStorage.getItem("uuid");
	
			$("#varify_merchant2").on('click', function(e) {
				//$(this).val("").textinput( "refresh" );				
			 	$.ajax({
					beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
					complete: function() { $.mobile.loading("hide"); }, //Hide spinner
					url: web_url+"merchant/add_merchant.php",
					//data: { merchant_id: $("#merchant_name2").val(), imei: device.uuid  },
					data: { merchant_id: $("#merchant_name2").val(), imei: device.uuid  },
					type: "POST",
					success: function(data) {	
						$('#merchant_name2').val('');
						if(data!="0" && data!="2" && data!="3")
						{
							alert(data+" has been added successfully.");
							app.initListDealer();
						}
						else if(data=="0")
						{
							alert( "Dealer not found or inactive with this id please check entered dealer id!" )
						}
						else if(data=="2")
						{
							alert( "Dealer already added in your account please find dealer in list dealer tab");
						}
						else if(data=="3")
						{
							alert( "Please enter dealer!");
						}
					}
				});
				e.preventDefault();
			});
			
			//alert("Coupon page created");
			
			coupon.openDatabase();
			coupon.deleteAllExpires();
			coupon.getCoupons();
			//coupon.createTable();
			// Swipe to remove list item
			$( document ).on( "swipeleft swiperight", "#list li", function( event ) {
				var listitem = $( this ),
					// These are the classnames used for the CSS transition
					dir = event.type === "swipeleft" ? "left" : "right",
					// Check if the browser supports the transform (3D) CSS transition
					transition = $.support.cssTransform3d ? dir : false;						
					/*$.post( web_url+"merchant/remove_merchant.php", { imei: "355004054535961" } ).done(function( data ) {
						
					});*/
					var coupon_id = $( this ).find(".delete").attr("delete-id");
					coupon.deleteExpires(coupon_id);
					confirmAndDelete( listitem, transition );
			});
			// If it's not a touch device...
			//if ( ! $.mobile.support.touch ) {
				// Remove the class that is used to hide the delete button on touch devices
				//$( "#list" ).removeClass( "touch" );
				// Click delete split-button to remove list item
				$( "#list" ).on( "click", ".delete" , function() {
					//alert("ad");
					var listitem = $( this ).parent( "li" );
					var coupon_id = $( this ).attr("delete-id");
					
					coupon.deleteExpires(coupon_id);
					//alert(merchant_id);
					/*$.post( web_url+"merchant/remove_merchant.php", { imei: "355004054535961",merchant_id : merchant_id } ).done(function( data ) {
						alert(data);
					});*/
					
					confirmAndDelete( listitem );
				});
			//}
			function confirmAndDelete( listitem, transition ) {
				//alert("confirm and delete"+ listitem + " : " + transition);
				// Highlight the list item that will be removed
				listitem.children( ".ui-btn" ).addClass( "ui-btn-active" );
				// Inject topic in confirmation popup after removing any previous injected topics
				$( "#confirm .topic" ).remove();
				listitem.find( ".topic" ).clone().insertAfter( "#question" );
				// Show the confirmation popup
				$( "#confirm" ).popup( "open" );
				// Proceed when the user confirms
				$( "#confirm #yes" ).on( "click", function() {
					// Remove with a transition							

					listitem.slideUp('slow', function(){
	                	listitem.remove();
					});
					$( "#list" ).listview( "refresh" );
					
				});
				// Remove active state and unbind when the cancel button is clicked
				$( "#confirm #cancel" ).on( "click", function() {
					listitem.children( ".ui-btn" ).removeClass( "ui-btn-active" );
					$( "#confirm #yes" ).off();
				});
			}		
		}			
			
		function _initPages () {				
			alert("calling _initPages");
		};			
	},    	
    
    utilities: {
    },
    
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
