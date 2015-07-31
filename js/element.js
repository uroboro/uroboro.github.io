var eFD = elementFromDictionary;
function elementFromDictionary(dict) {
	if (!dict) {
		return undefined;
	}
//elementPrintDescription(dict);

	var type = dict["_type"];
	var obj;
	if (type == "text") {
		return document.createTextNode(dict["text"]);
	} else {
		obj = document.createElement(type);
	}
	
	for (var key in dict) {
		if (key == "_type") {
			continue;
		}
		if (dict[key] == null) {
			continue;
		}
		if (key == "innerHTML") {
			obj.innerHTML = dict[key];
			continue;
		}
		if (key == "children") {
			var d = dict[key];
			for (o in d) {
				obj.appendChild(elementFromDictionary(d[o]));
			}
			continue;
		}
		if (dict[key].constructor == Object) {
			obj.setAttribute(key, elementFromDictionary(dict[key]));
		} else {
			obj.setAttribute(key, dict[key]);
		}
	}
	return obj;
}

function elementAddDictionary(object, dict) {
	if (!object || !dict) {
		return;
	}

	for (var key in dict) {
		object[key] = dict[key];
	}
}

function elementPrintDescription(object) {
	console.log(elementDescription(object));
}

function elementDescription(object) {
	var o = "<null>";
	try {
		object.constructor;
	} catch (e) {
		return "undefined";
	}
	if (object.constructor == Number) {
		o = elementDescriptionForNumber(object);
	}
	if (object.constructor == String) {
		o = elementDescriptionForString(object);
	}
	if (object.constructor == Array) {
		o = elementDescriptionForArray(object);
	}
	if (object.constructor == Object) {
		o = elementDescriptionForObject(object);
	}
	if (object.constructor == Function) {
		o = elementDescriptionForFunction(object);
	}
	return o;
}

function elementDescriptionForNumber(object) {
	var o = object.toString();
	return o;
}

function elementDescriptionForString(object) {
	var o = "\"" + object + "\"";
	return o;
}

function elementDescriptionForArray(object) {
	var o = "[";
	var a = [];
	for (var i in object) {
		var value = object[i];
		a.push(elementDescription(value));
	}
	o += a.join(",");
	o += "]";
	return o;
}

function elementDescriptionForObject(object) {
	var o = "{";
	var a = [];
	for (var key in object) {
		var value = object[key];
		a.push(key + ":" + elementDescription(value));
	}
	o += a.join(",");
	o += "}";
	return o;
}

function elementDescriptionForFunction(object) {
	var o = object;
	return o;
}

function elementRemoveFromParent(object) {
	if (!object) {
		return;
	}

	object.parentNode.removeChild(object);
}
