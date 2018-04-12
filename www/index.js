var app = {
	
    initialize: function () {
        this.bind();
		
    },
    bind: function () {
        document.addEventListener('deviceready', this.deviceready, false);
		
    },
    deviceready: function () {
		
		function onNfc(nfcEvent) {

			var tag = nfcEvent.tag;
			var tagId = nfc.bytesToHexString(tag.id);
			 
			//alert("tag內容："+JSON.stringify(tag));
			//alert("ID轉成可讀："+tagId);
			//alert("ID轉成可讀2："+tag.ndefMessage[0].payload);
			var CheckNfc = nfc.bytesToString(tag.ndefMessage[0].payload); 
			//alert(CheckNfc);  
			var GUSID = $("#check-id").val();
			var h = CheckNfc.length;
			var n = CheckNfc.indexOf(",");	
			//alert(CheckNfc.substring(3,n));
			//alert(CheckNfc.substring(n+1,h));
		if(forccheck==1){	
			var MySubmit = "https://docs.google.com/forms/d/"+CheckNfc.substring(3,n)+"/formResponse?entry."+CheckNfc.substring(n+1,h)+"="+GUSID+"&entry.1375730227=1&submit=Submit";	
		$("#formresponse").html(unescape("%3Cscript type='text/javascript' src='" + MySubmit + "'%3E%3C/script%3E"));
		alert("報到成功");
		forccheck++;
		}else {
		
		}
		//document.getElementById("checkmybutton").disabled=true;		
		}

		function win() {
			console.log("Listening for NFC Tags");
		}

		function fail(error) {
			alert("Error adding NFC listener");
		}


		nfc.addNdefListener(onNfc, win, fail);	
	}
}	