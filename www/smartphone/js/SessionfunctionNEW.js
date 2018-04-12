function showTable(k,m,n){ //取得地圖相關資料 並建置議程資訊表格
	$.getJSON("https://www.googleapis.com/blogger/v3/blogs/"+k+"/pages/"+m+"?key=AIzaSyBmT4ZycIuDhq4Bk4aYQGuDynt6ib-u690",function(result){
		tablejson = JSON.parse(result.content);
		var a = 0;
		drawTable(tablejson.Sessions);//建置議程表格
		for(key in tablejson.Sessions[0]){
			document.getElementById("TableTitle").innerHTML += '<th onclick="ToMap('+a+');">'+key+'</th>';//在表格裡加入點選後可以出現地圖的功能
			a++;
			//alert(a);
		}
    });
	$.getJSON("https://www.googleapis.com/blogger/v3/blogs/"+k+"/pages/"+n+"?key=AIzaSyBmT4ZycIuDhq4Bk4aYQGuDynt6ib-u690",function(result){
		mapjson = JSON.parse(result.content);
		//alert(mapjson.Points[0].lat);
		initialize(); //地圖啟動
		for(var i=0 ; i < mapjson.Points.length ; i++){	
			setJson(mapjson.Points[i].Beacon,mapjson.Points[i].Position,mapjson.Points[i].lat,mapjson.Points[i].lng);//設置地圖上的位置圖案 如：水滴
		}
		MapShowALL();//先顯示全部圖案
    });
}
//以下為議程資訊表格
function drawTable(data) {
    for (var i = 0; i < data.length; i++) {
        drawRow(data[i],i);
    }
}

function drawRow(rowData,n) {
    var row = $("<tr />")
    $("#personDataTable").append(row); 
		var b = 0;
		for(key in tablejson.Sessions[n]){
			row.append($("<td onclick='ToMap("+b+");'>" + tablejson.Sessions[n][key] + "</td>"));//在表格裡加入點選後可以出現地圖的功能
			b++;
		}
}

var mapCanvas, geocoder, infoWnd, CuPOS;
var boundsBox, resultMarker;
var MapKey = [];
var MapKeygoo = [];
var Maps = [];
var gooMarker = [];
var gooInfownd = [];
var mapjson ;
var bpic = "smartphone/images/wifi.png";
var cpic = "smartphone/images/bighouse.png";
var Target = "smartphone/images/plus.png";
var CuTarget = "smartphone/images/missile.png";
var arrow = 0;

function initialize() {
  var initPos = new google.maps.LatLng(mapjson.maps.center.lat,mapjson.maps.center.lng);//地圖初始中心位置
  mapCanvas = new google.maps.Map(document.getElementById("map_canvas"), {
    center : initPos,//地圖初始中心位置
    zoom : 18,//縮放程度
    mapTypeId : google.maps.MapTypeId.ROADMAP//地圖樣式 可參照google map api來選擇
  });

	var imageBounds = new google.maps.LatLngBounds(//圖案邊界 用來疊圖時使用
      new google.maps.LatLng(mapjson.maps.SW.lat,mapjson.maps.SW.lng),
      new google.maps.LatLng(mapjson.maps.NE.lat,mapjson.maps.NE.lng)
	);

  historicalOverlay = new google.maps.GroundOverlay(mapjson.maps.url,imageBounds);//疊上地圖的圖案
  addOverlay();
  
}

function placeMarker(h,n,m){//儲存地圖的位置資料(陣列)
		//var center = mapCanvas.getCenter();
		gooMarker[gooMarker.length]=new google.maps.Marker({//在陣列中 儲存地圖資訊
			map:mapCanvas,
			position: n,
			animation: google.maps.Animation.DROP,//水滴動畫
			icon: m,
			title:h
		});
		gooInfownd[gooInfownd.length]=new google.maps.InfoWindow({// info window
			content:h
		}); 
}

function createMarker(opts) {
  var marker = new google.maps.Marker(opts);
  return marker;
}

