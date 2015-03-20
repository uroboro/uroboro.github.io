//console.log(elementDescription(dict));


function folderList() {
	return [
	"Passion_with_Oneesan",
	"Titty_Monster",
	"Helping_Brother",
	"The_Little_Sister_On_My_Lap",
	"[Taropun]Milk_Party!",
	"Aneni_matatabi",
	"Benkyou_Dokoro_Ja",
	"Fits_-_by_Yukimi",
	"If_Big_Sister_is_There",
	"Mahiru_Tei_Kibunha_Yokoso",
	"Necessary",
	"Next_-_Anemone",
	"Spider_Sis",
	"Wanna_Do_It",
	"Your_Smiling_Face",
	"[Bareisho]She_Hates_Losing",
	"[Pannacotta]Effie's_Milk!(Astarotte_no_Omocha!)",
	"[Kogorou]Ruka-san,_in_Danger!",
	"[Mutsuki]Promise",
	"[Ri-ru-]Te_Tsunagi_x_Koi_Tsunagi",
	"[Yamatogawa]Circle_Game",
	"[Zucchini]Soukan_Twins"
	];
}

// Buttons

function buttonWithDictionary(dict) {
	var style = styleBasicButtonStyle();
	style += dict["extraStyle"];
	var div = elementFromDictionary({ _type:"div", id:dict["id"], style:style
	, onclick:dict["onclick"]
	, onmouseover:"elementSetBackground(id, '#565656')"
	, onmouseout:"elementSetBackground(id, '#a4a4a4')"
	, onmousedown:"elementSetBackground(id, '#414141')"
	, onmouseup:"elementSetBackground(id, '#565656')"
	, innerHTML:dict["text"]
	});
	return div;
}

// Images

function loadNext(id) {
	var img = document.getElementById(id);
	if (!img) {
		return;
	}
	img.removeAttribute("onload");
	img.removeAttribute("onerror");

	var n = id.replace("IMG_", "") * 1 + 1;
	var path = img.attributes["path"].value;
	var file = path + "/" + n + ".jpg";

	var nextImg = elementFromDictionary({ _type:"img", id:"IMG_" + n, path:path, src:file
	, alt:file, title:file, "max-width":"1240px"
	, onload:"loadNext(id)", onerror:"imageNotFoundAsJPG(id)" });

	var UI = document.getElementById("UI");
	if (!UI) {
		return;
	}

	UI.appendChild(nextImg);
}

function imageLink(dict) {
	var tag = elementFromDictionary({ _type:"a", id:"ANCHOR_" + dict["path"] + "_" + dict["num"], href:dict["href"] });

	var paths = dict["path"].split("/");
	var folder = paths[paths.length - 1];
	var d = { _type:"img", id:"IMG_" + dict["path"] + "_" + dict["num"], src:dict["path"] + "/" + dict["num"] + ".jpg"
	, alt:folder, title:folder
	, onload:dict["onLoad"] ? dict["onLoad"] : "imageFound(id)", onerror:"imageNotFoundAsJPG(id)" }
	var mw = dict["max-width"];
	if (mw) {
		elementAddDictionary(d, { "max-width":mw });
	} else {
		elementAddDictionary(d, { width:"160px", height:"230px" });
	}
	var img = elementFromDictionary(d);
	tag.appendChild(img);

	return tag;
}

// Interfaces

function interface_unload() {
	var UI = document.getElementById("UI");
	elementRemoveFromParent(UI);
}

function interface1_load() {
	interface_unload();
	setWindowTitle("Index");

	var folders = folderList();
	var UI = elementFromDictionary({ _type:"div", id:"UI" });
	for (var n in folders) {
		var folder = "furious/" + folders[n];
		var a = imageLink({ num:1, href:"javascript:interface2_load(\"" + folder + "\")", path:folder });
		var div = elementFromDictionary({ _type:"div", id:"d_" + folder
			, style:"float:left; margin:10px; border:2px dashed #a4a4a4"
			, onmouseover:"elementSetBorderColor(id, '#565656')"
			, onmouseout:"elementSetBorderColor(id, '#a4a4a4')"
		});
		div.appendChild(a);

		UI.appendChild(div);
	}
	document.body.appendChild(UI);
}

function goback() {
//	window.history.back();
	interface1_load();
}

function interface2_load(path) {
	interface_unload();
	var paths = path.split("/");
	var folder = paths[paths.length - 1];
	setWindowTitle(folder);
//getWindowBaseHref()+
	var newPath = "?path="+encodeURIComponent("furious/"+"/"+folder);
	console.log(newPath);
	console.log(newPath);
//	window.onpopstate = function (event) {interface1_load(); console.log(event.state)};
//	window.history.pushState({a:"a"}, folder, newPath);

	var UI = elementFromDictionary({ _type:"div", id:"UI" });

	var elements = [
		// top button
		buttonWithDictionary({ _type:"div", id:"scroll2topbtn", text:"TOP"
			, onclick:"scrollPageTo(0,0)"
			, extraStyle:" right: 5%; bottom: 1%;"
		 })
		, // bottom button
		buttonWithDictionary({ _type:"div", id:"scroll2endbtn", text:"END"
			, onclick:"scrollPageTo(0,document.body.scrollHeight)"
			, extraStyle:" right: 1%; bottom: 1%;"
		 })
		, // back button
		buttonWithDictionary({ _type:"div", id:"backbtn", text:"BACK"
			, onclick:"goback()"
			, extraStyle:" right: 1%; bottom: 7%;"
		 })
		, // first image
		elementFromDictionary({ _type:"img", id:"IMG_1", path:path, src:path + "/1.jpg"
			, alt:path + "/1.jpg", title:path + "/1.jpg", "max-width":"1240px"
			, onload:"loadNext(id)", onerror:"imageNotFoundAsJPG(id)"
		})
	];
	for (var i in elements) {
		UI.appendChild(elements[i]);
	}
	document.body.appendChild(UI);
}
