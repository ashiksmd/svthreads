// ==UserScript==
// @name       SpaceBattles Filter Author Posts
// @version    0.1
// @description  Filter author posts on SB or SV threads
// @include     /^https?://forums\.(spacebattles|sufficientvelocity)\.com/(threads|conversations)/.*$/
// @copyright  2012+, You
// ==/UserScript==

var loadJS = function (src, callback) {
    var fileref = document.createElement('script');
    fileref.setAttribute("type","text/javascript");
    fileref.onload  = callback;
    fileref.setAttribute("src", src);
    
    document.head.appendChild(fileref);
};

loadJS("https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js", function() {
	var hiddenNodes = [];
    
    var authorName = $("#pageDescription a.username").html();
	var container = $("<div></div>");
	var author = $("<input type='text' value='" + authorName + "'/>");
	var hide = $("<button>Hide</button>");
	var showAll = $("<button>Show All</button>");
	
	container.append(author);
	container.append(hide);
	container.append(showAll);
        
	author.css("float", "left");
	hide.css("float", "left");
	showAll.css("float", "left");
	
	container.css("position", "fixed");
	container.css("top", 0);
	container.css("left", 0);
	
	container.css("background-color", "grey");
	container.css("z-index", 100);
	
	////////////////
	
	var showAllPosts = function(e) {
		if(e) e.preventDefault();
		
		for(var i=0; i<hiddenNodes.length; i++) {
			hiddenNodes[i].show();
		}
		
		hiddenNodes = [];
	};
	
	var hidePosts = function(e) {
		showAllPosts(e);
		
		var storyAuthor = author.val();
		$("li.message").each(function() {
			var node = $(this);
			var nodeAuthor = node.data("author");
			if(nodeAuthor !== storyAuthor) {
				hiddenNodes.push(node);
				node.hide();
			}
		});
	};
	
	author.keypress(function(event) {
		var keycode = event.keyCode || event.which;
		if(keycode == '13') {
			hidePosts(event);
		}
	});
	
	hide.click(hidePosts);
	showAll.click(showAllPosts);
	
	$("body").append(container);
	
	hidePosts();	
});

