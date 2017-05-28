var openchain = require("openchain");
var client = new openchain.ApiClient("http://0.0.0.0:8080/");
var assetPath = "/asset/p2pkh/XwYbdSaoNa1fVVaNiWunBq1TgZP8c8BFf7/";
function getDataRecord(assetPath) {
        return client.getDataRecord(assetPath, "asdef");

}
getDataRecord(assetPath).then(function(result){console.log(result);});
