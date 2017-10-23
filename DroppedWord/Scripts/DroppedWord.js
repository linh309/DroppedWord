function DroppedWord(word, position) {
    this.word = word;
    this.position = position;
    this.props = {
        parentNode: "wordsContainer",
        lineWordId: "lineContainer",
        startTop: 10,
        startLeft: 10,
        clsName: "dropped-word",
        id: "droppedWord{0}",
        extraSize: 5
    };
    this.wordId = this.props.id.replace("{0}", this.position);
    this.isDropped = false;
}

DroppedWord.prototype = {
    generateCoordinatePosition: function (wordElement, arElement) {
        var container = document.getElementById(this.props.parentNode);
        var randomPos = new ElementPosition(0, 0);

        var maxTop = container.clientHeight;
        var maxLeft = container.clientWidth;

        var wordWidth = wordElement.clientWidth;
        var wordHeight = wordElement.clientHeight;

        while (randomPos.top === 0 || randomPos.left === 0) {
            randomPos = CoordinateUtil.getRandomPosition(maxTop, maxLeft);
            var isCrossBoundaries = CoordinateUtil.isPositionCrossBoundaries(randomPos.top + wordHeight, randomPos.left + wordWidth, maxTop, maxLeft);
            if (!isCrossBoundaries) {
                var isOccupied = CoordinateUtil.positionIsOccupied(
                                    new ElementPosition(randomPos.top, randomPos.left),
                                    new ElementPosition(randomPos.top + wordHeight, randomPos.left + wordWidth),
                                    arElement);
                if (!isOccupied) {
                    return randomPos;
                }
            }

            randomPos.top = 0;
            randomPos.left = 0;
        }

        return randomPos;
    },

    wordDragStart: function (ev) {
        var word = ev.target;
        ev.dataTransfer.setData("text/plain", word.id);
        this.setStyleDrag(word, false);
        Game.setCurrentMovedPosition(this.position);
    },

    wordDragEnd: function (ev) {
        var word = ev.target;
        this.setStyleDrag(word, true);
        ev.dataTransfer.clearData();

        document.getElementById("lineContainer").style.background = "#FFF";
        Game.setCurrentMovedPosition(0);
    },

    setDraggable: function (wordElement) {
        var wordElement = document.getElementById(this.wordId);
        wordElement.setAttribute("draggable", true);
    },

    setStyleDrag: function (wordElement, isEnd) {
        if (isEnd) {
            wordElement.style.border = "";
            wordElement.style.padding = "0px";
        }
        else {
            wordElement.style.border = "dashed 2px #ccc";
            wordElement.style.padding = "5px";
        }
    },

    getInitialPosition: function (arElement) {
        var totalWidth = 0;
        var left = this.props.startLeft;
        for (var i = 0; i < arElement.length; i++) {
            left += arElement[i].width + 20; //extra spaec
        }
        return new ElementPosition(this.props.startTop, left);
    },

    generateWord: function (arElement) {
        //Set position in line container - real position display on page
        var initialPos = this.getInitialPosition(arElement);
        var parentNode = document.getElementById(this.props.parentNode);
        var attributes = [];

        attributes.push(new ElementAttribute("class", this.props.clsName));
        attributes.push(new ElementAttribute("data-position", this.position));
        attributes.push(new ElementAttribute("id", this.wordId));
        attributes.push(new ElementAttribute("data-top", initialPos.top));
        attributes.push(new ElementAttribute("data-left", initialPos.left));

        var wordElement = Utils.createElement("div", attributes, this.word, parentNode);

        //Add event
        Utils.addEvent(wordElement.id, "dragstart", this.wordDragStart.bind(this));
        Utils.addEvent(wordElement.id, "dragend", this.wordDragEnd.bind(this));

        var elPosition = this.generateCoordinatePosition(wordElement, arElement);
        //Set position in word container - real position display on page
        elPosition.setPosition(wordElement);

        return new ElementPosition(elPosition.top, elPosition.left, wordElement.clientWidth, wordElement.clientHeight);
    }
}
