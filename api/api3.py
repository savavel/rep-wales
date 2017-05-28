#!/usr/bin/env python
import json
import subprocess
import time
import jwt
from flask import Flask, abort, request, jsonify, g, url_for, session, escape
from flask_cors import CORS, cross_origin
#from flask_mysqldb import MySQL
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.httpauth import HTTPBasicAuth
from passlib.apps import custom_app_context as pwd_context

