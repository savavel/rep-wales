var openchain = require("openchain");
var client = new openchain.ApiClient("http://0.0.0.0:8080/");
var walletPath = process.argv[2];
function getWalletRecords(walletPath) {
        var nCounter = 0;
	return client.getAccountRecords(walletPath).then(function (result) {
		for (var itemKey in result) {
                	nCounter++;
		};
		return nCounter;
        });

}
getWalletRecords(walletPath).then(function(result){console.log(result);});
