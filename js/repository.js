function noPackage() {
	return {
		  "name":"PACKAGE"
		, "developer":"DEVELOPER"
		, "twitter":"TWITTERHANDLE"
		, "developerSite":"SITE"
		, "description":[
			  "DESCRIPTION"
		]
		, "changelog":[
			"VERSION","INFORMATION"
		]
	};
}

// Returns a {}'d "Release" file
function parseReleaseFile(file) {
	var release = {};
	var array = file.split("\n");
	var skip = 0;
	for (i in array) {
		if (skip) {
			skip--;
			continue;
		}
		var line = array[i];
		if (!line.length) {
			continue;
		}
		var pair = line.split(":", 2);
		if (pair[0] == "MD5Sum" || pair[0] == "SHA1" || pair[0] == "SHA256") {
			pair[1] = [];
			i++;
			line1 = array[i];
			pair[1].push(line1);
			i++;
			line2 = array[i];
			pair[1].push(line2);
			skip = 2;
		} else {
			pair[1] = pair[1].trim();
		}
		release[pair[0]] = pair[1];
	}
	return release;
}

// Returns a {}'d "Packages" file, keys are package identifiers
function parsePackagesFile(file) {
	var packages = [];
	var array = file.split("\n");
	var pkg = {};
	for (i in array) {
		var line = array[i];
		if (line.length <= 1) {
			if (pkg.Package) {
				packages.push(pkg);
				pkg = {};
			}
			continue;
		}
		var pair = line.split(":", 2);
		pkg[pair[0]] = pair[1].trim();
	}

	var pkgs = {}
	for (i in packages) {
		var pkg = packages[i];
		var pkgID = pkg["Package"];
		if (!pkgs[pkgID]) {
			pkgs[pkgID] = [];
		}
		delete pkg["Package"];
		pkgs[pkgID].push(pkg);
	}

	return pkgs;
}

var debug = 1;

function loaded() {
	new microAjax("Release", releaseFileCallback);
	var query = getQuery();
	switch (query.length) {
	case 0: // Load package list
		loadPackageListUI();
		break;

	case 1: // There's a package ID in the url
		loadPackageUI();
		break;

	default:
		if (query["screenshots"]) {
			loadScreenshotUI();
		}
		if (query["changelog"]) {
			loadChangelogUI();
		}
	}
	viewerCallback();
}

function ff(e){ // no package found, loading dummy
	if (debug) console.log(e);
	updatePage(noPackage());
}

//Repository info on "Release" file
var release = {};
function releaseFileCallback(file) {
	// Using `release` global var
	release = parseReleaseFile(file);
//	if (debug) console.log("release:");
//	if (debug) console.log(release);
//	if (debug) elementPrintDescription(release);
	updateFooter();
	window.document.title = release["Origin"];
}

//Packages list in "Packages" file
var packages = {};
function packagesFileCallback(file) {
	// Using `packages` global var
	packages = parsePackagesFile(file);
//	if (debug) console.log("pkgs:");
//	if (debug) console.log(packages);
//	if (debug) elementPrintDescription(packages);
}

var viewer = {};
function viewerCallback() {
	viewer.__defineGetter__("ios", function () {
		return /iPad|iPhone|iPod/.test( navigator.userAgent );
	});
	viewer.__defineGetter__("cydia", function () {
		return /Cydia/.test( navigator.userAgent );
	});
}

function shareLink(packageID) {
	var beginning = (viewer.ios) ? "cydia://url/" : "";
	var source = "https://cydia.saurik.com/api/share#?source=" + getWindowBaseHref();
	var pkg = "&package=" + packageID;
	return beginning + source + (packageID ? pkg : "");
}

// List UI
function loadPackageListUI() {
	document.body.appendChild(eFD({ _type:"h2", id:"packageListTitle"
		, innerHTML:"Packages"
	}));
	document.body.appendChild(eFD({ _type:"ul", id:"packageList" }));

	// Repository section
	document.body.appendChild(eFD({ _type:"h2"
		, innerHTML:"Repository"
	}));
	document.body.appendChild(eFD({ _type:"ul", id:"repositoryList" }));

	document.body.appendChild(eFD({ _type:"p", id:"repo" }));

	new microAjax("Packages", updatePackageListPage);
}

