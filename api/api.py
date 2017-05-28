#!/usr/bin/env python
import json
import subprocess
from flask import Flask, abort, request, jsonify, g, url_for
from flask_cors import CORS, cross_origin
#from flask_mysqldb import MySQL
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.httpauth import HTTPBasicAuth
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)
# initialization
app = Flask(__name__)
#app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy dog'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://phpmyadmin:repcardiff@localhost/repcardiff?/var/run/mysqld/mysqld.sock'
CORS(app)
#app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True

# extensions
db = SQLAlchemy(app)
print "in"
auth = HTTPBasicAuth()

class User(db.Model):
    __tablename__ = 'accounts'
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(64))
    lastname = db.Column(db.String(64))
    password = db.Column(db.String(32))
    email = db.Column(db.String(64))
    mnemonic = db.Column(db.String(255))
    address = db.Column(db.String(64))
    user_type = db.Column(db.String(32))

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self, expiration=600):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None    # valid token, but expired
        except BadSignature:
            return None    # invalid token
        user = User.query.get(data['id'])
        return user


@auth.verify_password
def verify_password(username_or_token, password):
	#first try to authenticate by token
    user = User.verify_auth_token(username_or_token)
    if not user:
        # try to authenticate with username/password
        user = User.query.filter_by(email=username_or_token).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True

#curl -i -X POST -H "Content-Type: application/json" -d '{"firstname":"firsttest","lastname":"lasttest","email":"1267test","password":"passtest", "type":"user"}' http://127.0.0.1:5000/api/users
@app.route('/api/users', methods=['POST'])
def new_user():
    firstname = request.json.get('firstname')
    lastname = request.json.get('lastname')
    email = request.json.get('email')
    password = request.json.get('password')
    userType = request.json.get('type')
    proc = subprocess.Popen('node /var/www/html/main/test.js', stdout=subprocess.PIPE, shell=True)
    tmp = proc.stdout.read().split("#split#")
    address = tmp[0]
    mnemonic = tmp[1]
    print address
    print mnemonic
    #hash = mnemonic.hash
    if email is None or password is None or firstname is None or lastname is None or mnemonic is None or address is None:
        abort(400)    # missing arguments
    if User.query.filter_by(email=email).first() is not None:
        abort(400)    # existing user
    user = User(firstname=firstname,lastname=lastname,password=password,email=email,mnemonic=mnemonic,address=address,user_type=userType)
    user.hash_password(password)
    print "after conn"
    db.session.add(user)
    db.session.commit()
    return (jsonify({'email': user.email}), 200)

@app.route('/api/users/<int:id>')
def get_user(id):
    user = User.query.get(id)
    if not user:
        abort(400)
    return jsonify({'email': user.email})

#curl -i -X GET -H "Content-Type: application/json" -d '{"email":"test@test","password":"test"}' http://127.0.0.1:5000/api/user
@app.route("/api/user", methods=['POST'])
def Authenticate():
    rData = json.loads(request.data)
    email = rData['email']
    password = rData['password']
    #user = db.session.query(User).filter(email=email, password=password)
    #data = db.session.get(user)
    data = db.engine.execute("SELECT * FROM accounts WHERE email='"+str(email)+"' AND password='"+str(password)+"';")
    names = []
    for row in data:
        for x in row:
            names.append(str(x))
    if len(names) == 0:
        return (jsonify("Username or Password is wrong"),401)
    else:
	return (jsonify({"name": names[1], "lastname": names[2], "email": names[3], "password": names[4],"mnemonic": names[5],"address": names[6], "type": names[7]}))

#curl -i -X POST -H "Content-Type: application/json" -d '{"mnemonic":"home poverty easily vocal devote broken clever lion inner mass shell lava","memo":"testAPI3","amount":"6"}' http://127.0.0.1:5000/api/asset
@app.route("/api/asset", methods=['POST'])
def createAsset():
    mnemonic = request.json.get('mnemonic')
    path = request.json.get('path')
    mnemonic = mnemonic.replace(' ', '#')
    print mnemonic
    getCount = subprocess.Popen('node /var/www/html/main/test-get-wallet-count.js /p2pkh/'+ path +'/', stdout=subprocess.PIPE, shell=True)
    assetCount = getCount.stdout.read()
    print assetCount
    memo = request.json.get('memo')
    amount = request.json.get('amount')
    name = request.json.get('name')
    image = request.json.get('image')
    price = request.json.get('price')
    print mnemonic
    print memo
    print amount
    proc = subprocess.Popen('node /var/www/html/main/test-create-asset.js '+ mnemonic +' '+ memo +' '+ amount +' '+ name +' '+ image +' '+ price +' '+ assetCount, stdout=subprocess.PIPE, shell=True)
    return "Success";

