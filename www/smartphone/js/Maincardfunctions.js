		
//show data			
var IDs = [];
var gtid;
var txt;		
function TEX(n){//目前已不會用到此功能 原為建構初始畫面用
	document.getElementById("Main_Content").innerHTML="";
	gtid = $(n).attr("data-blogid");
		db.transaction(function(tx) {
			// Remember that the db.transaction function call is asynchronous, so it will return immediately but not necessarily call the callbacks.
				sql = "SELECT * FROM BLOG_IDS WHERE GBID ='"+gtid+"'"; 
				
				tx.executeSql(sql, [], function(tx, results){
				$("#Pages_Title").append('<h3 class="knowContent">'+results.rows.item(0).Bname+'</h3>');
				//alert(results.rows.item(0).Bname);
				
					sql = "SELECT * FROM TEST_TABLE3 WHERE BlogID ='"+gtid+"'"; 
					// alert(sql);  	// 偵錯時觀察用
					tx.executeSql(sql, [], function(tx, results){
						// To read the last record by using a callback to capture the results as follows. 
						//alert(results.rows.length);
						for(var i=0;i<=results.rows.length-1;i++){
							if(results.rows.item(i).atitle == "KEY" || results.rows.item(i).atitle == "tablejson" || results.rows.item(i).atitle == "mapjson" || results.rows.item(i).atitle == "officialwebinfo"){
								
							}
							else if(results.rows.item(i).bcontent!=""){
								txt = '<div id="'+results.rows.item(i).PageID+'" class="TEXnam"  onclick="getCon('+i+');">'+results.rows.item(i).atitle+'</div>';
								$("#Pages_Json").append(txt);
								IDs[i] = results.rows.item(i).PageID ;
							}
						}
					}, null);
				});
		});
  }				

  /*function getCon(n){
	document.getElementById("Page_Content").innerHTML="";
	$("#Page_Content").append(IDs[n]);
  }*/
  function getCon(n){//目前已不會用到此功能 舊版的顯示頁面資訊
		db.transaction(function(tx) {
			// Remember that the db.transaction function call is asynchronous, so it will return immediately but not necessarily call the callbacks.
			sql = "SELECT * FROM TEST_TABLE3"; 
			// alert(sql);  	/// 偵錯時觀察用
			tx.executeSql(sql, [], function(tx, results){
				// To read the last record by using a callback to capture the results as follows. 
				var len = results.rows.length;
				// alert(len); /// 偵錯時觀察用 results.rows.item(n).PageID
				for(var i=0;i<results.rows.length;i++){
					if(IDs[n]==results.rows.item(i).PageID){
						document.getElementById("Page_Content").innerHTML="";
						$("#Page_Content").append("<div><div class='button'><a onclick='Pages_Jsonrecover();'>回上一頁</a></div><h4 class='inside_title'>"+results.rows.item(i).atitle+"</h4></br>"+results.rows.item(i).bcontent+"</div></br>");
						$("#Pages_Json").css("display", "none");
					}else{
						
					}
				}
			},null);
		});
	}
	function Pages_Jsonrecover(){
		document.getElementById("Page_Content").innerHTML="";
		$("#Pages_Json").css("display", "initial");
	}
