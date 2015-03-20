var coupon = {
    // based on http://www.html5rocks.com/en/tutorials/webdatabase/todo/ sample by Paul Kinlan
    // Application Constructor
    initialize: function () {
        this.db = null;
        this.bindEvents();
    },

    onError: function (transaction, error) {
        console.log('Error: ' + error.message);
       // document.getElementById("lblInfo").innerHTML = 'ERROR: ' + error.message;
    },
    
    onCouponLoadError: function (transaction, error) {
		alert('Error: ' + error.message);
       // document.getElementById("lblInfo").innerHTML = 'ERROR: ' + error.message;
    },

    onSuccess: function (transaction, resultSet) {
		//alert('Operation completed successfully');
		//alert('RowsAffected: ' + resultSet.rowsAffected + '; InsertId: ' + resultSet.insertId);
        //coupon.getAllTodoItems(transaction);
    },

    openDatabase: function () {
        var dbSize = 5 * 1024 * 1024; // 5MB
        // open database
        //IOS only
        coupon.db = window.sqlitePlugin.openDatabase({name: "coupon_mgr"});
        //alert('db successfully opened or created');
        //Android only
        
		/* coupon.db = openDatabase("coupon_mgr", "", "coupon manager", dbSize, function() {
            alert('db successfully opened or created');
        });*/
    },

    createTable: function () {
        coupon.db.transaction(function (tx) {
			//alert("in create table");
            tx.executeSql("CREATE TABLE IF NOT EXISTS coupon(ID INTEGER PRIMARY KEY ASC, merchant_name TEXT, coupon_title TEXT, coupon_desc TEXT, coupon_code TEXT, expire_time TEXT,merchant_id INTEGER,lat TEXT,lon TEXT,sharable TEXT)", [],
                coupon.onSuccess, coupon.onError);
			//alert("create table complete");
        });
    },
    
    getCoupons: function () {
		
		coupon.deleteAllExpires();
		//alert("into getCoupons");
		coupon.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM coupon", [], function (tx, resultSet) {
				//alert("calling loadCoupons internal callback "+resultSet.rows.length);
				$("#list").empty();
				for (var i = 0; i < resultSet.rows.length; i++) {
					row = resultSet.rows.item(i);
					//alert(resultSet.rows.length);
					//$("#list").append('<li class="ui-li-has-alt" id="coupon_'+row.ID+'"><a show-id="'+row.ID+'" id="coupon_link_'+row.ID+'" href="#" class="coupon_desc"><h3>'+row.merchant_name+'</h3><p class="topic"><strong>'+row.coupon_code+'</strong></p><p>'+row.coupon_title+'</p><p class="ui-li-aside"><strong data-countdown="'+row.expire_time+'"></strong></p></a><a href="#" class="delete ui-btn ui-btn-icon-notext ui-icon-delete" title="Delete" delete-id="'+row.ID+'"></a></li>');
					//$("#list").append('<li class="ui-li-has-alt" id="coupon_'+row.ID+'"><a id="coupon_link_'+row.ID+'" href="#"><h3>'+row.merchant_name+'</h3><div class="ui-grid-a"><div class="ui-block-a" style="width:15%;"><img src="img/coupon_tag-r.png" width="100%" align="middle" alt="USA" class="ui-li-icon"/></div><div class="ui-block-b" style="width:85%;padding:3%;"><strong>'+row.coupon_code+'</strong></div></div><hr><p style="text-align:center;font-weight:bold;">'+row.coupon_title+'</p><hr><button class="ui-btn ui-icon-info ui-btn-icon-left ui-btn-active ui-state-persist coupon_desc" show-id="'+row.ID+'">Coupon Detail</button><p class="ui-li-aside" style="right: 1.333em;"><strong style="color:#3388cc;" data-countdown="'+row.expire_time+'"></strong></p></a><a href="#" class="delete ui-btn ui-btn-icon-notext ui-icon-delete" title="Delete" delete-id="'+row.ID+'"></a></li>');
					$("#list").append('<li class="ui-li-has-alt" delete-id="'+row.ID+'" id="coupon_'+row.ID+'"><a id="coupon_link_'+row.ID+'" href="#" delete-id="'+row.ID+'" class="delete coupon_desc" style="margin-right: 0px;" show-id="'+row.ID+'"><h3>'+row.merchant_name+'</h3><div class="ui-grid-a"><div class="ui-block-a" style="width:15%;"><img src="img/coupon_tag-r.png" width="100%" align="middle" alt="USA" class="ui-li-icon"/></div><div class="ui-block-b" style="width:85%;padding:3%;"><strong>'+row.coupon_code+'</strong></div></div><hr><p style="text-align:center;font-weight:bold;">'+row.coupon_title+'</p><hr><p class="ui-li-aside" style="right: 1.333em;"><strong style="color:#3388cc;" data-countdown="'+row.expire_time+'"></strong></p></a></li>');
				}
				
				if(resultSet.rows.length!=0)
				{
					$('#coupon [data-countdown]').each(function() {
					//alert($(this).data('countdown'));
						var $this = $(this), finalDate = $(this).data('countdown');
						$this.countdown(finalDate, function(event) {						
							$this.html(event.strftime('%D days %H:%M:%S'));
						});
						//alert("calling countdown in list coupon: "+finalDate);
					});
				}
				
				$( "#list" ).listview( "refresh" );
				var count = $('#list li').size();
				//alert(count);
				$('#total-coupon').text("Total Coupons: "+count);
			 }, coupon.onCouponLoadError);
        });
    },

	getCouponsDesc: function (coupon_id) {
		//alert("into getCoupons");
		coupon.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM coupon where id = ?", [coupon_id], function (tx, resultSet) {
				//alert("calling loadCoupons internal callback"+resultSet.rows.length+" : "+resultSet);
				//$("#list").empty();
				for (var i = 0; i < resultSet.rows.length; i++) {
					row = resultSet.rows.item(i);
					
					//alert(row.expire_time);
					
					$("#single_coupon_merchant").text(row.merchant_name);
					//$("#single_coupon_distance").text(row.distance);
					//$("#single_coupon_distance").attr('onclick',"window.open('https://www.google.com/maps/?saddr="+window.localStorage.getItem("langtitude")+","+window.localStorage.getItem("longtitude")+"&daddr="+row.lat+","+row.lon+"', '_system')");
					$("#single_coupon_distance").attr('onclick',"event.preventDefault();launchnavigator.navigateByLatLon("+row.lat+","+row.lon+");");
					$("#single_coupon_title").text(row.coupon_title);
					$("#single_coupon_code").text(row.coupon_code);					
					$("#single_coupon_merchantid").attr("merchant-id",row.merchant_id);
					$("#single_coupon_exipry").text(row.expire_time);
					$("#single_coupon_exipry").attr("data-countdown",row.expire_time);
					//alert(row.expire_time+"new alert");
					$('#single_coupon_exipry').countdown(row.expire_time, function(event) {
						$(this).html(event.strftime('%D days %H:%M:%S'));
					});
					$("#single_coupon_desc").text(row.coupon_desc);
					//$(".social-share").attr("onclick"."window.plugins.socialsharing.share('"+row.coupon_desc+"', '"+row.coupon_title+" : "+row.coupon_code+" ', 'https://www.google.nl/images/srpr/logo4w.png', 'https://www.google.com/maps/@"+row.lat+","+row.lon+",17z')");
					//$(".facebook-share").attr("onclick","window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint('Use Coupon code :"+row.coupon_code+" <br> And get"+row.coupon_desc+"', 'https://www.google.nl/images/srpr/logo4w.png', 'https://www.google.com/maps/@"+row.lat+","+row.lon+"', 'Please paste message from clipboard!', function() {alert('Share successful')}, function(errormsg){alert(errormsg)})");
					if(row.sharable!="on")
					{
						//alert(row.sharable+"not sharable");
						$("#single_sharable").hide("fast");
					}
					else
					{
						//alert(row.sharable+"sharable");
						$("#single_sharable").show("fast");
					}
					
					$(".facebook-share").attr("onclick","event.preventDefault();$.mobile.loading('show');window.plugins.socialsharing.shareViaFacebook('Use Coupon code :"+row.coupon_code+" And get "+row.coupon_desc+" at "+row.merchant_name+" Locate merchant : http://maps.google.com/maps?q=loc:"+row.lat+","+row.lon+"', null, 'https://www.google.com/maps/@"+row.lat+","+row.lon+",18z', function() {$.mobile.loading('hide');}, function(errormsg){alert(errormsg);$.mobile.loading('hide');})");
					
					//alert(row.expire_time+"after alert");
					//$(".twitter-share").attr("onclick","event.preventDefault();$.mobile.loading('show');window.plugins.socialsharing.shareViaTwitter('Use Coupon code :"+row.coupon_code+" And get "+row.coupon_desc+" at "+row.merchant_name+"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', 'https://www.google.com/maps/@"+row.lat+","+row.lon+",18z');$.mobile.loading('hide');");
					$(".twitter-share").attr("onclick","event.preventDefault();$.mobile.loading('show'); setTimeout(function(){		window.plugins.socialsharing.shareViaTwitter('Use Coupon code :"+row.coupon_code+" And get "+row.coupon_desc+" at "+row.merchant_name+"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', 'http://maps.google.com/maps?q=loc:"+row.lat+","+row.lon+"'); $.mobile.loading('hide'); }, 5000);");
					
					$(".whatsapp-share").attr("onclick","event.preventDefault();$.mobile.loading('show');window.plugins.socialsharing.shareViaWhatsApp('Use Coupon code :"+row.coupon_code+" And get "+row.coupon_desc+" at "+row.merchant_name+"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', 'http://maps.google.com/maps?q=loc:"+row.lat+","+row.lon+"',function() {$.mobile.loading('hide');}, function(errormsg){alert(errormsg);$.mobile.loading('hide');})");
					//$(".whatsapp-share").attr("onclick","$.mobile.loading('show');window.plugins.socialsharing.canShareVia('whatsapp','Use Coupon code :"+testJSON.nearby_single_coupon_code+" And get "+testJSON.nearby_single_coupon_desc+" at "+testJSON.nearby_single_coupon_merchant+"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', 'http://maps.google.com/maps?q=loc:"+testJSON.nearby_single_coupon_lat+","+testJSON.nearby_single_coupon_lon+"',function(e) {$.mobile.loading('hide');alert(e);}, function(errormsg){alert(errormsg);$.mobile.loading('hide');})");
					
					//$(".mail-share").attr("onclick","window.plugins.socialsharing.shareViaEmail('"+row.coupon_desc+" Locate dealer : https://www.google.com/maps/@"+row.lat+","+row.lon+"','"+row.merchant_name+" : "+row.coupon_code"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', null, function(msg) {alert('ok: ' + msg)}, function(msg) {alert('error: ' + msg)})");
					
					$(".sms-share").attr("onclick","event.preventDefault();$.mobile.loading('show');window.plugins.socialsharing.shareViaSMS('Use Coupon code :"+row.coupon_code+" And get "+row.coupon_desc+" at "+row.merchant_name+" : Location : http://maps.google.com/maps?q=loc:"+row.lat+","+row.lon+"', null, function(msg) {$.mobile.loading('hide');}, function(msg) {alert('error: ' + msg);$.mobile.loading('hide');})");
					
					//$(".google-share").attr("onclick","window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint('Use Coupon code :"+row.coupon_code+" And get "+row.coupon_desc+" at "+row.merchant_name+"', 'http://nearbybestdeals.com/wp-content/themes/enfold/images/layout/logo.jpg', null, 'Please paste message from clipboard!', function() {alert('Share successful')}, function(errormsg){alert(errormsg)})");
					//alert(row.coupon_title + ":" + row.coupon_desc + " : " + row.ID + " : " + row.expire_time);
				}
				/*
				var $this = $("#single_coupon_exipry"), finalDate = e.payload.expire_time;
				$this.countdown(finalDate, function(event) {
					//alert(finalDate);
					$this.html(event.strftime('%D days %H:%M:%S'));
				});*/
				
				
				
				/*$('#single_coupon_exipry [data-countdown]').each(function() {
					alert($(this).data('countdown'));
					var $this = $(this), finalDate = $(this).data('countdown');
					$this.countdown(finalDate, function(event) {						
						$this.html(event.strftime('%D days %H:%M:%S'));
					});
					//alert("calling countdown in desc "+finalDate);
				});*/
				
				$( "#couponSingle" ).listview( "refresh" );
				
			 }, coupon.onCouponLoadError);
        });
    },
    
    addCoupon: function (merchant_name, coupon_title, coupon_desc, coupon_code, expire_time, merchant_id, lat, lon, sharable) {
        coupon.db.transaction(function (tx) {
            var ts = new Date().toUTCString();
            //alert(merchant_name+coupon_title+coupon_desc+coupon_code+expire_time+merchant_id+lat+lon);
            tx.executeSql("INSERT INTO coupon(merchant_name, coupon_title, coupon_desc, coupon_code, expire_time, merchant_id, lat, lon, sharable) VALUES (?,?,?,?,?,?,?,?,?)", [merchant_name, coupon_title, coupon_desc, coupon_code, expire_time, merchant_id, lat, lon, sharable], coupon.onSuccess, coupon.onError);
        });
    },
    
    countCoupon: function () {
       coupon.db.transaction(function (tx) {
            tx.executeSql("SELECT id FROM coupon", [], function (tx, resultSet) {
				//alert(resultSet.rows.length);
				$(".count-coupon").text(resultSet.rows.length);
				var count = $('#list li').size();
				//alert(count);
				$('#total-coupon').text("Total Coupons: "+resultSet.rows.length);
			 }, coupon.onCouponLoadError);
        });
    },

    deleteAllExpires: function () {
		//alert("calling delete expires");
        coupon.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM coupon", [], function (tx, resultSet) {
				
				for (var i = 0; i < resultSet.rows.length; i++) {
					
					row = resultSet.rows.item(i);
						
					var currentdate = new Date(); 
					var d1 =  currentdate.getFullYear() + "-"
							+ (currentdate.getMonth()+1) + "-" 
							+ currentdate.getDate() + " "  
							+ currentdate.getHours() + ":"  
							+ currentdate.getMinutes() + ":" 
							+ currentdate.getSeconds();
					//var d1 = "2011-03-02 15:30:18";
					var d2 = row.expire_time;
					//alert("calling loadCoupons internal callback"+resultSet.rows.length+Date.parse(d2));
					//Date.parse('2011-06-08 11:53:38')
					//alert(Date.parse(d1)+ " : " +Date.parse(d2));
					if (Date.parse(d1) < Date.parse(d2)) {
						//alert('newer');
					}
					else
					{
						//alert(d1+" : "+d2+" : "+row.ID);
						//alert('delete older'+row.ID+"Expire time "+row.expire_time);
						coupon.deleteExpires(row.ID);
					}
					
				}
			 }, coupon.onCouponLoadError);
        });	
    },
    
    deleteExpires: function (id) {
        //alert('Delete item: ' + id);
        coupon.db.transaction(function (tx) {
            tx.executeSql("DELETE FROM coupon WHERE ID=?", [id], function (tx, resultSet) {coupon.countCoupon();}, coupon.onError);
        });
        coupon.countCoupon();
    },

    loadTodoItems: function (tx, rs) {
		console.log("calling loadTodoItems");        

        for (var i = 0; i < rs.rows.length; i++) {
            row = rs.rows.item(i);
            //alert(row.merchant_name + ":" + row.coupon_code + " : " + row.ID);
        }  
    },

    dbError: function (error) {
        console.log('DB Error: ' + JSON.stringify(error));
        //document.getElementById("lblDBError").innerHTML = 'DB ERROR: ' + JSON.stringify(error);
    },

    dbSuccess: function () {
        console.log('DB Operation completed successfully');
        //document.getElementById("lblDBInfo").innerHTML += 'DB Operation completed successfully<br\>';
    },
};
