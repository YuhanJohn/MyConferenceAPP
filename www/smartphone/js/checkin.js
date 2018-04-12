	var gid = "";
	var check_name = "";
	var cid = "";
	function castINGcheckin(n){//建構報到功能畫面
		gid = $(n).attr("data-blogid");//取得部落格ID
		cid = n;
		getKey(gid);
		db.transaction(function(tx) {
			sql = "CREATE TABLE IF NOT EXISTS CHECK_RECORD (Time, Name, BlogID)";
			tx.executeSql(sql, [], function(tx, results){
				sql = "SELECT * FROM CHECK_RECORD WHERE BlogID = '"+gid+"'";//抓到KEY
				tx.executeSql(sql, [], function(tx, results){
				for(var i = results.rows.length-1 ; i >= 0 ; i--){
					check_records += results.rows.item(i).Time + "<br>";			
					//alert(results.rows.item(i).Time + results.rows.item(i).Name);			
				}			
					sql = "CREATE TABLE IF NOT EXISTS PERSONAL_INFO (Name, Company, Mail)";//開啟table讓len能讀取
					tx.executeSql(sql, [], function(tx, results){
						sql = "SELECT * FROM PERSONAL_INFO"; 
						tx.executeSql(sql, [], function(tx, results){
							var len = results.rows.length;
							if(len != 0){
								if(check_records == ""){
									check_records = "無";
								}
								check_name = results.rows.item(0).Name;
								showDialog({
									bigtitle: '報到',
									title: "姓名",
									text: check_name,
									checktitle:"請選擇報到方式",
									qrcheckbtn:true,
									nfccheckbtn:true,
									beacheckbtn:true,
									checkrecord:check_records
								})
								check_records ="";
							}else{
								alert("請先輸入個人資料");//需先輸入個人資料才能報到 因此若個人資料是空白的 會先要求使用者輸入資料
								showDialog({
									title: '我的資料',
									personalinfo: true,
								})
							}
						}, null, myTransactionErrorCallback);
					}, myTransactionErrorCallback);
				}, myTransactionErrorCallback);
			}, myTransactionErrorCallback);
		});
		
		//alert(gid);
		//document.getElementById("Main_Content").innerHTML="";
		//$("#Main_Content").append('<div class="col span_2_of_3"><div class="contact-form"><h3>報到</h3><div><div id="CONname"><span><label id="formresponse">請輸入姓名：</label></span><span><input name="userName" type="text" class="textbox" id="check-id"></span></div></div><div class="button"><span><label id="formresponse">請選擇報到方式</label></span><span><a><img src="smartphone/images/qrcode.png" onclick="scanCodeFCheck();"/></a><a onclick=""><img src="smartphone/images/nfc.png" onclick=""/></a><a onclick=""><img src="smartphone/images/beacon.png" onclick=""/></a></span></div></div></div>');//NFCer();getMeal();
	}
	
	var key = "";
	function getKey(m){//取得報到用DB的 KEY 目前是使用parse.com資料庫
		//alert(m);
		db.transaction(function(tx) {
			sql = "SELECT * FROM TEST_TABLE3 WHERE atitle = 'KEY' AND BlogID = '"+m+"'";//抓到KEY
			// alert(sql);  	/// 偵錯時觀察用
			tx.executeSql(sql, [], function(tx, results){
				key = results.rows.item(0).bcontent.split(",");
			}, myTransactionErrorCallback);
		});
	}
	
	var Bname = "";
	function gatBname(m){//取得研討會名稱
		db.transaction(function(tx) {
			sql = "SELECT Bname FROM BLOG_IDS WHERE GBID = '"+m+"'";//抓到KEY
			// alert(sql);  	/// 偵錯時觀察用
			tx.executeSql(sql, [], function(tx, results){
				Bname = results.rows.item(0).Bname;
			}, myTransactionErrorCallback);
		});
	}
	/*function testname(){
		var GUSID = check_name;
		alert(check_name);
	}*/
	
	var scanCodeFCheck = function() {//透過掃描QRcode進行報到
	//alert("123");
    window.plugins.barcodeScanner.scan(
        function(result) {      
		var GUSID = check_name;//報到者姓名
		var GBID = atob(result.text);//報到識別碼
		var arr = GBID.split(",");
			if(arr[0] == gid){
				Parse.initialize(key[0],key[1]); //parse started 以下為存進資料庫的步驟
				//Parse.initialize(arr[0],arr[1]);//"5k7k5dEyn03eb9W82zrIESMnDgBxJvJfwnzcgnnf", "2X0a5x4e9Gcxj74SWy7bcrvbmCXV0mPUO1jMqEkD"舊版
				var CheckIn = Parse.Object.extend("CheckIn");
				var checkin = new CheckIn();
				
				checkin.set("ID", GUSID);
				//checkin.set(arr[2], "OK");舊版
				checkin.set("Checked", arr[1]);
				checkin.save(null, {
				  success: function(checkin) {
					// Execute any logic that should take place after the object is saved.
					//alert(GUSID +'報到成功');
					save_check_record(check_name,gid);
					$("#check-id").val("");
				  },
				  error: function(checkin, error) {
					// Execute any logic that should take place if the save fails.
					// error is a Parse.Error with an error code and description.
					alert('Failed to create new object, with error code: ' + error.description);
				  }
				});
			}else{
				alert("請點選正確的研討會 !!!");
			}
    }, function(error) {
        alert("Scan failed: " + error);
    });
	}
	
	function save_check_record(m,k){//儲存報到資料
	var now = now = Date().substr(0, 24);/取得時間
		db.transaction(function(tx) {
			sql = "CREATE TABLE IF NOT EXISTS CHECK_RECORD (Time, Name, BlogID)";//儲存報到的時間 報到者姓名 及研討會部落格ID
			tx.executeSql(sql, [], function(tx, results){
				sql = "INSERT INTO CHECK_RECORD (Time, Name, BlogID) VALUES ('"+ now +"','" + m + "','" + k + "')";
				tx.executeSql(sql, [], function(tx, results){
					record_lookup("C"); //為何是C 請見此功能說明
				}, null, myTransactionErrorCallback);
			}, myTransactionErrorCallback);
		}, myTransactionErrorCallback);
	}
	
	var check_records ="";
	function record_lookup(n){//查詢報到紀錄 用blogger id 找出報到紀錄  此參數為N時為查詢報到資訊 為C時則是用作顯示報到成功時的訊息
		gatBname(gid);//找到報到的會議名稱
		db.transaction(function(tx) {
			sql = "SELECT * FROM CHECK_RECORD WHERE BlogID = '"+gid+"'";//抓到KEY
			// alert(sql);  	/// 偵錯時觀察用
			tx.executeSql(sql, [], function(tx, results){
				if(n == "N"){//參數為N
					if(results.rows.length != 0){
						for(var i = results.rows.length-1 ; i >= 0 ; i--){
							check_records += results.rows.item(i).Time + "<br>";
							//alert(results.rows.item(i).Time + results.rows.item(i).Name);
						}
						showDialog({
							bigtitle: Bname,
							title: check_name+'的報到紀錄',
							text: check_records,
							normalcheckrecordbtn: true
						})
						$("#demo-menu-lower-left").css("display", "none");
						check_records ="";
					}else{
						showDialog({
							bigtitle: Bname,
							title: '尚未進行報到',
							normalcheckrecordbtn: true
						})
						$("#demo-menu-lower-left").css("display", "none");
					}
				}else{//參數為C
					for(var i = results.rows.length-2 ; i >= 0 ; i--){
						check_records += results.rows.item(i).Time + "<br>";
						//alert(results.rows.item(i).Time + results.rows.item(i).Name);
					}
					showDialog({
						bigtitle: Bname,
						title: check_name+'剛於'+results.rows.item(results.rows.length-1).Time+'進行報到',
						text: check_records	
					})
					check_records ="";
				}
			}, myTransactionErrorCallback);
		});
	}