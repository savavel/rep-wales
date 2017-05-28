var openchain = require("openchain");
var async = require("async");
var client = new openchain.ApiClient("http://0.0.0.0:8080/");
var walletPath = process.argv[2];

function downloadAssetDefinition(assetPath) {
    return client.getDataRecord(assetPath, "asdef").then(function (result) {
	if (result.value.remaining() == 0) {
	    return { key: result.key, value: null, version: result.version };
	}
	else {
		console.log('return defin');
		console.log(assetPath);
	    return { key: result.key, value: JSON.parse(openchain.encoding.decodeString(result.value)), version: result.version };
	}
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
	for(var itemKey in result) {
		console.log(result[itemKey].asset);
		downloadAssetDefinition(result[itemKey].asset).then(function (definition) {
			if (definition.value != null) {
				console.log(nCount);
				console.log(result[nCount].asset);
				console.log(definition.value.name);
				/*assetData = {
				    name: definition.value.name,
				    nameShort: definition.value.name_short,
				    iconUrl: definition.value.icon_url,
				    path: result[itemKey].asset,
				    key: definition.key,
				    version: definition.version
				};*/
				result[nCount].name = definition.value.name;
				result[nCount].nameShort = definition.value.name_short;
				result[nCount].iconUrl = definition.value.icon_url;
				result[nCount].price = definition.value.price;
				result[nCount].path = result[nCount].asset;
				result[nCount].key = definition.key;
				result[nCount].version = definition.version
				//assetInfo.push(assetData);
				//console.log(assetInfo);
			}
			nCount++;
			if( result.length == nCount)
			{
				console.log(JSON.stringify(result));
			}
		});
	}
	
});