#curl -i -X POST -H "Content-Type: application/json" -d '{"mnemonic":"home poverty easily vocal devote broken clever lion inner mass shell lava","memo":"testAPI3","amount":"6"}' http://127.0.0.1:5000/api/asset
@app.route("/api/edit", methods=['POST'])
def editAsset():
    mnemonic = request.json.get('mnemonic')
    path = request.json.get('path')
    mnemonic = mnemonic.replace(' ', '#')
    memo = request.json.get('memo')
    amount = request.json.get('amount')
    name = request.json.get('name')
    image = request.json.get('image')
    price = request.json.get('price')
    assetPath = request.json.get('assetPath')
    print assetPath
    proc = subprocess.Popen('node /var/www/html/main/test-edit-data-asset1.js '+ mnemonic +' '+ memo +' '+ amount +' '+ name +' '+ image +' '+ price + ' ' + assetPath, stdout=subprocess.PIPE, shell=True)
    return "Success";

#curl -i -X POST -H "Content-Type: application/json" -d '{"mnemonic":"home poverty easily vocal devote broken clever lion inner mass shell lava","memo":"testAPI3","amount":"6"}' http://127.0.0.1:5000/api/asset
@app.route("/api/delete", methods=['POST'])
def deleteAsset():
    mnemonic = request.json.get('mnemonic')
    path = request.json.get('path')
    mnemonic = mnemonic.replace(' ', '#')
    memo = request.json.get('memo')
    amount = request.json.get('amount')
    name = request.json.get('name')
    image = request.json.get('image')
    price = request.json.get('price')
    assetPath = request.json.get('assetPath')
    proc = subprocess.Popen('node /var/www/html/main/test-delete-asset.js '+ mnemonic +' '+ memo +' '+ amount +' '+ name +' '+ image +' '+ price + ' ' + assetPath, stdout=subprocess.PIPE, shell=True)
    return "Success";

#curl -i -X POST -H "Content-Type: application/json" -d '{"mnemonic":"home poverty easily vocal devote broken clever lion inner mass shell lava", "destination": "XhKEBUqQo9t4RqZDHPZFVHsbpRrkTSx4BF", "asset":"XgvRSKSHCW6jRQ8reFsYVHTL9nU4owN3GY","amount":"1"}' http://127.0.0.1:5000/api/send
@app.route("/api/send", methods=['POST'])
def sendAsset():
    mnemonic = request.json.get('mnemonic')
    sendTo = request.json.get('destination')
    mnemonic = mnemonic.replace(' ', '#')
    assetAddr = request.json.get('asset')
    amount = request.json.get('amount')
    print mnemonic
    print sendTo
    print assetAddr
    proc = subprocess.Popen('node /var/www/html/main/test-wallet-transaction.js '+ mnemonic +' '+ sendTo +' '+ assetAddr + ' '+ amount, stdout=subprocess.PIPE, shell=True)
    return "Success";

@app.route("/api/wallet", methods=['POST'])
def get_wallet():
    path = "/p2pkh/"+request.json.get('wallet')+"/"
    proc = subprocess.Popen('node /var/www/html/main/test-get-wallet.js '+ path, stdout=subprocess.PIPE, shell=True)
    assets = proc.stdout.read()
    print(assets)
    return assets

@app.route('/api/token')
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token(600)
    return jsonify({'token': token.decode('ascii'), 'duration': 600})

@app.route('/api/clients', methods=['GET'])
def get_clients():
    data = db.engine.execute("SELECT firstname,lastname,mnemonic,address FROM accounts WHERE user_type='client';")
    tempClients = []
    clientJSON = {}
    for row in data:
	print(row)
	print("out")
	clients = []
        for x in row:
	    clients.append(str(x))
	tempClients.append(clients)
    print(tempClients)
    if len(clients) == 0:
        return (jsonify("Couldn't retrieve clients"),401)
    else:
	if(len(tempClients) == 1):
	    clientJSON = {"name": tempClients[0], "lastname": tempClients[1], "mnemonic": tempClients[2], "address": tempClients[3]}
	else:
	    for client in tempClients:
	        print(client)
	        tempJSON = {"name": client[0], "lastname": client[1], "mnemonic": client[2], "address": client[3]}
	        clientJSON.update(tempJSON)
	print(clientJSON)
	return (jsonify(tempClients))
@app.route('/api/resource')
@auth.login_required
def get_resource():
    return jsonify({'data': 'Hello, %s!' % g.user.email})

if __name__ == '__main__':
    app.run(debug=True)
