var svthreadsConfig = {};	//For debugging

(function() {
	var filterBy = function(filter) {
		if (!filter) {
			filter = localStorage.getItem("svthreads.config.filterBy"); 
			if (!filter || filter == "null") { filter = "all"; }
		} else {
			localStorage.setItem("svthreads.config.filterBy", filter); 
		}
		
		return filter;
	};
	
	var state = function(s) {
		if (!s) {
			s = localStorage.getItem("svthreads.config.state"); 
			if (!s || s == "null") { s = "reading"; }
		} else {
			localStorage.setItem("svthreads.config.state", s); 
		}
		
		return s;
	};
	
	var lastChapter = function(chapter) {
		if (!chapter) {
			chapter = localStorage.getItem("svthreads.config.lastChapter"); 
			if (chapter == null || chapter == "null") { chapter = 0; }
		} else {
			localStorage.setItem("svthreads.config.lastChapter", chapter); 
		}
		
		return chapter;
	};
	
	svthreadsConfig.filterBy = filterBy;
	svthreadsConfig.state = state;
	svthreadsConfig.lastChapter = lastChapter;
	
	var serverURL = localStorage.getItem("svthreads.serverURL");
	
	var storyAuthor = $("#pageDescription a.username").html();
	var storyTitle = $(".titleBar h1").html();
	
	var hiddenNodes = [];
	var authorPosts = [];
	
	var showAllPosts = function() {
		for(var i=0; i<hiddenNodes.length; i++) {
			hiddenNodes[i].show();
		}

		hiddenNodes = [];
    };

	var findAuthorPosts = function(username, doFilter) {
		//If doFilter is true, show author posts, and hide the rest
		if (doFilter) {
			showAllPosts();
		}
		
		if (!username) {
			username = storyAuthor;
		}
	
		authorPosts = [];
		
		$("li.message").each(function() {
			var nodeAuthor = $(this).data("author");
			if(nodeAuthor !== username) {
				hiddenNodes.push($(this));
				if(doFilter) {
					$(this).hide();
				}
			} else {
				authorPosts.push($(this));
			}
		});
	};
	
	var hidePosts = function(username) {
		findAuthorPosts(username, true);
	};
	
	var onFilterChange = function() {
		var f = filterBy($(this).val());
		
		if(f === "all") {
			showAllPosts();
		} else {
			hidePosts(storyAuthor);
		}
	};
	
	var filter = $("#svthreads-filter-by");
	filter.val(filterBy());
	filter.change(onFilterChange);
	
	//First time
	onFilterChange.call(filter);
	
	///////////////////////
	//Compiling html
	
	var startNewBook = function() {
		state("compiling");
		
		$.ajax({
            url: serverURL + "/start-new-book",
            data: {title: storyTitle, author: storyAuthor},
            success: function (data) {
				if (data === "SUCCESS") {
					lastChapter(0);
					sendAuthorPosts();
				} else {
					alert("Could not create book");
				}
			},
			error: function() {
				alert("Error! Server not available.");
			}
        });
	};
	
	var gotoNextPage = function() {
		var next = $("div.PageNav nav a").last();
		if (next.hasClass("text")) {
			//There is a next page
			console.log("Going to next page: " + next.attr("href"));
			window.location.href = next.attr("href");
		} else if (next.hasClass("currentPage")) {
			//At last page, so stop
			if(state() === "compiling") {
				console.log("Finishing up");
				finishBook();
			}
		} else {
			alert("Problem");
		}
	};
	
	var sendAuthorPosts = function() {
		findNextAuthorPost();
		
		var posts = authorPosts.map(function(p) {
			return p.find("div.messageContent").html();
		});
		
		if (posts && posts.length > 0) {
			$.ajax({
				type: "POST",
				contentType: 'application/json',
				url: serverURL + "/book-content", 
				data: JSON.stringify({ 
					title: storyTitle,
					author: storyAuthor,
					posts: posts,
					lastChapter: lastChapter()
				}),
				success: function (data) {
					lastChapter(data.lastChapter);
					gotoNextPage();
				},
				error: failedToCreateBook
			});
		}
	};
	
	var finishBook = function() {
		state("reading");
		
		$.ajax({
			url: serverURL + "/finish-book",
			data: {title: storyTitle, author: storyAuthor},
			success: function (data) {
				if (data === "SUCCESS") {
					console.log("Done. Go to server");
				} else {
					failedToCreateBook();
				}
			},
			error: failedToCreateBook
		});
	};
	
	var failedToCreateBook = function() {
		state("reading");
		alert("Failed to create book.");
	};
	
	var findNextAuthorPost = function() {
		findAuthorPosts();	//Get a list of author posts
		if (!authorPosts || authorPosts.length == 0) {
			console.log("No posts here, go to next.");
			gotoNextPage();
		}
	};
	
	if (state() === "compiling") {
		sendAuthorPosts();
	}
	
	if (state() === "searching") {
		findNextAuthorPost();
	}
	
	$("#svthreads-start-book").click(startNewBook);
	//$("#svthreads-finish-book").click(finishBook);
	$("#svthreads-next-author-post").click(function() {
		state("searching");
		gotoNextPage();
	});
})();
