function imageFound(id) {
	var img = document.getElementById(id);
	if (!img) {
		return;
	}
console.log("Image " + id + " found at \"" + img.src + "\"");

	img.removeAttribute("onload");
	img.removeAttribute("onerror");
}

function imageNotFound(id) {
	var img = document.getElementById(id);
	if (!img) {
		return;
	}
console.log("Image " + id + " not found at \"" + img.src + "\"");

	img.removeAttribute("onload");
	img.removeAttribute("onerror");
	img.style.visibility = "hidden";

	elementRemoveFromParent(img);
}

function imageNotFoundAsJPG(id) {
	var img = document.getElementById(id);
	if (!img) {
		return;
	}
console.log("Image " + id + " not found as JPG at \"" + img.src + "\"");

	img.setAttribute("src", img.src.replace("jpg", "png"));
	img.setAttribute("onerror", "imageNotFoundAsPNG(id)");
}

function imageNotFoundAsPNG(id) {
	var img = document.getElementById(id);
	if (!img) {
		return;
	}
console.log("Image " + id + " not found as PNG at \"" + img.src + "\"");

	img.setAttribute("src", img.src.replace("png", "gif"));
	img.setAttribute("onerror", "imageNotFoundAsGIF(id)");
}

function imageNotFoundAsGIF(id) {
	var img = document.getElementById(id);
	if (!img) {
		return;
	}
console.log("Image " + id + " not found as GIF at \"" + img.src + "\"");

	img.setAttribute("src", img.src.replace("gif", "bmp"));
	img.setAttribute("onerror", "imageNotFoundAsBMP(id)");
}

function imageNotFoundAsBMP(id) {
	var img = document.getElementById(id);
	if (!img) {
		return;
	}
console.log("Image " + id + " not found as BMP at \"" + img.src + "\"");

	img.setAttribute("src", img.src.replace("gif", "_"));
	img.setAttribute("onerror", "imageNotFound(id)");
}
