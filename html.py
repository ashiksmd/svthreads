from flask import send_from_directory
from svthreads import app

@app.route('/')
def index():
   return app.send_static_file("index.html")

@app.route('/templates/<template>')
def getTemplate(template):
   return send_from_directory("static/templates/", template)

@app.route('/js/<jsfile>')
def getJS(jsfile):
   return send_from_directory("static/js/", jsfile)

@app.route('/css/<cssfile>')
def getCSS(cssfile):
   return send_from_directory("static/css/", cssfile)
