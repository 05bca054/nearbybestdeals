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
 
    init: function () {
		//alert("[init]"+document.URL.indexOf("http://"));
 
		if (document.URL.indexOf("http://") === -1) {
			app.testing_on_desktop = false;
		}
						
		jQuery(document).ready(function () {
			console.log("jQuery finished loading");
			
			var deviceReadyDeferred = jQuery.Deferred();
			var jqmReadyDeferred    = jQuery.Deferred();
			//alert(app.testing_on_desktop);
			if (app.testing_on_desktop) {
				console.log("PhoneGap finished loading"+app.testing_on_desktop);
				_onDeviceReady();
				deviceReadyDeferred.resolve();
			} else {
				//alert("in");
				document.addEventListener('deviceready', function () {
					console.log("PhoneGap finished loading asdasdasd");
					//alert("in device ready");
					_onDeviceReady();
					deviceReadyDeferred.resolve();
				}, false);
			}
	 
			jQuery(document).one("pageinit", function () {
				console.log("jQuery.Mobile finished loading");				
				jqmReadyDeferred.resolve();
			});
	 
			jQuery.when(deviceReadyDeferred, jqmReadyDeferred).then(function () {
				console.log("PhoneGap & jQuery.Mobile finished loading");
				
				//alert("loading on phone test");
				//window.localStorage.setItem("registration", "no");
				
				//StatusBar.overlaysWebView(false);
				//StatusBar.styleDefault();
				
				StatusBar.show();
				StatusBar.overlaysWebView(false);
				StatusBar.styleLightContent();
				StatusBar.backgroundColorByHexString("#1f1e2e");
				
				document.addEventListener("backbutton", backKeyDown, true);
				function backKeyDown() {
					//navigator.app.exitApp(); // To exit the app!
					if($.mobile.activePage.is('#coupon')){
						
						navigator.notification.confirm(
							"Do you want to exit the app?",
							function (button) {
							  if (button==2) {
								navigator.app.exitApp();
							  }
							}
							,
							"EXIT",
							["Cancel","OK"]
						);
						e.preventDefault();
					}
					else {
						navigator.app.backHistory();
						//alert("back on coupon page");
						//e.preventDefault();
						//alert("back other page");						
					}					
				}
				
				$.mobile.loading("show");  
				
				
				FastClick.attach(document.body);
				//enable when next vertion realease
				//navigator.geolocation.getCurrentPosition(onSuccess1, onError1);
				
				pushNotification = window.plugins.pushNotification;
				window.localStorage.setItem("notification", "no");
				//alert("set local variable push notification to on and remove background mode plugin code");
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
					//alert("IOS testing :"+device.platform);
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
								
				var path = window.location.pathname;
				
				path = path.substr( path, path.length - 10 );
				//alert(path);
				var icon ="file://"+path+"img/icon.png";
				//alert(icon);
				window.localStorage.setItem("icon", icon);
				initPages();
				console.log("App finished loading");
				app.app_loaded = true;
				
			});			
		});
	 
		function _onDeviceReady () {
			//PGproxy.navigator.splashscreen.hide();			
			console.log("[onDeviceReady] calling phonegap api functions");
		};
		function initPages () {
			//alert("[initPages]");
			jQuery(document).bind("pageinit", _initPages);
			
			//Load all pages content in back end so load is minimized
			
			localStorage.openSuccessPopup = 0;
			localStorage.openUpdatePopup = 0;
			alert("This Apps Works well with Wi-Fi or 3G interrnet connection");
			app.loadContent();
			
			
			
			$(document).on("pagebeforeshow","#coupon",function(e){ // When entering pagetwo
				//alert("coupon is about to be shown");
				//app.couponShow();
				coupon.openDatabase();
				//coupon.openDatabase();
				coupon.createTable();
				//coupon.deleteAllExpires();
				coupon.countCoupon();
				coupon.getCoupons();
				
				if(coupon.countCoupon==0)
				{
					alert("No active coupon found!Please wait for coupon from your added dealers.");
					//$("#list").append('<li class="ui-li-has-alt" id="coupon_empty"><a id="coupon_link_empty" href="#"><h3>No active coupon found!Please wait for coupon from your added dealers.</h3></a></li>');
				}
				/*$('[data-countdown]').each(function() {
					//alert($(this).data('countdown'));
					var $this = $(this), finalDate = $(this).data('countdown');
					$this.countdown(finalDate, function(event) {						
						$this.html(event.strftime('%D days %H:%M:%S'));
					});
					alert("calling countdown "+finalDate);
				});*/
			});
			
			$(document).on("pageshow","#coupon",function(e){ // When entering pagetwo				
				if(localStorage.openSuccessPopup==1)
				{
					//alert("Profile has been created");
					$( "#help-coupon" ).popup( "open" );
					localStorage.openSuccessPopup=0;
				}
				else if(localStorage.openUpdatePopup==1)
				{
					alert("Profile Updated successfully");
					localStorage.openUpdatePopup=0;
				}
				app.countMerchants();				
				
			});
			
			$(document).on("pageshow","#single_coupon",function(e){ // When entering pagetwo				
				coupon.getCouponsDesc(localStorage.coupon_id);
			});
			
			$(document).on("pageshow","#single_merchant",function(e){ // When entering pagetwo
				//coupon.getCouponsDesc(localStorage.coupon_id);
				//alert("single merchant page"+localStorage.merchant_id);
				app.initSingleMerchant(localStorage.merchant_id);
			});
				//e.preventDefault();
			//});
			
			$(document).on("pageshow","#nearby_single_coupon",function(e){ // When entering pagetwo
				//coupon.getCouponsDesc(localStorage.coupon_id);
				//alert("single merchant page"+localStorage.nearby_coupon_id);
				app.initNearbySingleCoupon(localStorage.nearby_coupon_id);
			});
			
			/*$(document).on('click', '#nearby_single_coupon_merchantid', function(){
				localStorage.merchant_id = $(this).attr("merchant-id");
				$(':mobile-pagecontainer').pagecontainer('change', '#single_merchant', {
					reload: false
				});
			});
			
			$(document).on('click', '#single_coupon_merchantid', function(){
				localStorage.merchant_id = $(this).attr("merchant-id");
				$(':mobile-pagecontainer').pagecontainer('change', '#single_merchant', {
					reload: false
				});
			});*/
			
			$(document).on('click', '.merchant_info', function(){
				localStorage.merchant_id = $(this).attr("merchant-id");
				$(':mobile-pagecontainer').pagecontainer('change', '#single_merchant', {
					reload: false
				});
			});
			
			$(document).on('click', '#locate_merchant', function(){
				localStorage.merchant_id = $(this).attr("merchant-id");
				$(':mobile-pagecontainer').pagecontainer('change', '#single_merchant', {
					reload: false
				});
			});
			
			
			$(document).on("pageshow","#profile",function(e){ // When entering pagetwo
				//alert("Profile is about to be shown");
				app.setProfile();
				app.initProfile();
			});
			
			$(document).on("pageshow","#listdealer",function(e){ // When entering pagetwo
				//$( "#list2" ).listview( "refresh" );
				$( "#popupAddDealer" ).popup({
					afteropen: function( event, ui ) {	
						//alert("check multiple times");
						$('#merchant_auto2').focus();
					},
					afterclose: function( event, ui ) {
						$('#merchant_auto2').val('');						
					},
				});
				//open add dealer popup on clicking add dealer link in right panel
				if(localStorage.openAddDealerPopup==1)
				{
					//trigger popup event	
					//alert("test");
					localStorage.openAddDealerPopup=0;
					$( "#openAddDealer" ).trigger( "click" );
				}
				//app.initListDealer();
			});
			
			$(document).on("pageshow","#nearbydeals",function(e){ // When entering pagetwo
				var count = $('#nearbydealslist li').size();
				//alert(count);
				$('#total-deals').text("Total Deals: "+count);
				if(count==0)
					$( "#openNearByDeals" ).trigger( "click" );
				//app.initListDealer();
			});
			
			//Toggle categories loaded from preferences in profile
			/*$("#def_category").click(function() { 
				$("fieldset#cat_set").toggle("blind", { 'direction' : 'vertical' }, 500);
			});*/
			
			//nearbydeals page coupon serch code			
			$("#search").click(function(e) {
				e.preventDefault();
				var category_val="";
				/*if ($('input#def_category').is(':checked')) {
					alert("def checked");
					//get value of user selected category in
				}
				else
				{*/			 
				$(':checkbox:checked').each(function(i){					
				  category_val += $(this).val()+",";
				  //alert(category_val);
				});
				
				var categoryies = category_val.slice(0,-1);
					//alert(categoryies);
				//}
				//alert($("#distance").val());
				
				$.ajax({
					beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
					complete: function() { $.mobile.loading("hide"); }, //Hide spinner
					url: web_url+"test.php",					
					data: { dist: $("#distance").val(), lat: window.localStorage.getItem("langtitude"), lon: window.localStorage.getItem("longtitude"), cat: categoryies },
					type: "POST",
					success: function(data) {
						//alert(data);
						if(data==0)
						{
							$("#nearbydealslist").empty();
							$('#total-deals').text("Total Deals: "+data);
							alert("No active deals found within specified distance");
							//$("#nearbydealslist").append('<li class="ui-li-has-alt" id="nearby_coupon_empty"><a id="nearby_coupon_link_empty" href="#"><h3>No active deals found within given distance.</h3></a></li>');
						}
						else
						{
							app.nearByDeals(data);
						}
						$( "#popupNearbyDeals" ).popup( "close" );
					}
				});
				return false;
			});
			
			//Add dealer sidebar menu item when clicked change page to list dealer and alsso open up add dealer popup
			$(".addDealer").on('click', function(e) {
				//alert("page check");
				localStorage.openAddDealerPopup = 1;
				$(':mobile-pagecontainer').pagecontainer('change', '#listdealer', {
					reload: false
				});
			});
			
			//Add dealer sidebar menu item when clicked close right panel and also open up add dealer popup
			//Listdeaaler page element
			$(".addCurrnetDealer").on('click', function(e) {				
				localStorage.openAddDealerPopup=0;
				
				$( "#inside-listdealer" ).panel( "close" );
				$( "#openAddDealer" ).trigger( "click" );
			});
						
						
			$('#feedback_form').validate({
				rules: {
					feedback_name: {
						required: true
					},
					feedback_email: {
						required: true,
						email: true
					},
					/*feedback_contact: {
						required: true,
						number: true
					},*/
					feedback_message: {
						required: true,						
					}        
				},
				messages: {
					feedback_name: {
						required: "Please enter your first name."
					},
					feedback_email: {
						required: "Please enter your email."
					},
					feedback_contact: {
						required: "Please enter your last name."
					},					
					feedback_message: {
						required: "Please say few words about us!"
					}
				},
				errorPlacement: function (error, element) {
					//alert(error+element);
					error.insertAfter( element.parent() );
					//error.appendTo(element.parent().prev());
				},
				submitHandler: function (form) {					
					$.ajax({
						beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
						complete: function() { $.mobile.loading("hide"); }, //Hide spinner
						url: web_url+"feedback.php",
						data: { feedback_name: $("#feedback_name").val(), feedback_email: $("#feedback_email").val(), feedback_contact: $("#feedback_contact").val(), feedback_massage: $("#feedback_message").val() },
						type: "POST",
						success: function(data) {	
							alert(data);
							//$("#form1")[0].reset();
							$("#feedback_form")[0].reset();
						}
					});
					//e.preventDefault();
					return false;
				}
			});
			/*$("#send_feedback").on('click', function(e) {
				$.ajax({
					beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
					complete: function() { $.mobile.loading("hide"); }, //Hide spinner
					url: web_url+"feedback.php",
					data: { feedback_name: $("#feedback_name").val(), feedback_email: $("#feedback_email").val(), feedback_contact: $("#feedback_contact").val(), feedback_massage: $("#feedback_massage").val() },
					type: "POST",
					success: function(data) {	
						alert(data);
						//$("#form1")[0].reset();
						$("#feedback_form")[0].reset();
					}
				});
				e.preventDefault();
			});*/
			
			$("#add_continue").on('click', function(e) {
				$.ajax({
					beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
					complete: function() { $.mobile.loading("hide"); }, //Hide spinner
					url: web_url+"merchant/add_merchant.php",
					data: { merchant_id: $("#merchant_name2").val(), imei: window.localStorage.getItem("mob_user_id")  },
					type: "POST",
					success: function(data) {	
						$('#merchant_auto2').val('');
						if(data!="0" && data!="2" && data!="3")
						{
							alert(data+" has been added successfully.");
							$("#merchant_auto2").val('');
							$("#merchant_auto2").focus();
							app.countMerchants();
							//$( "#popupAddDealer" ).popup( "close" );
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
			
			$("#add_close").on('click', function(e) {
				//$(this).val("").textinput( "refresh" );				
			 	$.ajax({
					beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
					complete: function() { $.mobile.loading("hide"); }, //Hide spinner
					url: web_url+"merchant/add_merchant.php",
					data: { merchant_id: $("#merchant_name2").val(), imei: window.localStorage.getItem("mob_user_id")  },
					type: "POST",
					success: function(data) {	
						$('#merchant_auto2').val('');
						if(data!="0" && data!="2" && data!="3")
						{
							alert(data+" has been added successfully.");
							app.countMerchants();
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
						$( "#popupAddDealer" ).popup( "close" );
					}
				});
				e.preventDefault();
			});
			
			//Single coupon click function
			//coupon function starts
			var dev_uuid=window.localStorage.getItem("uuid");
			
			$(document).on('click', '.coupon_desc', function(){
			// store some data
				var coupon_id = $( this ).attr("show-id");
				//alert(coupon_id);
				if(typeof(Storage)!=="undefined") {
					localStorage.coupon_id=coupon_id;
					
					$(':mobile-pagecontainer').pagecontainer('change', '#single_coupon', {
						reload: false
					});
				}				
			});
			
			//Single merchant click function
			
			$(document).on('click', '.merchant_desc', function(){
			// store some data
				var merchant_id = $( this ).attr("delete-id");
				//alert(merchant_id);
				if(typeof(Storage)!=="undefined") {
					localStorage.merchant_id=merchant_id;
					//$.mobile.pageContainer.pagecontainer( "change", "#single_coupon", { foo: coupon_id } );
					$(':mobile-pagecontainer').pagecontainer('change', '#single_merchant', {
						reload: false
					});
					//localStorage.lastname="Gaic";
				}
				// Change page
				//$.mobile.changePage("#single_coupon");
			});
			
			$(document).on('click', '.nearby_single', function(){
			// store some data
				var nearby_coupon_id = $( this ).attr("coupon-id");
				//alert(nearby_coupon_id);
				if(typeof(Storage)!=="undefined") {
					localStorage.nearby_coupon_id=nearby_coupon_id;
					//$.mobile.pageContainer.pagecontainer( "change", "#single_coupon", { foo: coupon_id } );
					$(':mobile-pagecontainer').pagecontainer('change', '#nearby_single_coupon', {
						reload: false
					});
					//localStorage.lastname="Gaic";
				}
				// Change page
				//$.mobile.changePage("#single_coupon");
			});
			
			//coupon.createTable();
			// Swipe to remove list item
			$( document ).on( "swipeleft swiperight", "#list li", function( event ) {
				var listitem = $( this ),
				// These are the classnames used for the CSS transition
				dir = event.type === "swipeleft" ? "left" : "right",
				// Check if the browser supports the transform (3D) CSS transition
				transition = $.support.cssTransform3d ? dir : false;						
				
				var coupon_id = $( this ).find(".delete").attr("delete-id");
				
				confirmAndDelete( coupon_id ,listitem, transition );
			});
			
			$( "#list" ).on( "click", ".delete" , function() {
				//alert("ad");
				var listitem = $( this ).parent( "li" );
				var coupon_id = $( this ).attr("delete-id");
				//coupon.deleteExpires(coupon_id);			
				confirmAndDelete( coupon_id ,listitem );
			});
			//}
			function confirmAndDelete( coupon_id ,listitem, transition ) {
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
					coupon.deleteExpires(coupon_id);
					listitem.slideUp('slow', function(){
	                	listitem.remove();
					});
					$( "#list" ).listview( "refresh" );
					
					$( "#confirm" ).popup( "close" );
					
				});
				// Remove active state and unbind when the cancel button is clicked
				$( "#confirm #cancel" ).on( "click", function() {
					listitem.children( ".ui-btn" ).removeClass( "ui-btn-active" );
					$( "#confirm #yes" ).off();
					$( "#confirm" ).popup( "close" );
				});
			}
				
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
						required: true,
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
						required: "Please enter valid dealer."
					}
				},
				errorPlacement: function (error, element) {
					//error.appendTo(element.parent().prev());
					error.insertAfter( element.parent() );
				},
				submitHandler: function (form) {					
					alert("in submit");
					$.ajax({
						beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
						complete: function() { $.mobile.loading("hide"); }, //Hide spinner
						url: web_url+"users/first_time_update_profile.php",
						data: { uuid: device.uuid, name: $("#f_name").val(), phone: $("#mob_no").val(), email: $("#email").val(), ref_merchant: $("#merchant_name").val() },
						type: "POST",
						success: function(data) {
							window.localStorage.setItem("first_time_update", "1");
							window.localStorage.setItem("registration","yes");
							//alert(window.localStorage.getItem("registration"));
							$.mobile.loading("hide");
							localStorage.openSuccessPopup = 1;
							$(':mobile-pagecontainer').pagecontainer('change', '#coupon', {
								reload: false
							});
						}
					});	
					return false;
				}
			});
			 
			function _initPages () {
				//alert("calling pageinit");
			};
		};
    },
    
    loadContent: function() {
		//$(document).on("pagecreate",function(event){	
				
				app.swipeMerchantFunc();
							
				app.swipeCouponFunc();
				
				$( document ).on( "pagecreate", "#registration", function() {					
				   	$(function() {
						$("#autocomplete2").on("click", "li", function() {
							// here I want to get the clicked id of the li (e.g. bakkerLink)
							//var id = this.id;
							//alert($(this).attr("mer-value"));
							$("#merchant_name").val($(this).attr("mer-value"));
							$("#autocomplete-input2").val($(this).text());
							$("#autocomplete2").html( "" );
							$("#autocomplete2").listview( "refresh" );
							//alert($(this).attr("mer-value")+$(this).text());
						});
					});
					//var weburl="https://nearbybestdeals.com/misc/web_service_new/web_services/";
				    $( "#autocomplete2" ).on( "filterablebeforefilter", function ( e, data ) {
				        var $ul = $( this ),
				            $input = $( data.input ),
							value = $input.val(),
				            html = "";
				        $ul.html( "" );
				        if ( value && value.length > 2 ) {							
				            $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
				            $ul.listview( "refresh" );
							$.ajax({
								beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
								complete: function() { $.mobile.loading("hide"); }, //Hide spinner
								url: web_url+"merchant/autocomplete.php",
								data: { q: value },
								type: "POST",
								success: function(data) {
									//alert(data);
									var response=$.parseJSON(data);
							
					                $.each( response, function ( i, val ) {
										
					                    html += "<li mer-value="+val.value+">" + val.label + "</li>";
					                });
									//alert(html);
					                $ul.html( html );
					                $ul.listview( "refresh" );
					                $ul.trigger( "updatelayout");
								}
							});				
				        }
				    });	
				});
				
				$( document ).on( "pagecreate", "#listdealer", function() {
					app.initListDealer();
				   	$(function() {
						$("#autocomplete").on("click", "li", function() {
							// here I want to get the clicked id of the li (e.g. bakkerLink)
							//var id = this.id;
							//alert($(this).attr("mer-value"));
							$("#merchant_name2").val($(this).attr("mer-value"));
							$("#autocomplete-input").val($(this).text());
							$("#autocomplete").html( "" );
							$("#autocomplete").listview( "refresh" );
							//alert($(this).attr("mer-value")+$(this).text());
						});
					});
					//var weburl="https://nearbybestdeals.com/misc/web_service_new/web_services/";
				    $( "#autocomplete" ).on( "filterablebeforefilter", function ( e, data ) {
				        var $ul = $( this ),
				            $input = $( data.input ),
							value = $input.val(),
				            html = "";
				        $ul.html( "" );
				        if ( value && value.length > 2 ) {							
				            $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
				            $ul.listview( "refresh" );
							$.ajax({
								beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
								complete: function() { $.mobile.loading("hide"); }, //Hide spinner
								url: web_url+"merchant/autocomplete.php",
								data: { q: value },
								type: "POST",
								success: function(data) {
									//alert(data);
									var response=$.parseJSON(data);
							
					                $.each( response, function ( i, val ) {
										
					                    html += "<li mer-value="+val.value+">" + val.label + "</li>";
					                });
									//alert(html);
					                $ul.html( html );
					                $ul.listview( "refresh" );
					                $ul.trigger( "updatelayout");
								}
							});							
				        }
				    });				
				});
				
				$(document).on('mousedown','a', function(e) {
					e.preventDefault();
					var elem = $(this);
					var url = elem.attr('href');
					if (url.indexOf('http://') !== -1) {
						alert("caught");
						window.open(url, '_system');
					}
				});
				
				$(document).on('click tap', 'a', function (e) {
				   var elem = $(this);
				   var url = elem.attr('href');
				   if (url.indexOf('http://') !== -1) {
					   e.preventDefault();
					   window.open(url, '_system');
					   return false;
				   }
				});
				//alert("pagecreate event fired next time!"+event);
		//});		
	},
	
	swipeCouponFunc: function(){
		
	},
  
	swipeMerchantFunc: function(){
		$( document ).on( "swipeleft swiperight", "#list2 li", function( event ) {
			
			var listitem = $( this ),
			// These are the classnames used for the CSS transition
			dir = event.type === "swipeleft" ? "left" : "right",
			// Check if the browser supports the transform (3D) CSS transition
			transition = $.support.cssTransform3d ? dir : false;		
			var merchant_id = $( this ).find(".delete").attr("delete-id");				
			//alert("swipeleft calling"+ dir +" : transitin :"+transition+"M id :-->"+merchant_id);
							
			confirmAndDelete(merchant_id, device.uuid, listitem, transition );
		});
		
		$( "#list2" ).on( "click", ".delete" , function() {
							
			var listitem = $( this ).parent( "li" );
			var merchant_id = $( this ).attr("delete-id");
						
			confirmAndDelete(merchant_id, device.uuid, listitem );
		});
		
		function confirmAndDelete( merchant_id, uuid, listitem, transition ) {
			//alert("confirm and delete"+ merchant_id + " : " + uuid);
			// Highlight the list item that will be removed
			listitem.children( ".ui-btn" ).addClass( "ui-btn-active" );
			// Inject topic in confirmation popup after removing any previous injected topics
			$( "#confirm2 .topic2" ).remove();
			listitem.find( ".topic2" ).clone().insertAfter( "#question2" );
			// Show the confirmation popup
			$( "#confirm2" ).popup( "open" );
			// Proceed when the user confirms
			$( "#confirm2 #yes2" ).on( "click", function() {
				// Remove with a transition							
				$.ajax({
					beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
					complete: function() { $.mobile.loading("hide");  }, //Hide spinner
					url: web_url+"merchant/remove_merchant.php",
					data: { imei: window.localStorage.getItem("mob_user_id"), merchant_id : merchant_id  },
					type: "POST",
					//headers: //headers
					success: function(data) {
						//...
						//alert(data);
						if(data==0)
						{
							listitem.slideUp('slow', function(){
			                	listitem.remove();
							});
							app.countMerchants();
							$.mobile.loading("hide"); 
						}
						else
						{
							alert("Problem in deleting dealer");
						}
						$( "#confirm2" ).popup( "close" );
					}
				});					
				$( "#list2" ).listview( "refresh" );
				
				var count = $('#list2 li').size();
				$('#total-dealer').text("Total Dealer: "+count);
			});
			
			// Remove active state and unbind when the cancel button is clicked
			$( "#confirm2 #cancel2" ).on( "click", function() {
				listitem.children( ".ui-btn" ).removeClass( "ui-btn-active" );
				$( "#confirm2 #yes2" ).off();
				$( "#confirm2" ).popup( "close" );
			});
		}
	},
	
	setProfile: function(){
		$.ajax({
			beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
			complete: function() { $.mobile.loading("hide"); },
			type: "POST",
			url: web_url+"users/get_profile.php",
			data: { imei_no: window.localStorage.getItem("mob_user_id") }
		})
		.done(function( data ) {
			//alert( "Data Saved: " + data );
			var testJSON = $.parseJSON(data);
			//alert(testJSON);
			
			if (testJSON.length != 0) {
				$.each(testJSON, function(i, clstr) {
					var user_id="";
					//$("#list").append('<li id="dealer_li'+i+'"><a  id="merchant'+i+'" href="#demo-mail"></a></li>');
					//alert("Key : -- "+i+" Value : -- "+clstr);
					if(i=="name")
						$("#f_name_update").val(clstr);
					else if(i=="email")
						$("#email_update").val(clstr);
					else if(i=="phone")
						$("#mob_no_update").val(clstr);
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
	},
	
	initAddDealer:function(){
		//$('#myDiv').one('click', function() {
		
	},
	
	initListDealer: function () {
		$.ajax({
			beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
			complete: function() { $.mobile.loading("hide"); }, //Hide spinner
			url: web_url+"merchant/list_merchant.php",
			data: { imei: window.localStorage.getItem("mob_user_id") },
			type: "POST",
			success: function(data) {
				//alert("count");
				$("#list2").empty();
				var testJSON = $.parseJSON(data);
				if (testJSON.length != 0) {
					$.each(testJSON, function(i, clstr) {
						var user_id="";
						
						//$("#list2").append('<li id="dealer_li'+i+'"><a id="merchant'+i+'" href="#" class="delete merchant_desc" style="margin-right: 0px;" delete-id='+clstr.id+'></a></li>');
						$("#list2").append('<li id="dealer_li'+i+'" style="padding:0px;"><div class="ui-grid-a"><div class="ui-block-a" style="width:70%;"><div class="ui-bar ui-bar-a" style="height:60px;padding:0.4em;"><a style="text-decoration:none;" id="merchant'+i+'" href="#" class="delete merchant_desc" delete-id='+clstr.id+'></a></div></div><div class="ui-block-b" style="width:30%;"><div class="ui-bar ui-bar-a" style="height:60px;padding:0.4em;"><select id="select-based-flipswitch'+clstr.id+'" data-role="flipswitch" data-corners="true" data-mini="true" class="notif_status" dealer-no="'+clstr.id+'"><option value="1">On</option><option value="0">Off</option></select></div></div></div></li>');
						//alert("Key : -- "+i+" Value : -- "+clstr);
						$.each(clstr, function(k, ndes) {
							if(k=="merchant")
								$("#merchant"+i).append('<h3>'+ndes+'</h3>');
							/*if(k=="desc")
								$("#merchant"+i).append('<p class="desc">'+ndes+'</p>');
							if(k=="id")
								user_id=ndes;*/
							//alert("Key : -- "+k+" Value : -- "+ndes);
						});
						//$("#dealer_li"+i).append('<p class="ui-li-aside" style="right: 1.333em;"><select data-mini="true" id="select-based-flipswitch'+clstr.id+'" data-role="flipswitch" data-corners="false" class="notif_status" dealer-no="'+clstr.id+'"><option value="1">On</option><option value="0">Off</option></select></p>');
						$("#select-based-flipswitch"+clstr.id).val(clstr.notif);
					});
					
					$(".notif_status").on('change', function (event) {
						//$(".notif_status").flipswitch().flipswitch("refresh");
						//alert($(this).attr("dealer-no")+" : "+$(this).val());						
						$.ajax({
							beforeSend: function() { }, //Show spinner
							complete: function() { }, //Hide spinner
							url: "https://nearbybestdeals.com/misc/web_service_new/web_services/merchant/upadate_merchant.php",
							data: { imei:window.localStorage.getItem("mob_user_id"),dealer_no:$(this).attr("dealer-no"),switch_val:$(this).val() },
							type: "POST",
							success: function(data) {
								//alert(data);
								//$(this).val("0").flipswitch("refresh");
							}
						});									
					});
					$(".notif_status").flipswitch().flipswitch("refresh");
					$( "#list2" ).listview( "refresh" );
					var count = $('#list2 li').size();
					$('#total-dealer').text("Total Dealer: "+count);
				}
			}
		});
		// Swipe to remove list item		
	},
	
	nearByDeals: function (data) {
		$("#nearbydealslist").empty();
		var testJSON = $.parseJSON(data);
		if (testJSON.length != 0) {
			$.each(testJSON, function(i, clstr) {
				var user_id="";
				//alert(clstr.lat_lon + clstr.id.lat_lon);
				
				//$("#nearbydealslist").append('<li id="nearby_li'+i+'"><a id="merchant'+i+'" href="#"><div id="first'+i+'" class="ui-grid-a ui-responsive"></div><div id="solo'+i+'" class="ui-grid-a ui-responsive"></div><div id="second'+i+'" class="ui-grid-a ui-responsive"></div></a></li>');
				//$("#nearbydealslist").append('<li class="ui-li-has-alt" id="nearby_li'+i+'"><h3>'+clstr.merchant_name+'</h3><div class="ui-grid-a"><div class="ui-block-a" style="width:15%;"><img src="img/coupon_tag-r.png" width="100%" align="middle" alt="USA" class="ui-li-icon"/></div><div class="ui-block-b" style="width:85%;padding:3%;"><strong>'+clstr.coupon_code+'</strong></div></div><hr><p style="text-align:center;font-weight:bold;">'+clstr.title+'</p><hr><button class="ui-btn ui-icon-info ui-btn-icon-left ui-btn-active ui-state-persist nearby_single" coupon-id="'+i+'">Coupon Detail</button><p><button onclick="window.open(\'https://www.google.com/maps/?saddr='+window.localStorage.getItem("langtitude")+','+window.localStorage.getItem("longtitude")+'&daddr='+clstr.lat_lon+'\', \'_system\')" class="ui-link ui-btn ui-icon-location ui-btn-icon-left ui-btn-active ui-state-persist">Locate Dealer: '+clstr.distance+' Miles</button><p><p class="ui-li-aside" style="right: 1.333em;"><strong style="color:#3388cc;" data-countdown="'+clstr.expire_time+'"></strong></p></li>');
				//$("#nearbydealslist").append('<li class="ui-li-has-alt" id="nearby_li'+i+'"><h3>'+clstr.merchant_name+'</h3><div class="ui-grid-a"><div class="ui-block-a" style="width:15%;"><img src="img/coupon_tag-r.png" width="100%" align="middle" alt="USA" class="ui-li-icon"/></div><div class="ui-block-b" style="width:85%;padding:3%;"><strong>'+clstr.coupon_code+'</strong></div></div><hr><p style="text-align:center;font-weight:bold;">'+clstr.title+'</p><hr><button class="ui-btn ui-icon-info ui-btn-icon-left ui-btn-active ui-state-persist nearby_single" coupon-id="'+i+'">Coupon Detail</button><p><button onclick="event.preventDefault();launchnavigator.navigateByLatLon('+clstr.lat+','+clstr.lon+');" class="ui-link ui-btn ui-icon-location ui-btn-icon-left ui-btn-active ui-state-persist">Locate Dealer: '+clstr.distance+' Miles</button><p><p class="ui-li-aside" style="right: 1.333em;"><strong style="color:#3388cc;" data-countdown="'+clstr.expire_time+'"></strong></p></li>');
				$("#nearbydealslist").append('<li class="ui-li-has-alt" id="nearby_li'+i+'"><h3>'+clstr.merchant_name+'</h3><div class="ui-grid-a"><div class="ui-block-a" style="width:15%;"><img src="img/coupon_tag-r.png" width="100%" align="middle" alt="USA" class="ui-li-icon"/></div><div class="ui-block-b" style="width:85%;padding:3%;"><strong>'+clstr.coupon_code+'</strong></div></div><hr><p style="text-align:center;font-weight:bold;">'+clstr.title+'</p><hr><button class="ui-btn ui-icon-info ui-btn-icon-left ui-btn-active ui-state-persist nearby_single" coupon-id="'+i+'">Coupon Detail</button><p class="ui-li-aside" style="right: 1.333em;"><strong style="color:#3388cc;" data-countdown="'+clstr.expire_time+'"></strong></p></li>');
			});
			
			$('#nearbydealslist [data-countdown]').each(function() {
				//alert($(this).data('countdown'));
				var $this = $(this), finalDate = $(this).data('countdown');
				$this.countdown(finalDate, function(event) {						
					$this.html(event.strftime('%D days %H:%M:%S'));
				});
				//alert("calling countdown in list coupon: "+finalDate);
			});
			$( "#nearbydealslist" ).listview( "refresh" );
			var count = $('#nearbydealslist li').size();
			//alert(count);
			$('#total-deals').text("Total Deals: "+count);
		}
		// Swipe to remove list item
	},
	
	initSingleMerchant: function(merchant_id) {
		 $.ajax({
			beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
			complete: function() { $.mobile.loading("hide"); }, //Hide spinner
			url: web_url+"merchant/list_single_merchant.php",
			data: { merchant_id: merchant_id },
			type: "POST",
			success: function(data) {
				//alert(data);	
				var testJSON = $.parseJSON(data);
				if (testJSON.length != 0) {
					$.each(testJSON, function(i, clstr) {								
						//alert(i+","+clstr);
						if(i=="merchant_phone"){
							$("#merchant_phone").attr("href","tel:"+clstr);
							$("#"+i).html(clstr);
						}
						else if(i=="merchant_email"){
							$("#merchant_email").attr("href","mailto:"+clstr);
							$("#"+i).html(clstr);
						}
						else if(i=="locate_merchant"){
							//$("#merchant_email").attr("href","mailto:"+clstr);
							//$("#locate_merchant").attr('onclick',"window.open('https://www.google.com/maps/?saddr="+window.localStorage.getItem("langtitude")+","+window.localStorage.getItem("longtitude")+"&daddr="+clstr+"', '_system')");
							$("#locate_merchant").attr('onclick',"event.preventDefault();launchnavigator.navigateByLatLon("+testJSON.lat+","+ testJSON.lon+")");
						}
						else
						{
							$("#"+i).html(clstr);
						}
						
						//$("#coupon_title").text(row.coupon_title);
						//$("#coupon_code").text(row.coupon_code);
						//$("#coupon_expiry").text(row.expire_time);
						//$("#coupon_desc").text(row.coupon_desc);
					});
				}
				//jQuery('#merchant_call').button('refresh');
			}
		});
	},
	
	initNearbySingleCoupon: function(coupon_id) {	
		 $.ajax({
			beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
			complete: function() { $.mobile.loading("hide"); }, //Hide spinner
			url: web_url+"deals/list_single_coupon.php",
			data: { coupon_id: coupon_id, lat: window.localStorage.getItem("langtitude"), lon: window.localStorage.getItem("longtitude") },
			type: "POST",
			success: function(data) {
				//alert(data);
				
				var testJSON = $.parseJSON(data);												
				
				if ( device.platform == 'android' || device.platform == 'Android' || device.platform == 'ANDROID'){						
					//$(".nearby-facebook-share").attr("onclick","$.mobile.loading('show');window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint('Use Coupon code :"+testJSON.nearby_single_coupon_code+" And get "+testJSON.nearby_single_coupon_desc+" at "+testJSON.nearby_single_coupon_merchant+" Locate merchant using this link: https://www.google.com/maps/@"+testJSON.nearby_single_coupon_lat+","+testJSON.nearby_single_coupon_lon+",18z', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', null, 'Please paste message from clipboard!', function() {$.mobile.loading('hide');}, function(errormsg){alert(errormsg);$.mobile.loading('hide');})");
					$(".nearby-facebook-share").attr("onclick","$.mobile.loading('show');window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint('Use Coupon code :"+testJSON.nearby_single_coupon_code+" And get "+testJSON.nearby_single_coupon_desc+" at "+testJSON.nearby_single_coupon_merchant+" Locate merchant using this link: http://maps.google.com/maps?q=loc:"+testJSON.nearby_single_coupon_lat+","+testJSON.nearby_single_coupon_lon+"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', null, 'Please paste message from clipboard!', function() {$.mobile.loading('hide');}, function(errormsg){alert(errormsg);$.mobile.loading('hide');})");
				}
				else
				{
					$(".nearby-facebook-share").attr("onclick","$.mobile.loading('show');window.plugins.socialsharing.shareViaFacebook('Use Coupon code :"+testJSON.nearby_single_coupon_code+" And get "+testJSON.nearby_single_coupon_desc+" at "+testJSON.nearby_single_coupon_merchant+"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', 'http://maps.google.com/maps?q=loc:"+testJSON.nearby_single_coupon_lat+","+testJSON.nearby_single_coupon_lon+"', function() {$.mobile.loading('hide');}, function(errormsg){alert(errormsg);$.mobile.loading('hide');})");
				}
				
				//$(".nearby-twitter-share").attr("onclick","$.mobile.loading('show');window.plugins.socialsharing.shareViaTwitter('Use Coupon code :"+testJSON.nearby_single_coupon_code+" And get "+testJSON.nearby_single_coupon_desc+" at "+testJSON.nearby_single_coupon_merchant+"', null, 'https://www.google.com/maps/@"+testJSON.nearby_single_coupon_lat+","+testJSON.nearby_single_coupon_lon+",18z');$.mobile.loading('hide');");
				$(".nearby-twitter-share").attr("onclick","event.preventDefault();$.mobile.loading('show'); setTimeout(function(){		window.plugins.socialsharing.shareViaTwitter('Use Coupon code :"+testJSON.nearby_single_coupon_code+" And get "+testJSON.nearby_single_coupon_desc+" at "+testJSON.nearby_single_coupon_merchant+"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', 'http://maps.google.com/maps?q=loc:"+testJSON.nearby_single_coupon_lat+","+testJSON.nearby_single_coupon_lon+"'); $.mobile.loading('hide'); }, 5000);");
				
				$(".nearby-whatsapp-share").attr("onclick","$.mobile.loading('show');window.plugins.socialsharing.shareViaWhatsApp('Use Coupon code :"+testJSON.nearby_single_coupon_code+" And get "+testJSON.nearby_single_coupon_desc+" at "+testJSON.nearby_single_coupon_merchant+"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', 'http://maps.google.com/maps?q=loc:"+testJSON.nearby_single_coupon_lat+","+testJSON.nearby_single_coupon_lon+"',function() {$.mobile.loading('hide');}, function(errormsg){alert(errormsg);$.mobile.loading('hide');})");
				//$(".nearby-whatsapp-share").attr("onclick","$.mobile.loading('show');window.plugins.socialsharing.canShareVia('whatsapp','Use Coupon code :"+testJSON.nearby_single_coupon_code+" And get "+testJSON.nearby_single_coupon_desc+" at "+testJSON.nearby_single_coupon_merchant+"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', 'http://maps.google.com/maps?q=loc:"+testJSON.nearby_single_coupon_lat+","+testJSON.nearby_single_coupon_lon+"',function() {$.mobile.loading('hide');}, function(errormsg){alert(errormsg);$.mobile.loading('hide');})");
				
				//$(".mail-share").attr("onclick","window.plugins.socialsharing.shareViaEmail('"+testJSON.nearby_single_coupon_desc+" Locate dealer : https://www.google.com/maps/@"+testJSON.nearby_single_coupon_lat+","+testJSON.nearby_single_coupon_lon+"','"+testJSON.nearby_single_coupon_merchant+" : "+testJSON.nearby_single_coupon_code"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', null, function(msg) {alert('ok: ' + msg)}, function(msg) {alert('error: ' + msg)})");
				
				$(".nearby-sms-share").attr("onclick","$.mobile.loading('show');window.plugins.socialsharing.shareViaSMS('Use Coupon code :"+testJSON.nearby_single_coupon_code+" And get "+testJSON.nearby_single_coupon_desc+" at "+testJSON.nearby_single_coupon_merchant+" : Location : http://maps.google.com/maps?q=loc:"+testJSON.nearby_single_coupon_lat+","+testJSON.nearby_single_coupon_lon+"', null, function(msg) {$.mobile.loading('hide');}, function(msg) {alert('error: ' + msg);$.mobile.loading('hide');})");
				
				if (testJSON.length != 0) {
					$.each(testJSON, function(i, clstr) {								
						//alert(i+","+clstr);
						/*if(i=="nearby_single_coupon_distance"){
							$("#merchant_phone").attr("href","tel:"+clstr);
						}
						else if(i=="merchant_email"){
							$("#merchant_email").attr("href","mailto:"+clstr);
						}*/
						//alert(i);
				
						if(i=="nearby_single_coupon_merchantid")
							$("#"+i).attr("merchant-id",clstr);
						else if(i=="nearby_single_coupon_distance")
						{
							$("#nearby_single_coupon_distance").attr('onclick',"event.preventDefault();launchnavigator.navigateByLatLon("+testJSON.nearby_single_coupon_lat+", "+testJSON.nearby_single_coupon_lon+");");
							$("#"+i).text(clstr);
						}
						else if(i=="nearby_single_coupon_desc")
						{
							//$("#nearby_single_coupon_distance").attr('onclick',"window.open('https://www.google.com/maps/?saddr="+window.localStorage.getItem("langtitude")+","+window.localStorage.getItem("longtitude")+"&daddr="+clstr+"', '_system')");
							$("#"+i).html(clstr);
						}
						else
							$("#"+i).text(clstr);
					});
				}
				//jQuery('#merchant_call').button('refresh');
				$( "#nearbydealsSingle" ).listview( "refresh" );
			}
		});
	},
	
	couponShow: function () {
		
		//alert("coupon shown called");
		
		
		//add coupon description page
		
	},
	
	initProfile: function() {
		
		var dev_uuid=window.localStorage.getItem("uuid");		
					
		$('#form2').validate({
			rules: {
				f_name_update: {
					required: true
				},
				mob_no_update: {
					required: true,
					number: true
				},
				email_update: {
					required: true,
					email: true
				},
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
			},
			errorPlacement: function (error, element) {
				//error.appendTo(element.parent().prev());
				error.insertAfter( element.parent() );
			},
			submitHandler: function (form) {
				$.ajax({
					beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
					complete: function() { $.mobile.loading("hide"); }, //Hide spinner
					url: web_url+"users/update_profile.php",
					data: { uuid: device.uuid, name: $("#f_name_update").val(), phone: $("#mob_no_update").val(), email: $("#email_update").val()  },
					type: "POST",
					success: function(data) {
						localStorage.openUpdatePopup = 1;
						$(':mobile-pagecontainer').pagecontainer('change', '#coupon', {
							reload: false
						});
					}
				});
				return false;
			}
		});
	},
    
    countMerchants: function() {
		//alert("calling count merchats event"+window.localStorage.getItem("mob_user_id"));
       	$.ajax({
			beforeSend: function() {  }, //Show spinner
			complete: function() {  }, //Hide spinner
			url: web_url+"merchant/count_merchants.php",
			data: { imei: window.localStorage.getItem("mob_user_id")},
			type: "POST",
			success: function(data) {
				//alert(data);
				$(".dealer-count").text(data);
				//var count = $('#list2 li').size();
				//alert(count)
				$('#total-dealer').text("Total Dealer: "+data);
				//jQuery('#merchant_call').button('refresh');
				//$( "#nearbydealsSingle" ).listview( "refresh" );
			}
		});
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