function updatePackageListPage(file) {
	packagesFileCallback(file);

	window.document.title = release["Origin"];

	// Package list UI
	// Title
	var t = document.getElementById("packageListTitle");
	if (t) {
		t.innerHTML = "Packages";
	}
	// List
	var list = document.getElementById("packageList");
	if (list) {
		for (packageID in packages) {
			list.appendChild(eFD({ _type:"li"
				, children:[
					{ _type:"a", id:packageID, href:"?p=" + packageID
						, innerHTML:packageID
					}
				]
			}));
			getJSON({ url:"depictions/" + packageID + "/description.txt", callback:function(userInfo) {
				document.getElementById(userInfo["packageID"]).innerText = userInfo["name"];
			}});
		};
		var packageID = "com.uroboro.test";
		list.appendChild(eFD({_type:"li"
			, children:[
				{ _type:"a", id:packageID, href:"?p=" + packageID
					, innerHTML:packageID
				}
			]
		}));
		getJSON({ url:"depictions/" + packageID + "/description.txt", callback:function(userInfo) {
			document.getElementById(userInfo["packageID"]).innerText = userInfo["name"];
		}});
	}

	// Repository section
	var repositoryList = document.getElementById("repositoryList");
	if (repositoryList) {
		var keys = ["Origin", "Description", "Version"];
		for (var k in keys) {
			var key = keys[k];
			repositoryList.appendChild(eFD({ _type:"li"
				, children:[
					{ _type:"p"
						  , children:[
								  { _type:"span", style:"color:#007aff", innerHTML:key }
								, { _type:"span", innerHTML:": " + release[key] }
						]
					}
				]
			}));
		}
		repositoryList.appendChild(eFD({ _type:"li"
			, children:[
				{ _type:"a", target:"_blank"
					, href:shareLink()
					, innerHTML:"Add to Cydia"
				}
			]
		}));
	}
}

// Package UI
function loadPackageUI() {
	// Description section
	document.body.appendChild(eFD({ _type:"h2"
		, innerHTML:"Description"
	}));
	document.body.appendChild(eFD({ _type:"ul"
		, children:[
			  { _type:"li", id:"descriptionLink" }
			, { _type:"li", id:"screenshotsLink" }
			, { _type:"li", id:"changelogLink" }
			, { _type:"li", id:"installLink" }
		]
	}));

	// Developer section
	document.body.appendChild(eFD({ _type:"h2"
		, innerHTML:"Developer"
	}));
	document.body.appendChild(eFD({ _type:"ul"
		, children:[
			  { _type:"li", id:"twitter" }
			, { _type:"li", id:"developerSite" }
		]
	}));

	// Comment section
	document.body.appendChild(eFD({ _type:"h2"
		, innerHTML:"Comments"
	}));
	document.body.appendChild(eFD({ _type:"ul", id:"commentList" }));

	document.body.appendChild(eFD({ _type:"p", id:"repo" }));

	var query = getQuery();
	var packageID = query["p"];
	var decodedFile = "depictions/" + packageID + "/description.txt";
	getJSON({ url:decodedFile, callback:updatePackageUI, onfail:ff });
}

function updatePackageUI(userInfo) {
//elementPrintDescription(userInfo);

	var devName = userInfo["developer"];
	var pkgID = userInfo["packageID"];
	var pkgName = userInfo["name"];

	window.document.title = pkgName + " by " + devName;

	// Package UI
	// Description
	var descriptionLink = document.getElementById("descriptionLink");
	if (descriptionLink) {
		var description = userInfo["description"];
		for (d in description) {
			descriptionLink.appendChild(eFD({ _type:"p"
				, innerHTML:description[d]
			}));
		}
	}

	// Screenshots link
	var screenshotsLink = document.getElementById("screenshotsLink");
	if (screenshotsLink) {
		var screenshotCount = userInfo["screenshotCount"];
		if (screenshotCount > 0 ) {
			screenshotsLink.appendChild(eFD({_type:"a", href:"?p=" + pkgID + "&screenshots=1"
				, innerHTML:"Screenshots"
			}));
		} else {
			elementRemoveFromParent(screenshotsLink);
		}
	}

	// Changelog link
	var changelogLink = document.getElementById("changelogLink");
	if (changelogLink) {
		changelogLink.appendChild(eFD({_type:"a", href:"?p=" + pkgID + "&changelog=1"
			, innerHTML:"Changelog"
		}));
	}

	// Install Link
	var installLink = document.getElementById("installLink");
	if (installLink) {
		if (!viewer.cydia) {
			installLink.appendChild(eFD({_type:"a", target:"_blank"
				, href:shareLink(pkgID)
				, innerHTML:"Install"
			}));
		} else {
			elementRemoveFromParent(installLink);
		}
	}

	// Developer info
	// Twitter
	var tw = document.getElementById("twitter");
	if (tw) {
		var twName = userInfo["twitter"];
		tw.appendChild(eFD({ _type:"a", href:"https://twitter.com/" + twName
			, innerHTML:"@" + twName + " on Twitter"
		}));
	}
	// Site
	var site = document.getElementById("developerSite");
	if (site) {
		var devSite = userInfo["developerSite"];
		site.appendChild(eFD({_type:"a", href:devSite
			, innerHTML:devName + "'s page"
		}));
	}

	// Comment section
	var list = document.getElementById("commentList");
	if (list) {
		list.appendChild(eFD({ _type:"li"
			, children:[
				{ _type:"script", id:"echochamber", type:"text/javascript"
					, children:[
					{ _type:"text", text:"var EchoChamber = window.EchoChamber || {};\
(function() {\
	EchoChamber.discussionURL = window.location;\
	var script = document.createElement('script');\
	script.src = 'https://s3.amazonaws.com/echochamberjs/dist/main.js';\
	script.async = true;\
	var entry = document.getElementById('echochamber');\
	entry.parentNode.insertBefore(script, entry);\
})();" }
					]
				}
			]
		}));
	}
}

