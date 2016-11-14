// ==UserScript==
// @name       SpaceBattles Filter Author Posts
// @version    0.1
// @description  Filter author posts on SB or SV threads
// @include     /^https?://forums\.(spacebattles|sufficientvelocity)\.com/(threads|conversations)/.*$/
// @downloadURL https://raw.githubusercontent.com/ashiksmd/svthreads/master/userscripts/SVThreads.js
// @copyright  2012+, You
// ==/UserScript==

var svthreads = {
    serverURL: "http://ec2-35-163-162-220.us-west-2.compute.amazonaws.com"
};

(function(){
	var serverURL = svthreads.serverURL;
	localStorage.setItem("svthreads.serverURL", serverURL);

    var loadJS = function (src, callback) {
        var fileref = document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.onload  = callback;
        fileref.setAttribute("src", src);

        document.head.appendChild(fileref);
    };

    loadJS("https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js", function() {
        $.ajax({
            url: serverURL + "/templates/UIControls.html",
            success: function (data) { $('body').append(data); },
            dataType: 'html'
        });

        $('head').append('<link rel="stylesheet" href="' + serverURL + '/css/svthreads.css" type="text/css" />');

        $.ajax({
            url: serverURL + "/js/svthreads.js",
            dataType: "script",
            success: function() {}
        });
    });

})();
