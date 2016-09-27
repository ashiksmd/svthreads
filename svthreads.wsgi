#!/usr/bin/python

import sys
import os
import logging

logging.basicConfig(stream=sys.stderr)

sys.path.insert(0,"/var/www/svthreads/")
os.chdir("/var/www/svthreads")

from svthreads import app as application
