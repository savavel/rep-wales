var Mnemonic = require("bitcore-mnemonic");
delete global._bitcore
var openchain = require("openchain");
var bitcore = require("bitcore-lib");
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
console.log(codeString);
var memo = process.argv[3];
var amount = parseInt(process.argv[4]);
var name = process.argv[5];
var image = process.argv[6];
var price = process.argv[7];
//var index = parseInt(process.argv[9]);
var path = process.argv[8];
console.log(path);
var negamount = amount*-1;
console.log(negamount);
var code = new Mnemonic(codeString);
// Calculate wallet keys and address
var derivedKey = code.toHDPrivateKey(null, "livenet");
var hdPrivateKey = new bitcore.HDPrivateKey(derivedKey.xprivkey);
var oPrivateKey = hdPrivateKey.derive(44, true).derive(64, true).derive(0, true).derive(0).derive(0);
var address = oPrivateKey.privateKey.toAddress().toString()
// Calculate the assets corresponding to the wallet private key
// assets from 0 to 20 last derive(index) changes
//var derivedAsset = hdPrivateKey.derive(44, true).derive(64, true).derive(1, true).derive(0).derive(index);
//var assetAddr = derivedAsset.privateKey.toAddress().toString()

//var issuancePath = "/asset/p2pkh/" + assetAddr + "/";
var issuancePath = "/asset/p2pkh/" + path + "/";
var assetPath = issuancePath;
var walletPath = "/p2pkh/" + address + "/";
var storedData = '{"name":"'+ name +'","name_short":"'+ memo +'","icon_url":"'+ image +'","price":"'+ price +'", "deleted": "true"}';
var newValue = openchain.encoding.encodeString(storedData);

// create an openchain client and signer
var client = new openchain.ApiClient("http://0.0.0.0:8080/");
var getAssetKey = function (key) {
	return hdPrivateKey.derive(44, true).derive(64, true).derive(1, true).derive(0).derive(key);
};
var findKey = function (searchPath) {
        for (var i = 0; i < 50; i++) {
            if ("/asset/p2pkh/" + getAssetKey(i).privateKey.toAddress().toString() + "/" == searchPath) {
                return getAssetKey(i);
		}
        }

        return getAssetKey(0);
    };
console.log(findKey(path));
var signer = new openchain.MutationSigner(findKey(issuancePath));
// Initialize the client
client.initialize()
.then(function () {
   //console.log();
    // Create a new transaction builder
	return client.getDataRecord(assetPath, "asdef");
	
})
.then(function (dataRecord) {
	return new openchain.TransactionBuilder(client)
	.addSigningKey(signer)
	.addRecord(dataRecord.key, newValue, dataRecord.version)
	.submit();

}).then(function (result) {
	console.log(result); });
