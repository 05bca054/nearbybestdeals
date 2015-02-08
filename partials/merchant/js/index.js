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
      
	initList: function () {
		alert("dsad");
		//alert("[init]"+document.URL.indexOf("http://"));
 
		if (document.URL.indexOf("http://") === -1) {
			app.testing_on_desktop = false;
		}
						
		jQuery(document).ready(function () {
			//alert("jQuery finished loading");
			
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
					//alert("PhoneGap finished loading asdasdasd");
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
				console.log("PhoneGap & jQuery.Mobile finished loading");
				$.mobile.loading("show");
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
				
				//coupon.openDatabase();
				//coupon.createTable();
				//coupon.getCoupons();
				/*if (navigator.notification) { // Override default HTML alert with native dialog
				  window.alert = function (message) {
					  navigator.notification.alert(
						  "jQuery.when both framework loads",    // message
						  null,       // callback
						  "Workshop", // title
						  'OK'        // buttonName
					  );
				  };
				}*/
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
			
			//alert("[initPages]");
			//alert("calling withour gps function"+device.uuid);
			//jQuery(document).bind("pagecreate", _initPages);
			var dev_uuid=window.localStorage.getItem("uuid");
			//alert("list dealer calling "+dev_uuid);
			alert("check loading")
			//alert();
			
			$.post( web_url+"merchant/list_merchant.php", { imei: dev_uuid } ).done(function( data ) {
				//alert( "Data Loaded: " + data );
				var testJSON = $.parseJSON(data);
				if (testJSON.length != 0) {
					$.each(testJSON, function(i, clstr) {								
						var user_id="";
						$("#list").append('<li id="dealer_li'+i+'"><a  id="merchant'+i+'" href="#demo-mail"></a></li>');
						//alert("Key : -- "+i+" Value : -- "+clstr);
						$.each(clstr, function(k, ndes) {
							if(k=="merchant")
								$("#merchant"+i).append('<h3>'+ndes+'</h3>');
							if(k=="desc")
								$("#merchant"+i).append('<p class="desc">'+ndes+'</p>');
							if(k=="id")
								user_id=ndes;
							//alert("Key : -- "+k+" Value : -- "+ndes);
						});
						$("#dealer_li"+i).append('<a href="#" class="delete" delete-id="'+user_id+'">Delete</a>');							
					});
					$( "#list" ).listview( "refresh" );
				}
			});
			$.mobile.loading("hide");
			//alert("end listing data " + $.mobile.support.touch);
			// Swipe to remove list item
			$( document ).on( "swipeleft swiperight", "#list li", function( event ) {
				
				var listitem = $( this ),
				// These are the classnames used for the CSS transition
				dir = event.type === "swipeleft" ? "left" : "right",
				// Check if the browser supports the transform (3D) CSS transition
				transition = $.support.cssTransform3d ? dir : false;		
				var merchant_id = $( this ).find(".delete").attr("delete-id");				
				//alert("swipeleft calling"+ dir +" : transitin :"+transition+"M id :-->"+merchant_id);
				$.mobile.loading("show");
				$.post( web_url+"merchant/remove_merchant.php", { imei: dev_uuid, merchant_id : merchant_id } ).done(function( data ) {
					if(data==0)
					{
						confirmAndDelete( listitem, transition );
					}
					else
					{
						alert("Problem in deleting dealer");
					}
				});
				$.mobile.loading("hide");
				//alert("after post");
				
			});
			
			$( "#list" ).on( "click", ".delete" , function() {
				//alert("ad");
				$.mobile.loading("show");
				var listitem = $( this ).parent( "li" );
				var merchant_id = $( this ).attr("delete-id");
				//alert(merchant_id);
				
				$.post( web_url+"merchant/remove_merchant.php", { imei: dev_uuid, merchant_id : merchant_id } ).done(function( data ) {
					//alert("not support touch "+data);
					if(data==0)
					{
						confirmAndDelete( listitem );
					}
					else
					{
						alert("Problem in deleting dealer");
					}
				});
				$.mobile.loading("hide");
			});
			
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
				
			function _initPages () {				
				alert("calling _initPages");
			};
			
		};
		
    },
 
	initAddDealer: function () {
		alert("dsad");
		//alert("[init]"+document.URL.indexOf("http://"));
 
		if (document.URL.indexOf("file://") === -1) {
			app.testing_on_desktop = false;
		}
						
		jQuery(document).ready(function () {
			//alert("jQuery finished loading");
			
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
					//alert("PhoneGap finished loading asdasdasd");
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
				console.log("PhoneGap & jQuery.Mobile finished loading");
				//alert("PhoneGap & jQuery.Mobile finished loading");
				//window.localStorage.setItem("uuid", device.uuid);
				
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
			
			//alert("[initPages]");
			//alert("calling withour gps function"+device.uuid);
			//jQuery(document).bind("pagecreate", _initPages);
			var dev_uuid=window.localStorage.getItem("uuid");
			//alert("list dealer calling "+dev_uuid);
			
			//alert();
			$("#varify_merchant").click(function(e) {
				//alert("Click on vafy merchant");
				
				 $.ajax({
					beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
					complete: function() { $.mobile.loading("hide"); }, //Hide spinner
					url: web_url+"merchant/add_merchant.php",
					data: { merchant_id: $("#merchant_name").val(), imei: dev_uuid },
					//headers: //headers
					success: function(data) {
						//...
						alert(data);
					}
				});
				//e.preventDefault();
				
				//$.mobile.loading("show");
				/*$.post( web_url+"merchant/add_merchant.php", { merchant_id: $("#merchant_name").val(), imei: dev_uuid } ).done(function( data ) {
					//alert( "Data Loaded: " + data );
					if(data!="0" && data!=2)
					{
						alert(data+" has been added successfully.");
						//$( "#merchant_detail" ).empty().append( data+" Added" ).show('slow');
					}
					else if(data=="0")
					{
						alert( "Dealer not found with this id please check entered dealer id!" )
					}
					else if(data=="2")
					{
						alert( "Dealer already added in your account please find dealer in list dealer tab");
					}
						
					//$( "#add_block" ).hide("drop", { direction: "up" }, "slow");
					//$( "#popupBasic" ).popup("open");
					//setTimeout(function() {
						//$('#popupBasic').popup("close");
					//}, 3000);
				});*/
				//$.mobile.loading("hide");
			});
			
			
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

// emulate PhoneGap for testing on Chrome
var PGproxy = {
    "navigator": {
        "connection": function () {
            if (navigator.connection) {
                return navigator.connection;
            } else {
                console.log('navigator.connection');
                return {
                    "type":"WIFI" // Avoids errors on Chrome
                };
            }
        },
        "notification": {
            "vibrate": function (a) {
                if (navigator.notification && navigator.notification.vibrate) {
                    navigator.notification.vibrate(a);
                } else {
                    console.log("navigator.notification.vibrate");
                }
            },
            "alert": function (a, b, c, d) {
                if (navigator.notification && navigator.notification.alert) {
                    navigator.notification.alert(a, b, c, d);
                } else {
                    console.log("navigator.notification.alert");
                    alert(a);
                }
            }
        },
        "splashscreen": {
            "hide": function () {				
                if (navigator.splashscreen) {
                    navigator.splashscreen.hide();
                    //console.log('show navigator.splashscreen.hide');
                } else {
                    console.log('navigator.splashscreen.hide');
                }
            }
        }
    }
};
