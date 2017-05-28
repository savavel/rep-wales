var Mnemonic = require("bitcore-mnemonic");
delete global._bitcore
var bitcore = require("bitcore-lib");
//var openchain = require("./openchain.js");
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
var cred = process.argv[2];
//var cred = "home poverty easily vocal devote broken clever lion inner mass shell lava";
var code = new Mnemonic();
var mnemonic = code.toString();
var derivedKey = code.toHDPrivateKey(null, "livenet");
var hdPrivateKey = new bitcore.HDPrivateKey(derivedKey.xprivkey);

var oPrivateKey = hdPrivateKey.derive(44, true).derive(64, true).derive(0, true).derive(0).derive(0);
var hash = oPrivateKey.privateKey.toAddress().toString();
var address = "/p2pkh/" + hash + "/";
// Calculate the accounts corresponding to the private key
var dataPath = "/asset/p2pkh/" + address + "/metadata/";
var recordName = "datarecord";
var storedData = "This is the data to store in the chain";
console.log(hash +'#split#'+ mnemonic);

