import subprocess
from flask import Flask, request
from flask.ext.cors import CORS

# Create flask app
app = Flask(__name__, static_url_path="")

# Add CORS headers to allow cross-origin requests
CORS(app)

#Import views
from html import * 
from api import *

# Run server on port 8080
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