function addOverlay() {
    historicalOverlay.setMap(mapCanvas);
}

function setJson(b,p,la,ln){//do the array
	Maps[Maps.length] = [b,p,la,ln];//設置地圖上的位置圖案
}

function hideMarkers(){//隱藏位置圖案的方法
    for(var i=0; i<gooMarker.length; i++){
        gooMarker[i].setVisible(false);
    }
}

function MapShowALL(){//顯示所有位置圖案
	hideMarkers();
	for(var i=0 ; i < Maps.length ; i++){
		if(Maps[i][0]==""){//分辨是否為beacon
			//alert("123");
			var MarkerPos = new google.maps.LatLng(Maps[i][2],Maps[i][3]);
			placeMarker(Maps[i][1],MarkerPos,cpic);
			MapKeygoo.push(i);//教室位置陣列順序
		}else{
			var MarkerPos = new google.maps.LatLng(Maps[i][2],Maps[i][3]);
			placeMarker(Maps[i][1],MarkerPos,bpic);
		}		
		//gooInfownd[i].open(null, gooMarker[i]);
		/*google.maps.event.addListener(gooMarker[i], "click", function() {
			alert(Maps[i][1]);
		});*/
	}
}

function ToMap(n){
	var i = MapKeygoo[n-1];
	toggleBounce(gooMarker[i],gooInfownd[i]);
	arrow++;
}

function toggleBounce(n,m) {
  if (n.getAnimation() != null){
    n.setAnimation(null);
	m.close();
  }else{
	document.getElementById("theTable").style.display = "none";
	//document.getElementById("bButton").style.visibility = "visible";
	document.getElementById("map_canvas").style.visibility = "visible";	
	document.getElementById("map-conf").style.visibility = "visible";
    n.setAnimation(google.maps.Animation.BOUNCE);
	//alert(n.getPosition());
	n.getMap().setCenter(n.getPosition());
	m.open(n.getMap(), n);
	MapKey[0]=[n,m]
	//n.getMap().setZoom(19);https://www.googleapis.com/blogger/v3/blogs/4267204410839545163/pages?key=AIzaSyBmT4ZycIuDhq4Bk4aYQGuDynt6ib-u690
  }
}

function show(){
	MapKey[0][0].setAnimation(null);
	MapKey[0][1].close();
	//document.getElementById("bButton").style.visibility = "hidden";
	document.getElementById("theTable").style.display = "inline";
	document.getElementById("map_canvas").style.visibility = "hidden";
	document.getElementById("map-conf").style.visibility = "hidden";
	if(CuPOS != null){
		CuPOS.setMap(null);
	}
}

function show_map_dialog(){
	showDialog({
        title: '路線導引',
        maptitle: '請選擇定位方式',
		qrmapbtn: true,
		nfcmapbtn: true,
		beamapbtn: true			
    })	
}
//var MBG = ['24.1206859,120.6733987','24.1208867,120.6730983','24.120566,120.6732297']
function showPOS(){
	if(CuPOS != null){
		CuPOS.setMap(null);
	}
	var CuPOSLaLn = new google.maps.LatLng(24.120566,120.6732297);//24.1206859,120.6733987
	CuPOS =new google.maps.Marker({
			map:mapCanvas,
			position: CuPOSLaLn,
			animation: google.maps.Animation.DROP,
			icon: CuTarget,
			title:"ME"
	});
}
function showPOSQR(){
	window.plugins.barcodeScanner.scan(
    function(result) {
		if(CuPOS != null){
			CuPOS.setMap(null);
		}
        alert("Your position: " + result.text);
		var GBLaLn = result.text;
		var arrLaLn = GBLaLn.split(",");
		var CuPOSLaLn = new google.maps.LatLng(arrLaLn[0],arrLaLn[1]);
		CuPOS =new google.maps.Marker({
			map:mapCanvas,
			position: CuPOSLaLn,
			animation: google.maps.Animation.DROP,
			icon: CuTarget,
			title:"ME"
		});		
    }, function(error) {
        alert("Scan failed: " + error);
    });
}