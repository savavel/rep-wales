angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $log, $http, walletSettings, DashService, ClientService, VenuesService) {
    $scope.data = {};
    $scope.createAccount = function() {
    	$state.go('register');
    }
    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
		ClientService.getClientRecords().then(function() {
			console.log(walletSettings.clientData);
			for(var key in walletSettings.clientData) {
				console.log(walletSettings.clientData[key][3]);
				VenuesService.getAssets(walletSettings.clientData[key][3])
			}
		});
		DashService.getAccountRecords(walletSettings.hdKey).then(function(){
			$state.go('tab.dash');
		});
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: data
            });
        });
    }
})

.controller('RegisterCtrl', function($scope, RegisterService, $ionicPopup, $state, $log, $http, walletSettings) {
    $scope.data = {};
 
    $scope.register = function() {
        RegisterService.registerUser($scope.data.firstname, $scope.data.lastname, $scope.data.username, $scope.data.password).success(function(data) {
            $state.go('login');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Registration failed!',
                template: 'Please check your credentials!'
            });
        });
    }
})
.controller('DashCtrl', function($scope, $q, $timeout, walletSettings, AssetData, endpointManager, DashService, EditAssetService, DeleteAssetService, TransactService, $ionicPopup, $ionicModal) {
	$scope.data = {};
	$scope.balance = [];
	$scope.state = 'loading';
	var endpoint = endpointManager.endpoint;
	$ionicModal.fromTemplateUrl('templates/my-modal.html', {
      		scope: $scope,
      		animation: 'slide-in-up'
   		}).then(function(modal) {
      		$scope.modal = modal;
   	});
	$scope.openModal = function(asset) {
		$scope.info = {}
	      $scope.info.assetName = asset.name;
		$scope.info.assetImage = asset.iconUrl;
		$scope.info.assetNameShort = asset.nameShort;
		$scope.info.assetPath = asset.asset;
		$scope.info.assetBalance = asset.balance;
		$scope.info.assetVersion = asset.version;
		$scope.info.assetPrice = asset.price;
		$scope.info.isDeleted = asset.deleted;
		$scope.modal.show();
	   };
		
	   $scope.closeModal = function() {
	      $scope.modal.hide();
	   };
	$scope.dataModel = {
	    endpoint: endpoint,
	    state: "loading",
	    assets: [],
	    clients: []
	};
	$scope.rawAddress = walletSettings.hdKey;
	$scope.dataModel.clients = walletSettings.clientData;
	$scope.dataModel.assets = walletSettings.assetData;
	$scope.dataModel.state = "loaded";
		
	$scope.createAsset = function() {
		console.log($scope.data.memo);
		console.log($scope.data.amount);
		//CreateAssetService.createAsset($scope.data.memo, $scope.data.amount);
	};
	$scope.editAsset = function() {
		console.log($scope.info.assetPrice);
		//mnemonic +' '+ memo +' '+ amount +' '+ name +' '+ image +' '+ price + ' ' + assetPath
		console.log($scope.info.assetBalance);
		EditAssetService.editAsset($scope.info.assetNameShort, $scope.info.assetBalance, $scope.info.assetName, $scope.info.assetImage, $scope.info.assetPrice, $scope.info.assetPath.replace("/asset/p2pkh/","").replace("/",""));
	};

	$scope.deleteAsset = function() {
		console.log('in');
		DeleteAssetService.deleteAsset($scope.info.assetNameShort, $scope.info.assetBalance, $scope.info.assetName, $scope.info.assetImage, $scope.info.assetPrice, $scope.info.assetPath.replace("/asset/p2pkh/","").replace("/",""));
	};

	$scope.testTransact = function(obj) {
		var dataValue = obj.target.attributes.data.value;
		TransactService.sendTransaction(dataValue, '1').success(function(data) {
        	var alertPopup = $ionicPopup.alert({
                title: 'Transaction success!',
                template: 'Test!'
            });
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Transaction failed!',
                template: 'Test!'
            });
        });
	}
	/*DashService.getAccountRecords(walletSettings.hdKey).then(function(){
		console.log(walletSettings.initialized);
		for (var key in walletSettings.AssetData ){
			dataModel.assets.push(walletSettings.AssetData[key]);
		}
		dataModel.state = 'loaded';
		$scope.balance.push(dataModel.assets);
		$scope.state = dataModel.state;
		console.log('in');
		console.log(walletSettings.assetData.length);
	});*/
	console.log($scope.dataModel.assets);
	console.log(walletSettings.initialized);
	$scope.$on('$destroy', function() {
      $scope.modal.remove();
   });
	$scope.$on('modal.hidden', function() {
      // Execute action
      });
      $scope.$on('modal.removed', function() {
      // Execute action
      });
})

.controller('VenuesCtrl', function($scope, $ionicPopup, walletSettings, VenuesService, $ionicModal, TransactService) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
	$scope.data = {};
	console.log(walletSettings.clientData);
	/*for(var key in walletSettings.clientData) {
		console.log(walletSettings.clientData[key][3]);
		VenuesService.getAssets(walletSettings.clientData[key][3])
	}*/
	
	$scope.dataModel = {
	    state: "loading",
	    assets: [],
	    clients: []
	};
	$ionicModal.fromTemplateUrl('templates/venue-modal.html', {
      		scope: $scope,
      		animation: 'slide-in-up'
   		}).then(function(modal) {
      		$scope.modal = modal;
   	});
	$scope.dataModel.clients = walletSettings.clientData;
	$scope.dataModel.clientAssets = walletSettings.clientAssetData;
	console.log('loaded');
	console.log($scope.dataModel.clientAssets);
	for(var key in $scope.dataModel.clientAssets){
		console.log($scope.dataModel.clientAssets[key]);
	}
	$scope.dataModel.state = "loaded";
	$scope.openModal = function(venue) {
		$scope.info = {}
	      	$scope.info.venueName = venue[0];
		$scope.info.venueLastName = venue[1];
		$scope.info.venueMnemonic = venue[2];
		$scope.info.venuePath = venue[3];
		$scope.modal.show();
	   };
		
	   $scope.closeModal = function() {
	      $scope.modal.hide();
	   };
	$scope.$on('$destroy', function() {
      $scope.modal.remove();
   });
	$scope.$on('modal.hidden', function() {
      // Execute action
      });
      $scope.$on('modal.removed', function() {
      // Execute action
      });
	$scope.buyAsset = function(clientMnemonic, asset) {
		
		TransactService.sendTransaction(clientMnemonic, asset.asset.replace("/asset/p2pkh/","").replace("/",""), '1').success(function(data) {
			var alertPopup = $ionicPopup.alert({
			title: 'Transaction success!',
			template: 'Test!'
			});
		});
	}
  /*$scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };*/
})
  /*$scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };*/

/*.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})
*/
.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
