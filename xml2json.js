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
 * @param {string} xmlFilePath xml文档路径，如：files/test.xml
 * @returns {Document} xml的Document对象
 * @throws XML Format Error
 */
function getXmlDocumentByFilePath(xmlFilePath) {
    //xmlDocument对象
    var xmlDoc;
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

    //XML校验
    var validateResult = {};
    validateResult.result = false;
    validateResult.message = "";

    if (xmlDoc) {
        validateResult.result = true;
        validateResult.message = "success";
    } else {
        validateResult.message = "XML format error, please check again";
    }

    //if (xmlhttp.readyState == 4) {
    //    if (xmlhttp.status == 200) {
    //
    //
    //    } else {
    //        validateResult.result = false;
    //        validateResult.message = "接收http响应失败";
    //    }
    //} else {
    //    validateResult.result = false;
    //    validateResult.message = "xml请求失败";
    //}


    //if (type == "ie") {
    //    validateResult = validateXMLForIE(xmlDoc);
    //} else if (type == "others") {
    //    validateResult = validateXmlForOthers(xmlDoc);
    //}

    if (validateResult.result) {
        return xmlDoc;
    } else {
        throw "XML format error : " + validateResult.message;
    }
}

/**
 * 通过传入xml的内容字符串来解析xml
 * @param {string} xmlString xml字符串
 * @returns {Document} xml的Document对象
 * @throws XML Format Error
 */
function getXmlDocumentByXmlString(xmlString) {
    var xmlDoc = null;
    var validateResult = null;

    if (window.DOMParser) {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(xmlString, "text/xml");
        validateResult = validateXmlForOthers(xmlDoc);
    } else {
        //IE
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlString);
        validateResult = validateXMLForIE(xmlDoc);
    }

    if (validateResult.result) {
        return xmlDoc;
    } else {
        throw "XML format error :" + validateResult.message;
    }


}

/**
 * 将XML的Document对象转换为JSON字符串
 * @param {Document} xmlDoc xml的Document对象
 * @return {string} JSON string
 */
function convertToJSON(xmlDoc) {
    //准备JSON字符串和缓存（提升性能）
    var jsonStr;
    var buffer = [];

    buffer.push("{");
    //获取xml文档的所有子节点
    var nodeList = xmlDoc.childNodes;

    generate(nodeList);

    /**
     * 中间函数，用于递归解析xml文档对象，并附加到json字符串中
     * @param node_list xml文档的的nodeList
     */
    function generate(node_list) {

        for (var i = 0; i < node_list.length; i++) {
            var curr_node = node_list[i];
            //忽略子节点中的换行和空格
            if (curr_node.nodeType == 3) {
                continue;
            }
            //如果子节点还包括子节点，则继续进行遍历
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
        //添加末尾的"}"
        buffer.push("}");
    }

    jsonStr = buffer.join("");
    return jsonStr;
}
/**
 * 基于IE浏览器的XML格式验证器
 * @param xmlDoc 通过IE浏览器解析的xmlDoc对象
 * @returns {Object} 返回result对象，包含两个字段：(boolean)result, {string}message
 * result代表验证结果，true则为通过验证。
 * message包含错误信息，当验证未通过时返回错误信息，验证通过则为success
 */
function validateXMLForIE(xmlDoc) {

    var result = {};
    result.result = false;
    result.message = null;

    //IE浏览器
    if (xmlDoc.parseError.errorCode != 0) {
        var message = "error code : " + xmlDoc.parseError.errorCode + "\n";
        message += "caused by : " + xmlDoc.parseError.reason + "\n";
        message += "at line : " + xmlDoc.parseError.line + "\n";
        result.result = false;
        result.message = message;
    } else {
        result.result = true;
        result.message = "success";
    }
    return result;
}
/**
 * 基于其他浏览器（不包括IE）的XML格式验证器
 * @param {Document} xmlDoc
 * @returns {result}
 */
function validateXmlForOthers(xmlDoc) {
    var result = {};
    result.result = false;
    result.message = null;

    var error = xmlDoc.getElementsByTagName("parsererror");
    if (error.length > 0) {
        if (xmlDoc.documentElement.nodeName == "parsererror") {
            result.message = xmlDoc.documentElement.childNodes[0].nodeValue;
        } else {
            result.message = xmlDoc.getElementsByTagName("parsererror")[0].innerHTML;
        }
        result.result = false;
    } else {
        result.result = true;
        result.message = "success";
    }
}