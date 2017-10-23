var Utils = (function () {
    function addEvent(id, event, handler) {
        var element = document.getElementById(id);
        element.addEventListener(event, handler);
    }

    function createElement(tag, attributes, innerText, parentNode) {
        var element = document.createElement(tag);
        element.innerText = innerText;

        if (attributes !== undefined) {
            for (var i = 0; i < attributes.length; i++) {
                var attribute = new ElementAttribute(attributes[i].name, attributes[i].value);
                attribute.setAttrForElement(element);
            }
        }

        if (parent !== undefined && parentNode) {
            parentNode.appendChild(element);
        }

        return element;
    }

    function formatTime(ticktack) {
        var secondPerMin = 60;
        var reminder = Math.floor(ticktack / secondPerMin);
        var minutePart = "00";
        var secondPart = "";
        var formatTime = "";

        if (reminder <= 0) {
            secondPart = ("0" + ticktack.toString()).slice(-2);
        }
        else {
            minutePart = ("0" + reminder.toString()).slice(-2);
            var seconds = ticktack - (reminder * secondPerMin);
            secondPart = ("0" + seconds.toString()).slice(-2);
        }

        return minutePart + ":" + secondPart;
    }

    return {
        addEvent: addEvent,
        createElement: createElement,
        formatTime: formatTime
    }
})();
