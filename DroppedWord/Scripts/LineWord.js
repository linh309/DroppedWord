function LineWord(lineId) {
    this.lineId = lineId;
    this.lineWord = [];
    this.currentDroppedPosition = 0;
    this.props = {
        wordsContainerId: "wordsContainer",
        spaceTop: 20
    }
}

LineWord.prototype = {
    isDropAcceptable: function isDropAcceptable(droppedPosition) {
        var firstEmptyPos = 0;
        var lastEmptyPos = 0;
        var isStopFirstEmpty = false;
        var isStopLastEmpty = false;
        var isFirstDrop = false;
        var maxIndex = this.lineWord.length - 1;

        for (var i = 0; i <= maxIndex; i++) {
            if (!isStopFirstEmpty && !this.lineWord[i].isDropped) {
                firstEmptyPos = this.lineWord[i].position;
            }
            else {
                isStopFirstEmpty = true;
            }

            if (!isStopLastEmpty && !this.lineWord[maxIndex - i].isDropped) {
                lastEmptyPos = this.lineWord[maxIndex - i].position;
            }
            else {
                isStopLastEmpty = true;
            }

            var middlePos = Math.ceil((maxIndex + 1) / 2);
            if (middlePos === firstEmptyPos && middlePos === lastEmptyPos) {
                isFirstDrop = true;
                break;
            }
        }

        var isOk = droppedPosition === firstEmptyPos
                || droppedPosition === lastEmptyPos
                || isFirstDrop;

        return isOk;
    },

    dropWordIntoLine: function (droppedPosition, wordElement) {
        //calculate top in new parent element
        var heightWordContainer = document.getElementById(this.props.wordsContainerId);
        var top = heightWordContainer.offsetHeight + this.props.spaceTop + parseInt(wordElement.dataset.top);
        var left = wordElement.dataset.left;

        wordElement.style.top = top + "px";
        wordElement.style.left = left + "px";
        //document.getElementById(this.lineId).appendChild(wordElement);

        //update state
        for (var i = 0; i < this.lineWord.length; i++) {
            if (this.lineWord[i].position === droppedPosition) {
                this.lineWord[i].isDropped = true;
                break;
            }
        }
    },

    dragOver: function (ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    },

    dragEnter: function (event) {
        var position = Game.getCurrentMovedPosition();
        var isDroppable = this.isDropAcceptable(position);
        var color = isDroppable ? " #5cb85c" : "#d9534f";
        event.target.style.background = color;
    },

    drop: function (ev) {
        var position = Game.getCurrentMovedPosition();
        var isDroppable = this.isDropAcceptable(position);
        if (isDroppable) {
            var wordId = ev.dataTransfer.getData("text");
            var wordElement = document.getElementById(wordId);
            this.dropWordIntoLine(position, wordElement);

            if (Game.isFinish()) {
                Game.finishGame();


                //var userName = prompt("Enter your name:");
                //if (userName != null && userName != '') {
                //    var score = Game.numberOfSecondCalculating();
                //    Game.refreshUserList(userName, score);
                //}

                return;
            }
        }

        document.getElementById(this.lineId).style.background = "#FFFFFF";
    },

    initialize: function (line) {
        Utils.addEvent(this.lineId, "drop", this.drop.bind(line));
        Utils.addEvent(this.lineId, "dragover", this.dragOver);
        Utils.addEvent(this.lineId, "dragenter", this.dragEnter.bind(line));
    }
}
