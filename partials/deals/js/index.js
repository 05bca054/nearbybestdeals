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
      
	"init": function () {
		console.log("[init]");
	 
		if (document.URL.indexOf("http://") === -1) {
			app.testing_on_desktop = false;
		}
	 
		jQuery(document).ready(function () {
			console.log("jQuery finished loading");
	 
			if (app.testing_on_desktop) {
				console.log("PhoneGap finished loading");
				_onDeviceReady();
			} else {
				document.addEventListener("deviceReady", function () {
					console.log("PhoneGap finished loading");
					_onDeviceReady();
				}, false);
			}
	 
			jQuery(document).one("pageinit", function () {
				console.log("jQuery.Mobile finished loading");
			});
	 
			console.log("PhoneGap & jQuery.Mobile finished loading");
			initPages();
			console.log("App finished loading");
			app.app_loaded = true;
		});
	 
		function _onDeviceReady () {
		};
		function initPages () {
			//alert("initn pages");
			
			$(document).on("pageshow","#nearbydeals",function(e){ // When entering pagetwo
				$( "#openNearByDeals" ).trigger( "click" );
			});
			
			
			$(document).on("pageshow","#nearby_single_coupon",function(e){ // When entering pagetwo
				//coupon.getCouponsDesc(localStorage.coupon_id);
				alert("single merchant page"+localStorage.nearby_coupon_id);
				app.initNearbySingleCoupon(localStorage.nearby_coupon_id);
			});
			
			$(document).on('click', '#nearby_single_coupon_merchantid', function(){
				localStorage.merchant_id = $(this).attr("merchant-id");
				$(':mobile-pagecontainer').pagecontainer('change', '#single_merchant', {
					reload: false
				});
			});
			
			$(document).on('click', '.nearby_single', function(){
			// store some data
				var nearby_coupon_id = $( this ).attr("coupon-id");
				alert(nearby_coupon_id);
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
			
			$("#search").click(function(e) {
				e.preventDefault();
				var category_val="";
				if ($('input#def_category').is(':checked')) {
					alert("def checked");
					//get value of user selected category in
				}
				else
				{			 
					$(':checkbox:checked').each(function(i){					
					  category_val += $(this).val()+",";
					  //alert(category_val);
					});
					
					var categoryies = category_val.slice(0,-1);
					//alert(categoryies);
				}
				//alert($("#distance").val());
				
				$.ajax({
					beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
					complete: function() { $.mobile.loading("hide"); }, //Hide spinner
					url: "http://162.220.167.131/misc/web_services/test.php",
					//data: { merchant_id: $("#merchant_name2").val(), imei: device.uuid  },
					data: { dist: $("#distance").val(), lat: "23.0488002", lon: "72.5320014", cat: categoryies },
					type: "POST",
					success: function(data) {
						//alert(data);
						app.nearByDeals(data);
						$( "#popupNearbyDeals" ).popup( "close" );						
					}
				});	
				return false;				
			});
			
			$("#def_category").click(function() { 
				$("fieldset#cat_set").toggle("blind", { 'direction' : 'vertical' }, 500);
			});
		};
	},
	
	initNearbySingleCoupon: function(coupon_id) {
		 $.ajax({
			beforeSend: function() { $.mobile.loading("show"); }, //Show spinner
			complete: function() { $.mobile.loading("hide"); }, //Hide spinner
			url: "http://162.220.167.131/misc/web_services/deals/list_single_coupon.php",
			data: { coupon_id: coupon_id, lat: "23.0488002", lon: "72.5320014" },
			type: "POST",
			success: function(data) {
				//alert(data);
				var testJSON = $.parseJSON(data);
				if (testJSON.length != 0) {
					$.each(testJSON, function(i, clstr) {								
						//alert(i+","+clstr);
						/*if(i=="merchant_phone"){
							$("#merchant_phone").attr("href","tel:"+clstr);
						}
						else if(i=="merchant_email"){
							$("#merchant_email").attr("href","mailto:"+clstr);
						}*/
						//alert(i);
						if(i=="nearby_single_coupon_merchantid")
							$("#"+i).attr("merchant-id",clstr)
						else
							$("#"+i).text(clstr);						
					});
				}
				//jQuery('#merchant_call').button('refresh');
				$( "#nearbydealsSingle" ).listview( "refresh" );
			}
		});
	},
    
  nearByDeals: function (data) {
		$("#nearbydealslist").empty();
		var testJSON = $.parseJSON(data);
		if (testJSON.length != 0) {
			$.each(testJSON, function(i, clstr) {
				var user_id="";
				//alert(clstr.lat_lon + clstr.id.lat_lon);
				
				$("#nearbydealslist").append('<li id="nearby_li'+i+'"><a coupon-id="'+i+'" id="merchant'+i+'" href="#" class="nearby_single"><div id="first'+i+'" class="ui-grid-a ui-responsive"></div><div id="second'+i+'" class="ui-grid-a ui-responsive"></div><div id="solo'+i+'" class="ui-grid-solo"></div></a></li>');
				//alert("Key : -- "+i+" Value : -- "+clstr);
				$.each(clstr, function(k, ndes) {
					//alert(k + ndes);					
					//$("#"+i).html(clstr);		
					
					if(k=="merchant_name")
						$("#first"+i).append('<div class="ui-block-a"><h3>'+ndes+'</h3></div>');
					if(k=="distance")
					{
						//alert('<div class="ui-block-b"><a onclick="window.open(\'https://www.google.com/maps/@'+clstr.lat_lon+',16z\', \'_system\')" class="ui-link ui-btn ui-icon-location ui-btn-icon-left ui-btn-active ui-state-persist">'+ndes+'</a></div>');
						//$("#first"+i).append('<div class="ui-block-b"><a onclick="window.open(\'https://www.google.com/maps/@'+clstr.lat_lon+',16z\', \'_system\')" class="ui-link ui-btn ui-icon-location ui-btn-icon-left ui-btn-active ui-state-persist">'+ndes+'</a></div>');
						//$("#first"+i).append('<div class="ui-block-b"><a onclick="window.open(\'https://www.google.com/maps/?saddr='+clstr.lat_lon+'&daddr='+clstr.lat_lon+'\', \'_system\')" class="ui-link ui-btn ui-icon-location ui-btn-icon-left ui-btn-active ui-state-persist">'+ndes+'</a></div>');
						$("#first"+i).append('<div class="ui-block-b"><a onclick="window.open(\'https://www.google.com/maps/?saddr='+window.localStorage.getItem("langtitude")+','+window.localStorage.getItem("longtitude")+'&daddr='+clstr.lat_lon+'\', \'_system\')" class="ui-link ui-btn ui-icon-location ui-btn-icon-left ui-btn-active ui-state-persist">'+ndes+'</a></div>');
					}
					if(k=="coupon_code")
						$("#second"+i).append('<div class="ui-block-a"><a href="#" class="ui-link ui-btn ui-icon-shop ui-btn-icon-left">Code : '+ndes+'</a></div>');
					if(k=="expire_time")
					{
						$("#second"+i).append('<div class="ui-block-b"><a href="#" class="ui-link ui-btn ui-icon-clock ui-btn-icon-left" data-countdown="'+ndes+'"></a></div>');
						//$("#second"+i).append('<div class="ui-block-b"><a href="#" class="ui-link ui-btn ui-icon-clock ui-btn-icon-left">'+ndes+'</a></div>');
					}
					if(k=="title")
						$("#solo"+i).append('<div class="ui-block-a"><div class="ui-bar" style="height:30px"><b>'+ndes+'</b></div></div>');
					if(k=="desc")
						$("#merchant"+i).append(ndes);
					//alert("Key : -- "+k+" Value : -- "+ndes);
				});
				//$("#nearby_li"+i).append('<a href="#" class="delete" delete-id="'+user_id+'">Delete</a>');
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
		}
		// Swipe to remove list item		
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
