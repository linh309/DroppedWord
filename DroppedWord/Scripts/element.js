function ElementAttribute(name, value) {
    this.name = name;
    this.value = value;
}
ElementAttribute.prototype.setAttrForElement = function (element) {
    element.setAttribute(this.name, this.value)
}

function ElementPosition(top, left, width, height) {
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
}
ElementPosition.prototype.setPosition = function (el) {
    var currentStyle = el.getAttribute("style") === null || el.getAttribute("style") === undefined || el.getAttribute("style") === ''
                          ? ''
                          : el.getAttribute("style");

    currentStyle += ' top: ' + this.top + "px; " + "left: " + this.left + "px";
    el.setAttribute("style", currentStyle);
}
