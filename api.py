from flask import request, jsonify
from svthreads import app
import json
import codecs

@app.route('/start-new-book')
def startBook():
    title = request.args.get("title")
    author = request.args.get("author")
    filename = "books/" + title + " by " + author + ".html"
    
    with open(filename, "w") as f:
        f.write("<html><head><title>" + title + "</title></head>")
        f.write("<body>")
        
    return "SUCCESS"

@app.route('/book-content', methods=['POST'])
def addBookContent():
    content = request.get_json()
    
    posts = content["posts"]
    title = content["title"]
    author = content["author"]
    chapter = int(content["lastChapter"])
    if chapter is None:
        chapter = 0
    
    filename = "books/" + title + " by " + author + ".html"
    
    with open(filename, "a") as f:
        for post in posts:
            chapter += 1
            f.write("<div><div class='chapter'>Chapter " + str(chapter) + "</div>" + post.encode('utf8') + "</div>")
    
    return jsonify(lastChapter=chapter)

@app.route('/finish-book')
def finishBook():
    title = request.args.get("title")
    author = request.args.get("author")
    filename = "books/" + title + " by " + author + ".html"
    
    with open(filename, "a") as f:
        f.write("</body></html>")
        
    return "SUCCESS"
