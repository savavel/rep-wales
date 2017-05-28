var Mnemonic = require("bitcore-mnemonic");
delete global._bitcore
var openchain = require("openchain");
var bitcore = require("bitcore-lib");
var client = new openchain.ApiClient("http://0.0.0.0:8080/");
var livenet = bitcore.Networks.get("livenet");
bitcore.Networks.add({
    name: "openchain",
    alias: "Openchain",
    pubkeyhash: 76,
    privatekey: livenet.privatekey,
    scripthash: 78,
    xpubkey: livenet.xpubkey,
    xprivkey: livenet.xprivkey,
    networkMagic: 0,
    port: livenet.port,
    dnsSeeds: livenet.dnsSeeds
});
var codeString = process.argv[2].replace(new RegExp('#', 'g'), ' ');
var destinationAddr = process.argv[3];
var assetAddr = process.argv[4];
var amount = parseInt(process.argv[5]);
var negamount = amount*-1;
var code = new Mnemonic(codeString);
// Calculate wallet keys and address
var derivedKey = code.toHDPrivateKey(null, "livenet");
var hdPrivateKey = new bitcore.HDPrivateKey(derivedKey.xprivkey);
var oPrivateKey = hdPrivateKey.derive(44, true).derive(64, true).derive(0, true).derive(0).derive(0);
var address = oPrivateKey.privateKey.toAddress().toString()

// Calculate the assets corresponding to the wallet private key
// assets from 0 to 20 last derive(index) changes
var issuancePath = "/asset/p2pkh/" + assetAddr + "/";
var assetPath = issuancePath;
var walletPath = "/p2pkh/" + address + "/";

// Create an Openchain client and signer
var signer = new openchain.MutationSigner(oPrivateKey);
function getWalletRecords(walletPath) {
        
	return client.getAccountRecords(walletPath).then(function (result) {
		console.log('in');
        	var dict = [];
		for (var itemKey in result) {
			var asset = result[itemKey];
			console.log(asset.asset);
			if(asset.asset.indexOf(assetAddr) > -1){
				console.log('index');
				console.log(asset);
				asset.version = openchain.ByteBuffer.fromHex(asset.version);
				asset.key = new openchain.RecordKey(asset.account, "ACC", asset.asset).toByteBuffer();
				asset.balance = openchain.Long.fromString(asset.balance);
				dict[0] = asset;
			}
		};
		console.log(dict);
		return dict;
        });
	
}
function initTransaction(assets){
	// Initialize the client
	client.initialize()
	.then(function () {
	    console.log('after initi');
		console.log(assets);
	    // Create a new transaction builder
	    return new openchain.TransactionBuilder(client).addAccountRecord(assets[0], negamount);
	}, function (err) {
	    console.error('error 1');
	})
	.then(function (transactionBuilder) {
	    // Add 100 units of the asset to the target wallet path
		console.log(destinationAddr);
		console.log(assets[0].asset);
	    return transactionBuilder.updateAccountRecord("/p2pkh/"+ destinationAddr +"/", assets[0].asset, amount);
	}, function (err) {
	    console.error('error2');
	})
	.then(function (transactionBuilder) {
	    // Submit the transaction
	    return transactionBuilder.addSigningKey(signer).submit();
	}, function (err) {
	    console.error('error 3');
	})
	.then(function (result) { 
	console.log('last'); 
	console.log(result); });
}

console.log('before');
getWalletRecords(walletPath).then( function(assets){ initTransaction(assets); });
