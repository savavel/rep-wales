var module = angular.module("starter.models", []);


module.service("endpointManager", function ($q, walletSettings) {
    var _this = this;
    this.endpoint = 'http://localhost:5000';

});

module.value("walletSettings", {
    hdKey: null,
    derivedKey: null,
    rootAccount: null,
    mnemonic: "",
    assetData: [],
    clientData: [],
    clientAssetData: [],
    initialized: false,
    versionPrefix: "v2",
    network: null,
    setRootKey: function (key) {
        this.hdKey = key;
        //this.network = key.network;
        //this.derivedKey = key.derive(44, true).derive(64, true).derive(0, true).derive(0).derive(0);
        //this.rootAccount = "/p2pkh/" + this.derivedKey.privateKey.toAddress().toString() + "/";
    },
    setAssets: function(assets) {
	console.log(assets);
	for (var key in assets) {
		this.assetData.push(assets[key]);
	}
	this.initialized = true;
    },
    setClientAssets: function(assets) {
	console.log(assets);
	for (var key in assets) {
		this.clientAssetData.push(assets[key]);
	}
	this.initialized = true;
    },
    setClients: function(clients) {
        for (var key in clients) {
		this.clientData.push(clients[key]);
	}
    },
    getAssetKey: function (index) {
        return this.hdKey;//.derive(44, true).derive(64, true).derive(1, true).derive(0).derive(index);
    }
});


module.factory("AssetData", function ($q) {

    var AssetData = function (assetPath) {
        var _this = this;

        this.asset = assetPath;

        this.setAccountBalance = function (balanceData) {
            this.currentRecord = balanceData;
            //_this.currentRecord.version = ByteBuffer.fromHex(balanceData.version);
            //_this.currentRecord.key = new RecordKey(balanceData.account, "ACC", balanceData.asset).toByteBuffer();
            //_this.currentRecord.balance = Long.fromString(balanceData.balance);
        };

    }

    return AssetData;
});

