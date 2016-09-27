Filter author posts in forum threads into single html file

There are two parts to the program: the server application, and a browser userscript.

Host the flask application on a server or run svthreads.py for standalone test server.
Make sure the user running the server has permissions to edit the directory books.

Change the directory's group to whatever your server runs as:

    chgrp www books
    
Give the group edit permissions on the directory:

    chmod 775 books
        
Edit userscripts/SVThreads.js and update the value of serverURL and install the file in greasemonkey or tampermonkey.

If you only need the filter author posts feature, you don't need the server component, you can just use the file userscripts/SVFilterAuthorPosts.js instead.
