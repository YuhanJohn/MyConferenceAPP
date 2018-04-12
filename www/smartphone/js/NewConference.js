
	//儲存部落格簡介和標題
	function addBdata(n){
		//var GBID = $("#text-id").val();
		$.ajax({
			url: "https://www.googleapis.com/blogger/v3/blogs/"+n+"?key=AIzaSyBmT4ZycIuDhq4Bk4aYQGuDynt6ib-u690",//使用blogger api來取得部落格JSON格式資料
			dataType: 'json',
			success: function( result ) {
				//alert( "SUCCESS:  " + result );
				db.transaction(function(tx) {
				
					sql = "CREATE TABLE IF NOT EXISTS BLOG_IDS (GBID, Bname, Bdescription)";//取得blogger id 名稱 簡述
					tx.executeSql(sql, [], function(tx, results){
					
						sql = "INSERT INTO BLOG_IDS (GBID, Bname, Bdescription) VALUES ('"+ n +"','" + result.name + "','" + result.description + "')";
					
						tx.executeSql(sql, [], function(tx, results){
							show_download_result(result.name,result.description);//顯示同步成功訊息
							$("#demo-menu-lower-left").css("display", "none");
							//$("#DLstatus").append('<h3>同步成功</h3>研討會名稱：</br>'+ result.name +'</br></br>研討會簡介：</br>'+ result.description);
							//$("#Test").css("display", "initial");
							//document.getElementById("Test").innerHTML = "<h3>3秒後跳轉首頁</h3>";
							//setTimeout("CDindex()", 3000);
							//$("#DLing").css("display", "none");
						}, null, myTransactionErrorCallback);
					}, myTransactionErrorCallback);
				}, myTransactionErrorCallback);
			},
			error: function( result ) {
				alert("同步資料發生錯誤");
			}
		});

	}
	
	function show_download_result(n,m){//顯示同步成功訊息
		showDialog({
			bigtitle: '同步完成',
            title: n,
			text: m,
			cancelable: false,
			downloadresult:true
        })
	}
	
	var data_lineup = [];
	function define_data(i,t,c,u){//因為同步後資訊不會正確排序 透過這邊來完整排序 並為每個頁面命名
		switch (t) {
			case "HOME":
				data_lineup[0] = [i,t,"首頁",c,u];
				break;
			case "About":
				data_lineup[1] = [i,t,"關於我們",c,u];
				break;
			case "Schedule":
				data_lineup[2] = [i,t,"日程資訊",c,u];
				break;
			case "Transportation":
				data_lineup[3] = [i,t,"交通資訊",c,u];
				break;
			case "Contact":
				data_lineup[4] = [i,t,"聯絡我們",c,u];
				break;
			case "KeynoteSpeech":
				data_lineup[5] = [i,t,"專題演講",c,u];
				break;	
			case "Program":
				data_lineup[6] = [i,t,"日程規劃",c,u];
				break;
			case "Registration":
				data_lineup[7] = [i,t,"報名資訊",c,u];
				break;
			case "TourInformation":
				data_lineup[8] = [i,t,"旅遊資訊",c,u];
				break;
			case "LocalInformation":
				data_lineup[9] = [i,t,"在地資訊",c,u];
				break;
			case "HotelInformation":
				data_lineup[10] = [i,t,"飯店資訊",c,u];
				break;
			case "CallForPaper":
				data_lineup[11] = [i,t,"論文徵稿",c,u];
				break;
			case "CallForWorkshop":
				data_lineup[12] = [i,t,"工作坊徵稿",c,u];
				break;
			case "committee":
				data_lineup[13] = [i,t,"委員會",c,u];
				break;
			case "Exhibitions":
				data_lineup[14] = [i,t,"展場資訊",c,u];
				break;
			case "Sponsors":
				data_lineup[15] = [i,t,"贊助廠商",c,u];
				break;
			case "tablejson":
				data_lineup[16] = [i,t,"tablejson",c,u];
				break;
			case "mapjson":
				data_lineup[17] = [i,t,"mapjson",c,u];
				break;
			case "KEY":
				data_lineup[18] = [i,t,"KEY",c,u];
				break;
			case "officialwebinfo":
				data_lineup[19] = [i,t,"officialwebinfo",c,u];
				break;
		}
	}

	//儲存部落格資料var MBG = ['4267204410839545163','2538500946598083279','327406911123938569','3569454587488745583']
	function GETdata(n){
	show_download_process();//顯示同步進度條
		//$(".main").css("display", "none");//關閉主面板
		//$("#DLstatus").css("display", "initial");//開啟同步狀態區域
		//$("#DLing").css("display", "initial");//開啟同步進度區域
		//$(".contact-form").css("display", "none");
		//var GBID = $("#text-id").val();
		$.ajax({
			url: "https://www.googleapis.com/blogger/v3/blogs/"+n+"/pages?key=AIzaSyBmT4ZycIuDhq4Bk4aYQGuDynt6ib-u690",
			dataType: 'json',
			success: function( result ) {
				for(var i=0;i<result.items.length;i++){//先用define_data()整理資料排序
					//recordPData(result.items[i].id,result.items[i].title,result.items[i].content,result.items[i].updated,n);
					define_data(result.items[i].id,result.items[i].title,result.items[i].content,result.items[i].updated);
				}
				
				if(result.nextPageToken != undefined){
					GETtoken(n,result.nextPageToken);//取得頁面token 因為部落格一次只能顯示十個頁面的json格式資料 token是用來取得下十個頁面的資料的 但目前的寫法只能取得20筆 因為之前沒時間寫成更通用抱歉了
				}
				else{ //小於10個page 可以不用理會token 就先存進資料庫了
					addpagedata(n);
				}
			},
			error: function( result ) {
				alert("請掃描正確的官網ID");
				CDindex();
			}
		});
	}
	
	function GETtoken(n,m){//取得token
		$.ajax({
			url: "https://www.googleapis.com/blogger/v3/blogs/"+n+"/pages?key=AIzaSyBmT4ZycIuDhq4Bk4aYQGuDynt6ib-u690&pageToken="+m,
			dataType: 'json',
			success: function( result ) {
				for(var i=0;i<result.items.length;i++){
					//recordPData(result.items[i].id,result.items[i].title,result.items[i].content,result.items[i].updated,n);
					define_data(result.items[i].id,result.items[i].title,result.items[i].content,result.items[i].updated);
				}
				//addBdata(n);
				addpagedata(n);//儲存多於十筆的資料
			},
			error: function( result ) {
				alert("同步資料發生錯誤。");
			}
		 });
	}
	
	function addpagedata(n){
		if(data_lineup[19] == undefined){//沒有特徵值頁面
			alert("錯誤的網站，請重新輸入正確的官網網址或ID。");
			show_add_info();
			/*$("#Test").css("display", "initial");
			document.getElementById("Test").innerHTML = "<h3>3秒後跳轉首頁</h3>";
			setTimeout("CDindex()", 3000);
			$("#DLing").css("display", "none");*/
		}else if(atob(data_lineup[19][3])=="itisaeuclresourceweb"){	//正確頁面 開始儲存
			for(var i=0;i<data_lineup.length;i++){
				recordPData(data_lineup[i][0],data_lineup[i][1],data_lineup[i][2],data_lineup[i][3],data_lineup[i][4],n);//儲存每一筆資料
			}
			addBdata(n);
		}else{//有特徵值頁面，但特徵值錯誤
			alert("錯誤的網站，請重新輸入正確的官網網址或ID。");
			show_add_info();
			/*$("#Test").css("display", "initial");
			document.getElementById("Test").innerHTML = "<h3>3秒後跳轉首頁</h3>";
			setTimeout("CDindex()", 3000);
			$("#DLing").css("display", "none");*/
		}
	}
	
	function recordPData(i,et,ct,c,u,Blogid){//et=english title 儲存每一筆資料
		db.transaction(function(tx) {
			sql = "CREATE TABLE IF NOT EXISTS TEST_TABLE3 (PageID, atitle, bcontent, cupdated, BlogID)";
			tx.executeSql(sql, [], function(tx, results){
				sql = "INSERT INTO TEST_TABLE3 (PageID, atitle, bcontent, cupdated, BlogID) VALUES ('"+ i +"','" + ct + "','" + c + "','" + u + "','" + Blogid + "')";
				tx.executeSql(sql, [], function(tx, results){
				}, null, myTransactionErrorCallback);
			}, myTransactionErrorCallback);
		}, myTransactionErrorCallback);
	}
	
	function myTransactionErrorCallback(error){//判斷頁面是否有錯誤字元而造成無法儲存 可以進一步寫成請使用者更改頁面內容
		alert('Oops.  Error was '+error.message+' (Code '+error.code+')');
	}

	function show_download_process(){//顯示同步進度條
		showDialog({
            title: '研討會資料同步中',
			downloadprocess:true
        })
	}
	
	function CDindex(){//回到主畫面
		document.location.href = "index.html";
	}
	
	function GetIDbyURL(){//使用輸入網址來同步部落格內容
	var GBURL = $("#text-url").val();
		$.ajax({
			url: "https://www.googleapis.com/blogger/v3/blogs/byurl?url="+GBURL+"&key=AIzaSyBmT4ZycIuDhq4Bk4aYQGuDynt6ib-u690",
			dataType: 'json',
			success: function( result ) {
				GETdata(result.id);
			},
			error: function( result ) {
				alert( "錯誤的網址:  " + GBURL +",請輸入正確的網址");
				$("#text-url").val("");
			}
		});
	}
	
	var scanCodeFBlog = function() {//使用掃描QRcode來同步部落格內容
    window.plugins.barcodeScanner.scan(
        function(result) {
        alert("研討會ID: " + result.text);
		GETdata(result.text);
    }, function(error) {
        alert("Scan failed: " + error);
    });
	}
	
	function ShowUrl(){
		$(".url").toggle(1000,"linear");
	}