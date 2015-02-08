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
        console.log('Operation completed successfully');
		//alert('RowsAffected: ' + resultSet.rowsAffected + '; InsertId: ' + resultSet.insertId);
        //coupon.getAllTodoItems(transaction);
    },

    openDatabase: function () {
        var dbSize = 5 * 1024 * 1024; // 5MB
        // open database
        coupon.db = openDatabase("coupon_mgr", "", "coupon manager", dbSize, function() {
            console.log('db successfully opened or created');
        });
    },

    createTable: function () {
        coupon.db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS coupon(ID INTEGER PRIMARY KEY ASC, merchant_name TEXT, coupon_title TEXT, coupon_desc TEXT, coupon_code TEXT, expire_time TEXT)", [],
                coupon.onSuccess, coupon.onError);
        });
    },
    
    getCoupons: function () {    
		//alert("into getCoupons");
		coupon.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM coupon", [], function (tx, resultSet) {
				//alert("calling loadCoupons internal callback"+resultSet.rows.length+" : "+resultSet);
				$("#list").empty();
				for (var i = 0; i < resultSet.rows.length; i++) {					
					row = resultSet.rows.item(i);
					$("#list").append('<li class="ui-li-has-alt" id="coupon_'+row.ID+'"><a id="coupon_link_'+row.ID+'" href="#demo-mail"><h3>'+row.merchant_name+" : "+row.coupon_title+'</h3><p class="topic"><strong>'+row.coupon_code+'</strong></p><p>'+row.coupon_desc+'</p><p class="ui-li-aside"><strong>'+row.expire_time+'</strong></p></a><a href="#" class="delete ui-btn ui-btn-icon-notext ui-icon-delete" title="Delete" delete-id="'+row.ID+'"></a></li>');
					$( "#list" ).listview( "refresh" );
					//alert(row.coupon_title + ":" + row.coupon_desc + " : " + row.ID + " : " + row.expire_time);					
				}
			 }, coupon.onCouponLoadError);
        });	
    },    

    addCoupon: function (merchant_name, coupon_title, coupon_desc, coupon_code, expire_time) {
        coupon.db.transaction(function (tx) {
            var ts = new Date().toUTCString();
            tx.executeSql("INSERT INTO coupon(merchant_name, coupon_title, coupon_desc, coupon_code, expire_time) VALUES (?,?,?,?,?)", [merchant_name, coupon_title, coupon_desc, coupon_code, expire_time], coupon.onSuccess, coupon.onError);
        });
    },    

    deleteAllExpires: function () {
        coupon.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM coupon", [], function (tx, resultSet) {
			  //alert("calling loadCoupons internal callback"+resultSet.rows.length+" : "+resultSet);
				for (var i = 0; i < resultSet.rows.length; i++) {
					
					row = resultSet.rows.item(i);
						
					var currentdate = new Date(); 
					var d1 =  currentdate.getFullYear() + "-"
							+ currentdate.getMonth()+1  + "-" 
							+ currentdate.getDate() + " "  
							+ currentdate.getHours() + ":"  
							+ currentdate.getMinutes() + ":" 
							+ currentdate.getSeconds();
					//var d1 = "2011-03-02 15:30:18";
					var d2 = row.expire_time;

					if (new Date(d1) < new Date(d2)) {
						//alert('newer');
					}
					else
					{
						//alert(d1+" : "+d2);
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
            tx.executeSql("DELETE FROM coupon WHERE ID=?", [id], coupon.onSuccess, coupon.onError);
        });
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