//update data	
	var DLD2=[];//儲存更新時要被拿來比對的研討會訊息資料
	function chanPData(n){//更新的功能 取得逐筆資料的更新時間 在進行比對決定是否更新
	var upda = $(n).attr("data-blogid");
	//alert(upda);
		$.getJSON("https://www.googleapis.com/blogger/v3/blogs/"+upda+"/pages?key=AIzaSyBmT4ZycIuDhq4Bk4aYQGuDynt6ib-u690",function(result){
			for(var j=0;j<result.items.length;j++){
				DLD2[j] = [result.items[j].id,result.items[j].title,result.items[j].content,result.items[j].updated,upda];
				showPData(j);
				//alert("123");
			}
		});
	}
	
		
	var SPDmm=0;
	var SPDnn=0;
	function showPData(n)//更新的功能 根據頁面更新時間判斷是否更新 若更新時間不同就該頁面更新 相同則不更新
	{
		db.transaction(function(tx) {
			// Remember that the db.transaction function call is asynchronous, so it will return immediately but not necessarily call the callbacks.
			sql = "SELECT * FROM TEST_TABLE3 WHERE BlogID ='"+DLD2[n][4]+"' AND PageID='"+DLD2[n][0]+"'";//抓到單筆資料
			// alert(sql);  	/// 偵錯時觀察用
			tx.executeSql(sql, [], function(tx, results){
				// To read the last record by using a callback to capture the results as follows. 
				//抓本機端資料
				//alert(results.rows.item(0).atitle);測試catch data
				var len = results.rows.length;
				// alert(len); /// 偵錯時觀察用
				//抓Page資料
					//alert(DLD2[n][0]);
						if(DLD2[n][3]==results.rows.item(0).cupdated){//判斷更新時間
						SPDmm++;
						}
						else{
							sql = "UPDATE TEST_TABLE3 SET atitle='"+DLD2[n][1]+"', bcontent='"+DLD2[n][2]+"', cupdated='"+DLD2[n][3]+"' WHERE PageID='"+DLD2[n][0]+"' "; 
							//alert(sql);
							//sql = "UPDATE TEST_TABLE3 SET atitle='台南' WHERE PageID='1221894926793710839' "; 
							tx.executeSql(sql, [], function(tx, results){
								//alert("123");
							}, null);
							SPDnn++;
						}
						
						if (SPDnn == 0 && SPDnn+SPDmm == 16) {//顯示更新資訊
							alert(SPDnn+"筆資料需更新");
							SPDnn = 0;
							SPDmm = 0;
						}else if(SPDnn+SPDmm == 16){
							alert(SPDnn+"筆資料已更新");
							SPDnn = 0;
							SPDmm = 0;
						}
			});
		});
	}
	
	
	function DBD(n){//舊版的刪除功能
	//alert("123");
		var dbd = $(n).attr("data-blogid");
		db.transaction(function(tx) {
			// Remember that the db.transaction function call is asynchronous, so it will return immediately but not necessarily call the callbacks.
				//alert(dbd);
					sql = "DELETE FROM BLOG_IDS WHERE GBID ='"+dbd+"'";
					// alert(sql);  	/// 偵錯時觀察用
			tx.executeSql(sql, [], function(tx, results){
					sql = "DELETE FROM TEST_TABLE3 WHERE BlogID ='"+dbd+"'";
					location.reload();
					// alert(sql);  	/// 偵錯時觀察用
					tx.executeSql(sql, [], function(tx, results){
						alert("ID為："+dbd+"的網站資料已刪除");
					}, null);
			});
		});
		//"DELETE FROM TEST_TABLE3 WHERE BlogID ='+dbd+'";
	}
	
	function delete_byid(n) {//刪除部落格資料
		var txt;
		var r = confirm("確定要移除該研討會資料 ?");//先詢問是否刪除 舊版不會問 XD 就這點差別而已
		if (r == true) {
			//alert("You pressed OK!");
			var dbd = $(n).attr("data-blogid");
			db.transaction(function(tx) {
				// Remember that the db.transaction function call is asynchronous, so it will return immediately but not necessarily call the callbacks.
				sql = "DELETE FROM TEST_TABLE3 WHERE BlogID ='"+dbd+"'";
				// alert(sql);  	/// 偵錯時觀察用
				tx.executeSql(sql, [], function(tx, results){
					sql = "SELECT * FROM BLOG_IDS WHERE GBID = '"+dbd+"'";
					 	// 偵錯時觀察用http://azureworkshop.blogspot.tw/
						tx.executeSql(sql, [], function(tx, results){
							txt = results.rows.item(0).Bname;
							//alert(txt); 
							sql = "DELETE FROM BLOG_IDS WHERE GBID ='"+dbd+"'";
							tx.executeSql(sql, [], function(tx, results){
								location.reload();
								alert(txt+"的研討會資料已刪除");
							}, null, myTransactionErrorCallback);
						}, myTransactionErrorCallback);
				}, myTransactionErrorCallback);
			}, myTransactionErrorCallback);
		} else {
			alert("取消移除!");
		}
	}