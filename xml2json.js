/**
 * Created by Cui Yunhong on 2017/12/18.
 *
 * 用来解析XML文档并转换为JSON的工具 v1.0
 *
 * 使用方式：通过getXmLDocumentByFilePath(xmlFilePath)
 * 或者getXmlDocumentByXmlString(xmlString)获取xml的Document对象，
 * 然后通过调用convertToJSON(xmlDocument)传入xml的Ducument对象
 * 即可得到转换后的json字符串。
 *
 * 适用范围：不含Attribute的任意XML文档
 */

/**
 * 通过传入xml文件路径来解析xml文档
 * @param xmlFilePath xml文档路径，如：files/test.xml
 * @returns xml的Document对象
 */
function getXmlDocumentByFilePath(xmlFilePath) {
    //xmlDocument对象
    var xmlDoc = null;
    //xmlhttp对象
    var xmlhttp = null;
    if (window.XMLHttpRequest) {
        //IE7+, FireFox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        //IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.open("GET", xmlFilePath, false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;
    return xmlDoc;
}

/**
 * 通过传入xml的内容字符串来解析xml
 * @param xmlString xml字符串
 * @returns xml的Document对象
 */
function getXmlDocumentByXmlString(xmlString) {
    var xmlDoc = null;
    if (window.DOMParser) {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(xmlString, "text/xml");
    } else {
        //IE
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlString);
    }
    return xmlDoc;
}

/**
 * 将XML的Document对象转换为JSON字符串
 * @param xmlDoc xml的Document对象
 * @return JSON字符串
 */
function convertToJSON(xmlDoc) {
    //准备JSON字符串和缓存（提升性能）
    var jsonStr = "";
    var buffer = new Array();
    buffer.push("{");
    var nodeList = xmlDoc.childNodes;
    generate(nodeList);

    function generate(node_list) {

        for (var i = 0; i < node_list.length; i++) {
            var curr_node = node_list[i];

            if (curr_node.nodeType == 3) {
                continue;
            }

            if (curr_node.childNodes.length > 1) {
                buffer.push("\"" + curr_node.nodeName + "\": {");
                generate(curr_node.childNodes);
            } else {
                var firstChild = curr_node.childNodes[0];

                if (firstChild != null) {
                    //nodeValue不为null
                    buffer.push("\"" + curr_node.nodeName + "\":\"" + firstChild.nodeValue + "\"");
                } else {
                    //nodeValue为null
                    buffer.push("\"" + curr_node.nodeName + "\":\"\"");
                }

            }
            if (i < (node_list.length - 2)) {
                buffer.push(",");
            } else {
                break;
            }
        }
        //添加"}"
        buffer.push("}");
    }

    jsonStr = buffer.join("");
    return jsonStr;
}
