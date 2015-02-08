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
      
	initProfile: function () {
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
				alert("in");
				document.addEventListener('deviceready', function () {
					//alert("PhoneGap finished loading asdasdasd");
					//alert("in device ready");
					_onDeviceReady();
					deviceReadyDeferred2.resolve();
				}, false);
			}
	 
			jQuery(document).one("pageinit", function () {
				alert("jQuery.Mobile finished loading");				
				jqmReadyDeferred2.resolve();
			});
	 
			jQuery.when(deviceReadyDeferred2, jqmReadyDeferred2).then(function () {
				alert("test pages");
				$.mobile.loading("show");
				console.log("PhoneGap & jQuery.Mobile finished loading");
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
				$.mobile.loading("hide");
				alert("App finished loading");
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
			jQuery.mobile.loading("show");
			$.post( web_url+"users/get_profile.php", { imei_no: dev_uuid } ).done(function( data ) {
				//alert( "Data Loaded: " + data );
				var testJSON = $.parseJSON(data);
				//alert(testJSON);
				
				if (testJSON.length != 0) {
					$.each(testJSON, function(i, clstr) {								
						var user_id="";
						//$("#list").append('<li id="dealer_li'+i+'"><a  id="merchant'+i+'" href="#demo-mail"></a></li>');
						//alert("Key : -- "+i+" Value : -- "+clstr);
						if(i=="name")
							$("#f_name").val(clstr);
						else if(i=="email")
							$("#email").val(clstr);
						else if(i=="phone")
							$("#mob_no").val(clstr);
						/*else if(i=="distance")
						{
							//alert(clstr);
							var el = $('#distance');

							// Select the relevant option, de-select any others
							el.val(clstr).attr('selected', true).siblings('option').removeAttr('selected');

							// Initialize the selectmenu
							el.selectmenu();

							// jQM refresh
							el.selectmenu("refresh", true);
							//$( "#distance" ).selectmenu( "option", clstr, false );
							//el.selectmenu("refresh", true);
							//$("#distance select").val(clstr);
						}
						else if(i=="categories_choosen")
						{
							var cats = clstr;
							//var cats = ["1", "2"];
							
							$('#category_choosen').find(':checkbox[name^="categories"]').each(function () {
								alert($(this).val()+" : "+$.inArray($(this).val(), cats));
								$(this).prop("checked", ($.inArray($(this).val(), cats) != -1)).checkboxradio( "refresh" );
							});
						}*/
						//$("#dealer_li"+i).append('<a href="#" class="delete" delete-id="'+user_id+'">Delete</a>');							
					});
					//$( "#list" ).listview( "refresh" );
				}
				
			});
			$.mobile.loading("hide");
			jQuery.mobile.loading("hide");
						
			$('#form1').validate({
				rules: {
					f_name: {
						required: true
					},
					mob_no: {
						required: true,
						number: true
					},
					email: {
						required: true,
						email: true
					},
					merchant_name: {
						//required: true,
						number: true
					}        
				},
				messages: {
					f_name: {
						required: "Please enter your first name."
					},
					mob_no: {
						required: "Please enter your last name."
					},
					email: {
						required: "Please enter your email."
					},
					merchant_name: {
					  //  required: "Please enter your email."
					}
				},
				errorPlacement: function (error, element) {
					error.appendTo(element.parent().prev());
				},
				submitHandler: function (form) {
					
				$.mobile.loading("show");
					$.post( web_url+"users/update_profile.php", { uuid: device.uuid, name: $("#f_name").val(), phone: $("#mob_no").val(), email: $("#email").val(),} ).done(function( data ) {
						//alert( "Data Loaded: " + data );						
						$.mobile.loading("hide");
						$(':mobile-pagecontainer').pagecontainer('change', '#update', {
							reload: false
						});
					});				  
					return false;
				}
			});
				
			function _initPages () {				
				alert("calling _initPages");
			};
			
		};
		
    },
 
	initAddDealer: function () {
		//alert("dsad");
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
			
			//alert();
			$("#varify_merchant").click(function(e) {
				//alert("Click on vafy merchant");
				e.preventDefault();
				$.mobile.loading("show");
				$.post( web_url+"merchant/add_merchant.php", { merchant_id: $("#merchant_name").val(), imei: dev_uuid } ).done(function( data ) {
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
				});
				$.mobile.loading("hide");
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
