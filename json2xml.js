/**
 *将JSON转化为XML
 */

function convertJSON2Xml(jsonString) {
    var object = eval(jsonString);
    var node = object.iterateNext();
    console.info(node);
}

var json = "{\n" +
    "\"name\":\"Bill Gates\",\n" +
    "\"street\":\"Fifth Avenue New York 666\",\n" +
    "\"age\":56,\n" +
    "\"phone\":\"555 1234567\"}";

console.info(json);
convertJSON2Xml(json);