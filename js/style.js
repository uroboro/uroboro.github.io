function styleBasicButtonStyle() {
	var style = "";
	style += "";

	// BOX MODEL
	style += "position: fixed;"
	style += "padding: 5px 10px;";
	style += "border-radius: 5px;";
	style += "-webkit-border-radius: 5px;";
	style += "-moz-border-radius: 5px;";
/*
	style += "border-top: 1px solid #cbcbcb;";
	style += "box-shadow: rgba(0,0,0,1) 0 1px 0;";
	style += "-webkit-box-shadow: rgba(0,0,0,1) 0 1px 0;";
	style += "-moz-box-shadow: rgba(0,0,0,1) 0 1px 0;";
*/
	// TEXT
	style += "vertical-align: middle;";
	style += "color: white;";
	style += "font: 13px Helvetica, Arial, Sans-Serif;";
	style += "text-decoration: none;";
	style += "text-shadow: rgba(0,0,0,.4) 0 1px 0;";

	// BACKGROUND
	style += "background: #a4a4a4;";
/*
	background: -webkit-gradient(linear, left top, left bottom, from(#737373), to(#a4a4a4));
	background: -webkit-linear-gradient(top, #737373, #a4a4a4);
	background: -moz-linear-gradient(top, #737373, #a4a4a4);
	background: -ms-linear-gradient(top, #737373, #a4a4a4);
	background: -o-linear-gradient(top, #737373, #a4a4a4);
*/
	return style;
}

function elementSetBackground(id, b) {
	var obj = document.getElementById(id);
	if (obj) {
		obj.style.background = b;
	}
}

function elementSetBorderColor(id, c) {
	var obj = document.getElementById(id);
	if (obj) {
		var border = obj.style.border;
		obj.style.border = [border.split(" ")[0], border.split(" ")[1], c].join(" ");
	}
}
