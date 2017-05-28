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
//var codeString = process.argv[2].replace(new RegExp('#', 'g'), ' ');
var codeString = "home poverty easily vocal devote broken clever lion inner mass shell lava";
var code = new Mnemonic(codeString);
// Calculate wallet keys and address
var derivedKey = code.toHDPrivateKey(null, "livenet");
var hdPrivateKey = new bitcore.HDPrivateKey(derivedKey.xprivkey);
var oPrivateKey = hdPrivateKey.derive(44, true).derive(64, true).derive(0, true).derive(0).derive(0);
var address = oPrivateKey.privateKey.toAddress().toString()
var assetPath = "/asset/p2pkh/XmxQcCR16g15RUt6UH2VhmJApybEGtczeP/";
var assetKey = new openchain.RecordKey(assetPath, "DATA", "asdef").toByteBuffer();
var assetVersion = "8936cfbad187c255de77ad78d1ce8d0b9f3b563e46f6ab2be3ff6ad7567a7f88";
var findKey = function (assetPath) {
        for (var i = 0; i < 100; i++) {
		console.log("/asset/p2pkh/" + getPrivateKey(hdPrivateKey, i).privateKey.toAddress().toString() + "/");
            if ("/asset/p2pkh/" + getPrivateKey(hdPrivateKey, i).privateKey.toAddress().toString() + "/" == assetPath){
		console.log(i);
		console.log(getPrivateKey(hdPrivateKey, i).privateKey.toAddress().toString());
                return getPrivateKey(hdPrivateKey, i);
		}
        }

        return oPrivateKey;
    };

var getPrivateKey = function (privateKey, index) {
	return privateKey.derive(44, true).derive(64, true).derive(1, true).derive(0).derive(index);
};
console.log(findKey(assetPath));
var signer = new openchain.MutationSigner(findKey(assetPath));
var newData = JSON.stringify({
    name: "NameTest",
    name_short: "TickerTest",
    icon_url: "TestImage"
});
    var newValue = openchain.encoding.encodeString(newData);
	console.log(newValue);
function initTransaction(){                                                       
        // Initialize the client                                                        
        client.initialize()                                                             
        .then(function () {
            console.log('after initi');                                                 
            // Create a new transaction builder
            return new openchain.TransactionBuilder(client).addRecord(assetKey, newValue, assetVersion);
        }, function (err) {                                                             
            console.error('error 1');                                                   
        })                                                                              
        .then(function (transactionBuilder) {                                           
            // Submit the transaction
		console.log('after add');
            return transactionBuilder.addSigningKey(signer)
        }, function (err) {
		console.log('in err');
            console.error('error 3');                                                   
        }).then(function (transactionBuilder) {
		console.log('then');
		console.log(transactionBuilder);
		return transactionBuilder.submit();
	})
        .then(function (result) {                                                       
        console.log('last'); 
        console.log(result); });                                                        
}
initTransaction(); 
