var openchain = require("openchain");
var async = require("async");
var client = new openchain.ApiClient("http://0.0.0.0:8080/");
var walletPath = process.argv[2];

function downloadAssetDefinition(assetResult) {
    return client.getDataRecord(assetResult.asset, "asdef").then(function (result) {
	    	var definition = JSON.parse(openchain.encoding.decodeString(result.value));
		assetResult.name = definition.name;
		assetResult.nameShort = definition.name_short;
		assetResult.iconUrl = definition.icon_url;
		assetResult.price = definition.price;
		assetResult.path = assetResult.asset;
		assetResult.key = result.key;
		assetResult.version = result.version;
		assetResult.deleted = definition.deleted;
		return assetResult;
    })
};
function getWalletRecords(walletPath) {
	return client.getAccountRecords(walletPath).then(function (result) {
                var dict = [];
                for (var itemKey in result) {
                        var asset = result[itemKey];
			dict[itemKey] = asset;
                };
                return dict;
        });
}
getWalletRecords(walletPath).then(function(result){
	nCount = 0;
	var finalWallet = [];
	for(var itemKey in result) {
		downloadAssetDefinition(result[itemKey]).then(function (definition) {
			finalWallet.push(definition);
			nCount++;
			if( result.length == nCount)
			{
				console.log(JSON.stringify(finalWallet));
			}
		});
	}
	
});