// Screenshot UI
function loadScreenshotUI() {
	document.body.appendChild(eFD({ _type:"h2", id:"screenshotListTitle"
		, innerHTML:"Screenshots of "
	}));
	document.body.appendChild(eFD({ _type:"ul"
		, children:[
			{ _type:"li", id:"screenshotList" }
		]
	}));
	document.body.appendChild(eFD({ _type:"p", id:"repo" }));

	var query = getQuery();
	var packageID = query["p"];
	var decodedFile = "depictions/" + packageID + "/description.txt";
	getJSON({ url:decodedFile, callback:updateScreenshotUI, onfail:ff });
}

function updateScreenshotUI(userInfo) {
//elementPrintDescription(userInfo);

	var devName = userInfo["developer"];
	var pkgID = userInfo["packageID"];
	var pkgName = userInfo["name"];
	window.document.title = pkgName + " by " + devName;

	// Title
	var title = document.getElementById("screenshotListTitle");
	if (title) {
		title.innerHTML = "Screenshots of " + pkgName;
	}
	// Screenshot list
	var list = document.getElementById("screenshotList");
	if (list) {
		for (var d = 0; d < userInfo["screenshotCount"]; d++) {
			var imgPath = "depictions/" + pkgID + "/screenshots/" + d + ".jpg";
			list.appendChild(eFD({ _type:"p"
				, children:[
					{ _type:"a", href:imgPath
						, children:[
							{ _type:"img", src:imgPath }
						]
					}
				]
			}));
		};
	}
}

// Changelog UI
function loadChangelogUI() {
	document.body.appendChild(eFD({ _type:"h2", id:"changelogListTitle"
		, innerHTML:"Changelog of "
	}));
	document.body.appendChild(eFD({ _type:"ul", id:"changelogList" }));

	document.body.appendChild(eFD({ _type:"p", id:"repo" }));

	var query = getQuery();
	var packageID = query["p"];
	var decodedFile = "depictions/" + packageID + "/description.txt";
	getJSON({ url:decodedFile, callback:updateChangelogUI, onfail:ff });
}

function updateChangelogUI(userInfo) {
//elementPrintDescription(userInfo);

	var devName = userInfo["developer"];
	var pkgID = userInfo["packageID"];
	var pkgName = userInfo["name"];
	window.document.title = pkgName + " by " + devName;

	// Title
	var title = document.getElementById("changelogListTitle");
	if (title) {
		title.innerHTML = "Changelog of " + pkgName;
	}
	// Changelog list
	var list = document.getElementById("changelogList");
	if (list) {
		var b = 1;
		var changelog = userInfo["changelog"];
		for (var i = 0; i < changelog.length; i++) {
			var number = changelog[i];
			i++;
			var text = changelog[i];
			list.appendChild(eFD({ _type:"li"
				, children:[
					{ _type:"p"
						  , children:[
								  { _type:"span", style:"color:#007aff", innerHTML:number }
								, { _type:"p", innerHTML:text }
						]
					}
				]
			}));
		};
	}
}

// Footer UI
function updateFooter() {
	var repo = document.getElementById("repo");
	if (repo) {
		var txt = release["Origin"];
		repo.appendChild(eFD({ _type:"a", target:"_blank"
			, href:getWindowBaseHref()
			, innerHTML:txt
		}));
		repo.appendChild(eFD({ _type:"text", text:" | " }));
		repo.appendChild(eFD({ _type:"a", target:"_blank"
			, href:shareLink()
			, innerHTML:"Add to Cydia"
		}));
	}
}
