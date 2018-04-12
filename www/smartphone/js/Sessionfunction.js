function showTable(m,n){
	$.getJSON("https://www.googleapis.com/blogger/v3/blogs/"+gtid+"/pages/"+IDs[m]+"?key=AIzaSyBmT4ZycIuDhq4Bk4aYQGuDynt6ib-u690",function(result){
		tablejson = JSON.parse(result.content);
		var a = 0;
		drawTable(tablejson.Sessions);
		for(key in tablejson.Sessions[0]){
			document.getElementById("TableTitle").innerHTML += '<th onclick="ToMap('+a+');">'+key+'</th>';
			a++;
			//alert(a);
		}
    });
	$.getJSON("https://www.googleapis.com/blogger/v3/blogs/"+gtid+"/pages/"+IDs[n]+"?key=AIzaSyBmT4ZycIuDhq4Bk4aYQGuDynt6ib-u690",function(result){
		mapjson = JSON.parse(result.content);
		//alert(mapjson.Points[0].lat);
		initialize();
		for(var i=0 ; i < mapjson.Points.length ; i++){	
			setJson(mapjson.Points[i].Beacon,mapjson.Points[i].Position,mapjson.Points[i].lat,mapjson.Points[i].lng);
		}
		MapShowALL();
    });
}

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
			row.append($("<td onclick='ToMap("+b+");'>" + tablejson.Sessions[n][key] + "</td>"));
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


function initialize() {
  var initPos = new google.maps.LatLng(mapjson.maps.center.lat,mapjson.maps.center.lng);
  mapCanvas = new google.maps.Map(document.getElementById("map_canvas"), {
    center : initPos,
    zoom : 18,
    mapTypeId : google.maps.MapTypeId.ROADMAP
  });

	var imageBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(mapjson.maps.SW.lat,mapjson.maps.SW.lng),
      new google.maps.LatLng(mapjson.maps.NE.lat,mapjson.maps.NE.lng)
	);

  historicalOverlay = new google.maps.GroundOverlay(mapjson.maps.url,imageBounds);
  addOverlay();
  
}

function placeMarker(h,n,m){
		//var center = mapCanvas.getCenter();
		gooMarker[gooMarker.length]=new google.maps.Marker({
			map:mapCanvas,
			position: n,
			animation: google.maps.Animation.DROP,
			icon: m,
			title:h
		});
		gooInfownd[gooInfownd.length]=new google.maps.InfoWindow({
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
	Maps[Maps.length] = [b,p,la,ln];
}

function hideMarkers(){
    for(var i=0; i<gooMarker.length; i++){
        gooMarker[i].setVisible(false);
    }
}

function MapShowALL(){
	hideMarkers();
	for(var i=0 ; i < Maps.length ; i++){
		if(Maps[i][0]==""){
			//alert("123");
			var MarkerPos = new google.maps.LatLng(Maps[i][2],Maps[i][3]);
			placeMarker(Maps[i][1],MarkerPos,cpic);
			MapKeygoo.push(i);
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
}

function toggleBounce(n,m) {
  if (n.getAnimation() != null){
    n.setAnimation(null);
	m.close();
  }else{
	document.getElementById("theTable").style.display = "none";
	document.getElementById("bButton").style.visibility = "visible";
	document.getElementById("map_canvas").style.visibility = "visible";
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
	document.getElementById("theTable").style.display = "inline";
	document.getElementById("bButton").style.visibility = "hidden";
	document.getElementById("map_canvas").style.visibility = "hidden";
	CuPOS.setMap(null);
}
//var MBG = ['24.1206859,120.6733987','24.1208867,120.6730983','24.120566,120.6732297']
function showPOS(){
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
		CuPOS.setMap(null);
        alert("Your position: " + result.text);
		var Cu = result.text.indexOf(",");
		var CuPOSLaLn = new google.maps.LatLng(result.text.substring(0, Cu),result.text.substring(Cu+1,result.text.length));
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