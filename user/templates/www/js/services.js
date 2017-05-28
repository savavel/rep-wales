angular.module('starter.services', [])
.service('LoginService', function($q, $http, $log, walletSettings) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
//curl -i -X GET -H "Content-Type: application/json" -d '{"email":"test@test","password":"test"}' http://127.0.0.1:5000/api/user

	$http({
		method : "POST",
		headers : {
			"Content-Type":"application/json"
			},
		url : "http://localhost:5000/api/user",
		data : {
			"email": name,
			"password": pw
			}
	    }).then(function (response) {
                $log.log('success');
		$log.log(response);
		if(response.data.type == 'client')
		{
			$log.log('client')
			deferred.reject('Please use the client dashboard.');
		}
		else {
			walletSettings.setRootKey(response.data.address);
			walletSettings.mnemonic = response.data.mnemonic;
			deferred.resolve('Welcome ' + name + '!');
		}
	    }, function (response) {
		$log.log(response);
                deferred.reject('Please check your credentials.');
	    });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})
.service('RegisterService', function($q, $http, $log, walletSettings) {
    return {
        registerUser: function(firstname, lastname, username, password) {
            var deferred = $q.defer();
            var promise = deferred.promise;
//curl -i -X GET -H "Content-Type: application/json" -d '{"email":"test@test","password":"test"}' http://127.0.0.1:5000/api/user

	$http({
		method : "POST",
		headers : {
			"Content-Type":"application/json"
			},
		url : "http://localhost:5000/api/users",
		data : {
			"firstname" : firstname,
			"lastname" : lastname,
			"email": username,
			"password": password,
			"type":"user"
			}
	    }).then(function (response) {
                $log.log('success');
		$log.log(response);
		deferred.resolve('Welcome ' + name + '!');
	    }, function (response) {
		$log.log('error');
		$log.log(response);
                deferred.reject('Wrong credentials.');
	    });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})
.service('DashService', function($q, $http, $log, walletSettings) {
    return {
        getAccountRecords: function(wallet) {
		
            var deferred = $q.defer();
            var promise = deferred.promise;
//curl -i -X POST -H "Content-Type: application/json" -d '{"wallet":"XpYWv2m7qKBtZNDDCxVL5o52aKbFiABM29"}' http://127.0.0.1:5000/api/wallet
	$http({
		method : "POST",
		headers : {
			"Content-Type":"application/json"
			},
		url : "http://localhost:5000/api/wallet",
		data : {
			"wallet" : wallet,
			}
	    }).then(function (response) {
                $log.log('success');
		$log.log(response);
		walletSettings.setAssets(response.data);
		console.log(walletSettings.assetData);
		deferred.resolve();
	    }, function (response) {
		$log.log('error');
		$log.log(response);
                deferred.reject();
	    });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
	}
    }
})
.service('VenuesService', function($q, $http, $log, walletSettings) {
    return {
        getAssets: function(wallet) {
		
            var deferred = $q.defer();
            var promise = deferred.promise;
//curl -i -X POST -H "Content-Type: application/json" -d '{"wallet":"XpYWv2m7qKBtZNDDCxVL5o52aKbFiABM29"}' http://127.0.0.1:5000/api/wallet
	$http({
		method : "POST",
		headers : {
			"Content-Type":"application/json"
			},
		url : "http://localhost:5000/api/wallet",
		data : {
			"wallet" : wallet,
			}
	    }).then(function (response) {
                $log.log('success');
		$log.log(response);
		walletSettings.setClientAssets(response.data);
		console.log(walletSettings.clientAssetData);
		deferred.resolve();
	    }, function (response) {
		$log.log('error');
		$log.log(response);
                deferred.reject();
	    });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
	}
    }
})
.service('ClientService', function($q, $http, $log, walletSettings) {
    return {
        getClientRecords: function(wallet) {
		
            var deferred = $q.defer();
            var promise = deferred.promise;
//curl -i -X POST -H "Content-Type: application/json" -d '{"wallet":"XpYWv2m7qKBtZNDDCxVL5o52aKbFiABM29"}' http://127.0.0.1:5000/api/wallet
	$http({
		method : "GET",
		headers : {
			"Content-Type":"application/json"
			},
		url : "http://localhost:5000/api/clients",
	    }).then(function (response) {
                $log.log('success');
		$log.log(response);
		walletSettings.setClients(response.data);
		console.log(walletSettings.assetData);
		deferred.resolve();
	    }, function (response) {
		$log.log('error');
		$log.log(response);
                deferred.reject();
	    });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
	}
    }
})
.service('TransactService', function($q, $http, $log, walletSettings) {
    return {
        sendTransaction: function(clientMnemonic, assetPath, amount) {
		
            var deferred = $q.defer();
            var promise = deferred.promise;
	//curl -i -X POST -H "Content-Type: application/json" -d '{"mnemonic":"home poverty easily vocal devote broken clever lion inner mass shell lava", "destination": "XhKEBUqQo9t4RqZDHPZFVHsbpRrkTSx4BF", "asset":"XgvRSKSHCW6jRQ8reFsYVHTL9nU4owN3GY","amount":"1"}' http://127.0.0.1:5000/api/send
	$http({
		method : "POST",
		headers : {
			"Content-Type":"application/json"
			},
		url : "http://localhost:5000/api/send",
		data: {
			"mnemonic": clientMnemonic,
			"destination": walletSettings.hdKey,
			"asset": assetPath,
			"amount": amount
			}
	    }).then(function (response) {
                $log.log('success');
		$log.log(response);
		deferred.resolve();
	    }, function (response) {
		$log.log('error');
		$log.log(response);
                deferred.reject();
	    });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
	}
    }
})
.service('EditAssetService', function($q, $http, $log, walletSettings) {
    return {
	//mnemonic +' '+ memo +' '+ amount +' '+ name +' '+ image +' '+ price + ' ' + assetPath
        editAsset: function(nameShort, amount, name, iconUrl, price, assetPath) {
		
            var deferred = $q.defer();
            var promise = deferred.promise;
	//curl -i -X POST -H "Content-Type: application/json" -d '{"mnemonic":"home poverty easily vocal devote broken clever lion inner mass shell lava","memo":"testAPI3","amount":"6"}' http://127.0.0.1:5000/api/asset
	$http({
		method : "POST",
		headers : {
			"Content-Type":"application/json"
			},
		url : "http://localhost:5000/api/edit",
		data: {
			"mnemonic": "home poverty easily vocal devote broken clever lion inner mass shell lava",
			"path": walletSettings.hdKey,
			"memo": nameShort,
			"amount": amount,
                        "name": name,
                        "image": iconUrl,
                        "price": price,
			"assetPath": assetPath
			}
	    }).then(function (response) {
                $log.log('success');
		$log.log(response);
		deferred.resolve();
	    }, function (response) {
		$log.log('error');
		$log.log(response);
                deferred.reject();
	    });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
	}
    }
})
.service('DeleteAssetService', function($q, $http, $log, walletSettings) {
    return {
	//mnemonic +' '+ memo +' '+ amount +' '+ name +' '+ image +' '+ price + ' ' + assetPath
        deleteAsset: function(nameShort, amount, name, iconUrl, price, assetPath) {
		
            var deferred = $q.defer();
            var promise = deferred.promise;
	//curl -i -X POST -H "Content-Type: application/json" -d '{"mnemonic":"home poverty easily vocal devote broken clever lion inner mass shell lava","memo":"testAPI3","amount":"6"}' http://127.0.0.1:5000/api/asset
	$http({
		method : "POST",
		headers : {
			"Content-Type":"application/json"
			},
		url : "http://localhost:5000/api/delete",
		data: {
			"mnemonic": "home poverty easily vocal devote broken clever lion inner mass shell lava",
			"path": walletSettings.hdKey,
			"memo": nameShort,
			"amount": amount,
                        "name": name,
                        "image": iconUrl,
                        "price": price,
			"assetPath": assetPath
			}
	    }).then(function (response) {
                $log.log('success');
		$log.log(response);
		deferred.resolve();
	    }, function (response) {
		$log.log('error');
		$log.log(response);
                deferred.reject();
	    });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
	}
    }
})
/*.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});*/
