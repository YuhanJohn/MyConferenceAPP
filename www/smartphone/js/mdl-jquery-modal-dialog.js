function showLoading() {
    // remove existing loaders
    $('.loading-container').remove();
    $('<div id="orrsLoader" class="loading-container"><div><div class="mdl-spinner mdl-js-spinner is-active"></div></div></div>').appendTo("body");

    componentHandler.upgradeElements($('.mdl-spinner').get());
    setTimeout(function () {
        $('#orrsLoader').css({opacity: 1});
    }, 1);
}

function hideLoading() {
    $('#orrsLoader').css({opacity: 0});
    setTimeout(function () {
        $('#orrsLoader').remove();
    }, 400);
}
//showdialog 程式的部分都是相同的啟動方式 為null的option只需填入內容就能顯示 ，目前為false的option則需要看下方的條件設定，看是被哪個卡片區塊或訊息顯示所使用，再填入true
function showDialog(options) {
    options = $.extend({
        id: 'orrsDiag',
		bigtitle: null,
        title: null,
        text: null,
		checktitle: null,
		checkrecord:null,
		maptitle: null,
        negative: false,
        positive: false,
        cancelable: true,
        contentStyle: null,
        onLoaded: false,
		urlnewbtn: false, //網址新增按鈕
		qrnewbtn: false, //QR新增按鈕
		inputdialog: false, //網址新增輸入區塊
		downloadprocess: false, //下載進度
		downloadresult: false, //下載完成區域
		personalinfo: false,//個人資料輸入區域
		qrcheckbtn: false,//QR報到按鈕
		nfccheckbtn: false,//NFC報到按鈕
		beacheckbtn: false,//Beacon報到按鈕
		normalcheckrecordbtn: false,//報到返回鑑
		qrmapbtn: false,
		nfcmapbtn: false,
		beamapbtn: false		
    }, options);

    // remove existing dialogs
    $('.dialog-container').remove();
    $(document).unbind("keyup.dialog");

    $('<div id="' + options.id + '" class="dialog-container"><div class="mdl-card mdl-shadow--16dp"><button id="demo-menu-lower-left" class="mdl-button mdl-js-button mdl-button--icon dialog_close"> <i class="material-icons">close</i></button></div></div>').appendTo("body");
    var dialog = $('#orrsDiag');
    var content = dialog.find('.mdl-card');
    if (options.contentStyle != null) content.css(options.contentStyle);
	
	if (options.bigtitle != null) {
        $('<h4 class="bigtitle">' + options.bigtitle + '</h4>').appendTo(content);
    }
	
    if (options.title != null) {
        $('<h5>' + options.title + '</h5>').appendTo(content);
    }
	
    if (options.text != null) {
        $('<p>' + options.text + '</p>').appendTo(content);
    }
	
    if (options.negative || options.positive) {
        var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');
        if (options.negative) {
            options.negative = $.extend({
                id: 'negative',
                title: 'Cancel',
                onClick: function () {
                    return false;
                }
            }, options.negative);
            var negButton = $('<button class="mdl-button mdl-js-button mdl-js-ripple-effect" id="' + options.negative.id + '">' + options.negative.title + '</button>');
            negButton.click(function (e) {
                e.preventDefault();
                if (!options.negative.onClick(e))
                    hideDialog(dialog)
            });
            negButton.appendTo(buttonBar);
        }
        if (options.positive) {
            options.positive = $.extend({
                id: 'positive',
                title: 'OK',
                onClick: function () {
                    return false;
                }
            }, options.positive);
            var posButton = $('<button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" id="' + options.positive.id + '">' + options.positive.title + '</button>');
            posButton.click(function (e) {
                e.preventDefault();
                if (!options.positive.onClick(e))
                    hideDialog(dialog)
            });
            posButton.appendTo(buttonBar);
        }
        buttonBar.appendTo(content);
    }
	
    if (options.cancelable) {
        dialog.click(function () {
            hideDialog(dialog);
        });
        $(document).bind("keyup.dialog", function (e) {
            if (e.which == 27)
                hideDialog(dialog);
        });
        content.click(function (e) {
            e.stopPropagation();
        });
    }
	
	if(options.inputdialog){
		var addform = $('<form action="#"></form>');
		var adddiv = $('<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label text-url-length"></div>');
		var addipt = $('<input class="mdl-textfield__input" type="text" id="text-url">');
		var addlab = $('<label class="mdl-textfield__label" for="text-url">請輸入網址...</label>');
		var addbakbtn = $('<button class="mdl-button mdl-js-button mdl-button--icon"><i class="material-icons" id="back_icon" onclick="show_add_info();">chevron_left</i></button>');
		var addnewbtn = $('<button class="mdl-button mdl-js-button mdl-button--icon"><i class="material-icons" id="send_icon" onclick="GetIDbyURL();">send</i></button>');
		addipt.appendTo(adddiv);
		addlab.appendTo(adddiv);
		addbakbtn.appendTo(addform);
		adddiv.appendTo(addform);
		addnewbtn.appendTo(addform);
		addform.appendTo(content);
		componentHandler.upgradeDom();
		//add_test();
	}
	
	if(options.personalinfo){
		var infoform = $('<form action="#"></form>');
		var infodiv_name = $('<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label text-url-length"></div>');
		var infodiv_comp = $('<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label text-url-length"></div>');
		var infodiv_mail = $('<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label text-url-length"></div>');
		var infoipt_name = $('<input class="mdl-textfield__input" type="text" id="text-name">');
		var infolab_name = $('<label class="mdl-textfield__label" for="text-name">請輸入姓名...</label>');
		var infoipt_comp = $('<input class="mdl-textfield__input" type="text" id="text-comp">');
		var infolab_comp = $('<label class="mdl-textfield__label" for="text-comp">請輸入所屬單位...</label>');
		var infoipt_mail = $('<input class="mdl-textfield__input" type="text" id="text-mail">');
		var infolab_mail = $('<label class="mdl-textfield__label" for="text-mail">請輸入E-mail...</label>');
		var infonewbtn = $('<button class="mdl-button mdl-js-button mdl-button--icon"><i class="material-icons" id="send_icon" onclick="record_personal_info()">send</i></button>');
		infoipt_name.appendTo(infodiv_name);
		infolab_name.appendTo(infodiv_name);
		infoipt_comp.appendTo(infodiv_comp);
		infolab_comp.appendTo(infodiv_comp);
		infoipt_mail.appendTo(infodiv_mail);
		infolab_mail.appendTo(infodiv_mail);
		infodiv_name.appendTo(infoform);
		infodiv_comp.appendTo(infoform);
		infodiv_mail.appendTo(infoform);
		infonewbtn.appendTo(infoform);
		infoform.appendTo(content);
		componentHandler.upgradeDom();
		//add_test();
	}
	
    setTimeout(function () {
        dialog.css({opacity: 1});
        if (options.onLoaded)
            options.onLoaded();
    }, 1);
	
	if (options.urlnewbtn || options.qrnewbtn) {
		var newbuttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');
		if (options.urlnewbtn) {
				options.urlnewbtn = $.extend({
					id: 'urlnewbtn',
					title: '輸入網址',
					onClick: function () {
						return false;
					}
				}, options.urlnewbtn);
				var urlnewButton = $('<button class="mdl-button mdl-button--accent mdl-button--raised mdl-js-button mdl-js-ripple-effect" id="' + options.urlnewbtn.id + '">' + options.urlnewbtn.title + '</button>');
				urlnewButton.click(function (e) {
					e.preventDefault();
					if (!options.urlnewbtn.onClick(e)){
						//alert(options.urlnewbtn.title);
						showDialog({
							title: '新增研討會',
							inputdialog:true
						})
					}
				});
		}//urlnewbtn
		if (options.qrnewbtn) {
				options.qrnewbtn = $.extend({
					id: 'qrnewbtn',
					title: '掃描QRcode',
					onClick: function () {
						return false;
					}
				}, options.qrnewbtn);
				
				var qrnewButton = $('<button class="mdl-button mdl-button--accent mdl-button--raised mdl-js-button mdl-js-ripple-effect" id="' + options.qrnewbtn.id + '">' + options.qrnewbtn.title + '</button>');
				qrnewButton.click(function (e) {
					e.preventDefault();
					if (!options.qrnewbtn.onClick(e))
						scanCodeFBlog();
				});
		}//qrnewbtn
			urlnewButton.appendTo(newbuttonBar);
			qrnewButton.appendTo(newbuttonBar);
			newbuttonBar.appendTo(content);//qrnewbtn
			componentHandler.upgradeDom();
	}
	
	if(options.downloadprocess){
		var loading = $('<div id="p2" class="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>');
		loading.appendTo(content);
		componentHandler.upgradeDom();
	}
	
	if(options.downloadresult){
		var downloadbuttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');
		var backmainButton = $('<button class="mdl-button mdl-button--accent mdl-button--raised mdl-js-button mdl-js-ripple-effect" id="back_to_main" onclick="CDindex();">回首頁</button>');
		backmainButton.appendTo(downloadbuttonBar);
		downloadbuttonBar.appendTo(content);
		componentHandler.upgradeDom();
	}
	
	if (options.qrcheckbtn || options.nfccheckbtn || options.beacheckbtn || options.checktitle != null || options.checkrecord != null) {
		var checkbuttonBar = $('<div class="mdl-card__actions dialog-button-bar checkbuttonBar_me"></div>');
		if (options.qrcheckbtn) {
				options.qrcheckbtn = $.extend({
					id: 'qrcheckbtn',
					title: 'QRcode',
					onClick: function () {
						return false;
					}
				}, options.qrcheckbtn);
				var qrcheckButton = $('<button class="mdl-button mdl-button--accent mdl-button--raised mdl-js-button mdl-js-ripple-effect" id="' + options.qrcheckbtn.id + '"><img src="smartphone/images/ic_qrcode.png"></button>');
				qrcheckButton.click(function (e) {
					e.preventDefault();
					if (!options.qrcheckbtn.onClick(e)){
						//alert(options.qrcheckbtn.title);
						scanCodeFCheck();
						//testname();
					}
				});
		}//qrcheckbtn
		if (options.nfccheckbtn) {
				options.nfccheckbtn = $.extend({
					id: 'nfccheckbtn',
					title: 'NFC',
					onClick: function () {
						return false;
					}
				}, options.nfccheckbtn);
				
				var nfccheckButton = $('<button class="mdl-button mdl-button--accent mdl-button--raised mdl-js-button mdl-js-ripple-effect" id="' + options.nfccheckbtn.id + '"><i class="material-icons">nfc</i></button>');
				nfccheckButton.click(function (e) {
					e.preventDefault();
					if (!options.nfccheckbtn.onClick(e))
						alert(options.nfccheckbtn.title);
				});
		}//nfccheckbtn
		if (options.beacheckbtn) {
				options.beacheckbtn = $.extend({
					id: 'beacheckbtn',
					title: 'iBeacon',
					onClick: function () {
						return false;
					}
				}, options.beacheckbtn);
				
				var beacheckButton = $('<button class="mdl-button mdl-button--accent mdl-button--raised mdl-js-button mdl-js-ripple-effect" id="' + options.beacheckbtn.id + '"><i class="material-icons">bluetooth</i></button>');
				beacheckButton.click(function (e) {
					e.preventDefault();
					if (!options.beacheckbtn.onClick(e))
						save_check_record(check_name,gid);
						//alert(now);
						//gatBname(gid);
				});
		}//beacheckbtn
			$('<h6 class="checktitle">' + options.checktitle + '</h6>').appendTo(checkbuttonBar);
			qrcheckButton.appendTo(checkbuttonBar);
			nfccheckButton.appendTo(checkbuttonBar);
			beacheckButton.appendTo(checkbuttonBar);
			$('<p class="recordtitle">報到紀錄</p><p>' + options.checkrecord + '</p>').appendTo(checkbuttonBar);
			checkbuttonBar.appendTo(content);//qrnewbtn
			componentHandler.upgradeDom();
	}
	
	if (options.normalcheckrecordbtn) {
		options.normalcheckrecordbtn = $.extend({
			id: 'normalcheckrecordbtn',
			title: 'record',
			onClick: function () {
				return false;
			}
		}, options.normalcheckrecordbtn);

		var normalcheckrecordButton = $('<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" id="' + options.normalcheckrecordbtn.id + '"><i class="material-icons">chevron_left</i></button>');
		normalcheckrecordButton.prependTo(content);
		normalcheckrecordButton.click(function (e) {
			e.preventDefault();
			if (!options.normalcheckrecordbtn.onClick(e))
				//alert(options.normalcheckrecordbtn.title);
				castINGcheckin(cid);
		});
	}//normalcheckrecordbtn
	
	if (options.qrmapbtn || options.nfcmapbtn || options.beamapbtn || options.maptitle != null) {
		var mapbuttonBar = $('<div class="mdl-card__actions dialog-button-bar checkbuttonBar_me"></div>');
		if (options.qrmapbtn) {
				options.qrmapbtn = $.extend({
					id: 'qrmapbtn',
					title: 'QRcode',
					onClick: function () {
						return false;
					}
				}, options.qrmapbtn);
				var qrmapButton = $('<button class="mdl-button mdl-button--accent mdl-button--raised mdl-js-button mdl-js-ripple-effect" id="' + options.qrmapbtn.id + '"><img src="smartphone/images/ic_qrcode.png"></button>');
				qrmapButton.click(function (e) {
					e.preventDefault();
					if (!options.qrmapbtn.onClick(e)){
						//alert(options.qrmapbtn.title);
						hideDialog(dialog);//關dialog
						showPOSQR();
						//testname();
					}
				});
		}//qrmapbtn
		if (options.nfcmapbtn) {
				options.nfcmapbtn = $.extend({
					id: 'nfcmapbtn',
					title: 'NFC',
					onClick: function () {
						return false;
					}
				}, options.nfcmapbtn);
				
				var nfcmapButton = $('<button class="mdl-button mdl-button--accent mdl-button--raised mdl-js-button mdl-js-ripple-effect" id="' + options.nfcmapbtn.id + '"><i class="material-icons">nfc</i></button>');
				nfcmapButton.click(function (e) {
					e.preventDefault();
					if (!options.nfcmapbtn.onClick(e))
						alert(options.nfcmapbtn.title);
				});
		}//nfcmapbtn
		if (options.beamapbtn) {
				options.beamapbtn = $.extend({
					id: 'beamapbtn',
					title: 'iBeacon',
					onClick: function () {
						return false;
					}
				}, options.beamapbtn);
				
				var beamapButton = $('<button class="mdl-button mdl-button--accent mdl-button--raised mdl-js-button mdl-js-ripple-effect" id="' + options.beamapbtn.id + '"><i class="material-icons">bluetooth</i></button>');
				beamapButton.click(function (e) {
					e.preventDefault();
					if (!options.beamapbtn.onClick(e)){
						hideDialog(dialog);//關dialog
						showPOS();
						//alert(now);
						//gatBname(gid);
					}	
				});
		}//beamapbtn
			$('<h6 class="maptitle">' + options.maptitle + '</h6>').appendTo(mapbuttonBar);
			qrmapButton.appendTo(mapbuttonBar);
			nfcmapButton.appendTo(mapbuttonBar);
			beamapButton.appendTo(mapbuttonBar);
			mapbuttonBar.appendTo(content);//qrnewbtn
			componentHandler.upgradeDom();
	}
	
	$('.dialog_close').click(function () {
            hideDialog(dialog);//關X
	});
}

	

function hideDialog(dialog) {
    $(document).unbind("keyup.dialog");
    dialog.css({opacity: 0});
    setTimeout(function () {
        dialog.remove();
    }, 400);
}
function test(){
	alert(123);
}
/*
function add_test(){
	var textFieldUpgrades = document.querySelectorAll('.upgradeTextField');
	if(textFieldUpgrades) {
		for(var i=0;i<textFieldUpgrades.length;++i) {
			textFieldUpgrades[i].className = 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label';
		}
	}
	componentHandler.upgradeDom();
}*/