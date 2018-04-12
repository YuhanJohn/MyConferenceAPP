var map = {
	
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
			var CheckNfc = nfc.bytesToString(tag.ndefMessage[0].payload); 
			//alert(CheckNfc);  
			var h = CheckNfc.length;
			document.getElementById("pic").innerHTML='<img src="smartphone/images/'+CheckNfc.substring(3,h)+'.jpg" alt="" />';		
			//alert(CheckNfc.substring(3,h));
			//alert('<img src="smartphone/images/'+CheckNfc.substring(3,h)+'.jpg" alt="" />');
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