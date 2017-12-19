/**
    * Created by Cui Yunhong on 2017/12/19.
    */
/*
 用于遍历解析xml的方法
 */
/**
 * 遍历Xml
 * @param xmlDoc {Document} xml解析后的Document对象
 * @param callback {function} 回调函数，参数包含：
 * currNode 当前节点对象
 * currNodeValue 当前节点值
 * recursiveLevel 当前遍历的层级，0代表根节点，
 * 1代表根节点的子节点，2代表1的子节点，以此类推
 */
var recursiveLevel = -1;
function traversalXml(xmlDoc, callback) {
    var nodeList = xmlDoc.childNodes;

    //判断callback是否为一个方法
    if (callback || typeof(callback) == "function") {
        recursive(nodeList);
    }

    //判断当前节点为第几级，0代表根节点，
    // 1代表根节点的子节点，2代表1的子节点，以此类推

    recursiveLevel = -1;
    function recursive(nodeList) {

        recursiveLevel += 1;
        for (var i = 0; i < nodeList.length; i++) {
            var currNode = nodeList[i];

            if (currNode.nodeType == 3) {
                continue;
            }

            if (currNode.childNodes.length > 1) {
                recursive(currNode.childNodes);
            } else {
                //获取当前节点的第一个子节点，也就是text文本节点
                var firstChildNode = currNode.firstChild;

                if (firstChildNode != null) { //nodeValue不为null
                    callback(currNode, firstChildNode.nodeValue, recursiveLevel);
                } else { //nodeValue为null
                    callback(currNode, "", recursiveLevel);
                }
            }
        }
    }
}

