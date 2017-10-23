function wordAttribute(name, value, type) {
    this.name = name;
    this.value = value;
}

function ElementPosition(top, left) {
    this.top = top;
    this.left = left;
}

function DroppedWord(top, left, width, height) {
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
}

DroppedWord.prototype.isConflictCoordinate = function (newWord, extraVal) {
    //each word will be added extra size to avoid overlapping together
    var neWordLeftMax = newWord.left + newWord.width + extraVal;
    var neWordTopMax = newWord.top + newWord.height + extraVal;

    var currentLeftMax = this.left + this.width + extraVal;
    var currentTopMax = this.top + this.height + extraVal;

    var isNewTopLeftIn = this.left <= newWord.left && newWord.left <= currentLeftMax &&
                        (this.top <= newWord.top && newWord.top <= currentTopMax);

    var isNewTopRightIn = this.left <= neWordLeftMax && neWordLeftMax <= currentLeftMax &&
                        (this.top <= newWord.top && newWord.top <= currentTopMax);

    var isNewBottomLeftIn = this.left <= newWord.left && newWord.left <= currentLeftMax &&
                        (this.top <= neWordTopMax && neWordTopMax <= currentTopMax);

    var isNewBottomRightIn = this.left <= neWordLeftMax && neWordLeftMax <= currentLeftMax &&
                        (this.top <= neWordTopMax && neWordTopMax <= currentTopMax);

    var isTopLeftIn = newWord.left <= this.left && this.left <= neWordLeftMax &&
                        (newWord.top <= this.top && this.top <= neWordTopMax);

    var isTopRightIn = newWord.left <= currentLeftMax && currentLeftMax <= neWordLeftMax &&
                        (newWord.top <= this.top && this.top <= neWordTopMax);

    var isBottomLeftIn = newWord.left <= this.left && this.left <= neWordLeftMax &&
                        (newWord.top <= currentTopMax && currentTopMax <= neWordTopMax);

    var isBottomRightIn = newWord <= currentLeftMax && currentLeftMax <= neWordLeftMax &&
                        (newWord <= currentTopMax && currentTopMax <= neWordTopMax);
    
    return isTopLeftIn || isTopRightIn || isBottomLeftIn || isBottomRightIn
            || isNewTopLeftIn || isNewTopRightIn || isNewBottomLeftIn || isNewBottomRightIn;
}


var Utils = (function () {

    function addEventForClass(clsName, event, handler) {
        var elements = document.getElementsByClassName(clsName);
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            el.addEventListener(event, handler);
        }
    }

    function createElement(tag, attributes, position, innerText) {
        var element = document.createElement(tag);

        if (attributes !== undefined && attributes !== null) {
            for (var i = 0; i < attributes.length; i++) {
                element.setAttribute(attributes[i].name, attributes[i].value);
                element.innerText = innerText;
            }
        }

        //set style
        var currentStyle = element.getAttribute("style") === null
                                || element.getAttribute("style") === undefined
                                || element.getAttribute("style") === ''
                            ? ''
                            : currentStyle;

        if (position !== undefined && position !== null) {
            currentStyle += ' top: ' + position.top + "px; " + "left: " + position.left + "px";
        }

        element.setAttribute("style", currentStyle);

        return element;
    }

    function cloneArray(ar) {
        var clone = new Array();
        for (var i = 0; i < ar.length; i++) {
            clone.push(ar[i]);
        }

        return clone;
    }

    return {
        addEventForClass: addEventForClass,
        createElement: createElement,
        cloneArray: cloneArray
    }
})();


var dropperWord = (function () {
    var params = {
        word: "It's all about the flow",
        wordLength: 0,
        wordsContainer: "wordsContainer",
        seperated: " ",
        startTop: 10,
        startLeft: 10,
        templateAttributes: [
            new wordAttribute("class", "dropped-word"),
            //new wordAttribute("draggable", "true"),
            new wordAttribute("id", "droppedWord{0}"), //should put this attribute in the last of array
        ],
        idTemplate: "droppedWord{0}",
        currentDroppedPosition: 0,
        arPositioned: []
    };

    var arPoos = [
        { top: 1, left: 1 },
        { top: 41,  left: 214},
        { top: 112, left: 228 },
        { top: 114, left: 211 },
        { top: 54,  left: 267 },
        { top: 54,  left: 540 }

    ]

    function setRandomPosition(el) {
        var pos = new ElementPosition();
        var maxY = document.getElementById("wordsContainer").clientHeight;
        var maxX = document.getElementById("wordsContainer").clientWidth;
        var isFound = false;

        var extraSize = 5;
        var wordWidth = el.clientWidth;
        var wordHeight = el.clientHeight;
        var arPositioned = params.arPositioned;

        if (el.dataset.position == 3) {
            //debugger;
        }

        while (!isFound) {            
            //var xAxis = arPoos[el.dataset.position].left;
            //var yAxis = arPoos[el.dataset.position].top;
            var xAxis = Math.floor((Math.random() * maxX) + 1);
            var yAxis = Math.floor((Math.random() * maxY) + 1);
            var newWord = new DroppedWord(yAxis, xAxis, wordWidth, wordHeight);

            //if x,y crosses the boundaries, need to adapt a litte bit
            if (xAxis + wordWidth > maxX || yAxis + wordHeight > maxY) {
                isFound = false;
            } else {
                var isOccupied = false;
                //check the position is occupied or not
                for (var i = 0; i < arPositioned.length; i++) {                    
                    if (arPositioned[i].isConflictCoordinate(newWord, extraSize)) {
                        isOccupied = true;
                    }
                }

                isFound = !isOccupied;
            }

            if (isFound) {
                pos.left = xAxis;
                pos.top = yAxis;                
                arPositioned.push(newWord);
            }
        }

        //set style
        var currentStyle = el.getAttribute("style") === null
                                || el.getAttribute("style") === undefined
                                || el.getAttribute("style") === ''
                            ? ''
                            : el.getAttribute("style");
        currentStyle += ' top: ' + pos.top + "px; " + "left: " + pos.left + "px";
        el.setAttribute("style", currentStyle);
    }

    function generateWords() {
        var arWord = params.word.split(params.seperated);
        var wordContainer = document.getElementById(params.wordsContainer);
        var top = params.startTop;
        var left = params.startLeft;

        for (var i = 0; i < arWord.length; i++) {
            var attributes = Utils.cloneArray(params.templateAttributes);

            //create id attribute
            var lastIndexAttr = attributes.length - 1;
            var elementId = attributes[lastIndexAttr].value;
            elementId = elementId.replace("{0}", i + 1);
            attributes[lastIndexAttr].value = elementId;

            //create position for word in line
            attributes.push(new wordAttribute("data-position", i + 1));
            attributes.push(new wordAttribute("data-top", top));
            attributes.push(new wordAttribute("data-left", left));

            //create element
            var wordEl = Utils.createElement("div", attributes, null, arWord[i]);


            //wordEl.setAttribute("data-position", i + 1);

            //add event for element
            wordEl.addEventListener("dragstart", function (ev) {
                var elWord = ev.target;
                dropperWord.setCurrentDroppedPosition(parseInt(elWord.dataset.position));
                elWord.style.border = "dashed 2px #ccc";
                elWord.style.padding = "5px";
                ev.dataTransfer.setData("text/plain", elWord.id);
            });

            wordEl.addEventListener("dragend", function (ev) {
                ev.target.style.border = "";
                ev.target.style.padding = "0px";
                dropperWord.setCurrentDroppedPosition(0);
                document.getElementById("lineContainer").style.background = "#FFF";
                ev.dataTransfer.clearData();
            });

            wordEl.addEventListener("dragover", function (ev) {
                var elWord = ev.target;
                var cls = elWord.getAttribute("class");


                //ev.dataTransfer.setData("text/plain", elWord.id)
            });

            wordContainer.appendChild(wordEl);

            //set position
            this.setRandomPosition(wordEl);

            left += wordEl.offsetWidth + 20; //temporary fixed; Should you widh of word   
            attributes[lastIndexAttr].value = params.idTemplate;
        }
        params.arPositioned = [];
    }

    function intialize() {
        this.generateWords();
    }

    function wordLength() {
        return params.word.split(params.seperated).length;
    }

    function setCurrentDroppedPosition(pos) {
        params.currentDroppedPosition = pos;
    }

    function getCurrentDroppedPosition() {
        return params.currentDroppedPosition;
    }

    function startDrop() {
        var wContainer = document.getElementById("wordsContainer");
        var words = wContainer.getElementsByClassName("dropped-word");
        for (var i = 0; i < words.length; i++) {
            words[i].setAttribute("draggable", true);
        }
    }

    return {
        intialize: intialize,
        generateWords: generateWords,
        wordLength: wordLength,
        setCurrentDroppedPosition: setCurrentDroppedPosition,
        getCurrentDroppedPosition: getCurrentDroppedPosition,
        startDrop: startDrop,
        setRandomPosition: setRandomPosition
    }
})();

var lineWord = (function () {
    var params = {
        state: [],
        maxLength: dropperWord.wordLength(),
        lastDroppedWordPosition: 0,
        canBeDropped: false
    };

    function isDropAcceptable(droppedPosition) {
        var firstEmptyPos = 0;
        var lastEmptyPos = 0;

        var isFirstDrop = false;
        var isStopFirstEmpty = false;
        var isStopLastEmpty = false;

        var maxIndex = params.state.length - 1;
        for (var i = 0; i < params.state.length; i++) {
            if (!isStopFirstEmpty && params.state[i].isEmpty) {
                firstEmptyPos = params.state[i].position;
            }
            else {
                isStopFirstEmpty = true;
            }

            if (!isStopLastEmpty && params.state[maxIndex - i].isEmpty) {
                lastEmptyPos = params.state[maxIndex - i].position;
            }
            else {
                isStopLastEmpty = true;
            }

            var middlePos = Math.ceil(params.maxLength / 2);
            if (middlePos === firstEmptyPos && middlePos === lastEmptyPos) {
                isFirstDrop = true;
                break;
            }
        }

        var isOk = droppedPosition === firstEmptyPos
                || droppedPosition === lastEmptyPos
                || isFirstDrop;

        return isOk;
    }

    function updateDroppedPosition(droppedPosition) {
        for (var i = 0; i < params.state.length; i++) {
            if (params.state[i].position === droppedPosition) {
                params.state[i].isEmpty = false;
                break;
            }
        }
    }

    function intialize() {
        params.state = new Array();
        params.lastDroppedWordPosition = 0;
        params.canBeDropped = false;

        for (var i = 0; i < params.maxLength; i++) {
            params.state.push({ position: i + 1, isEmpty: true });
        }
    }

    function canBeDropped() {
        return params.canBeDropped;
    }

    function isFinish() {
        for (var i = 0; i < params.state.length; i++) {
            if (params.state[i].isEmpty) return false;
        }

        return true;
    }

    return {
        isDropAcceptable: isDropAcceptable,
        intialize: intialize,
        canBeDropped: canBeDropped,
        isFinish: isFinish,
        updateDroppedPosition: updateDroppedPosition
    };
})();


dropperWord.intialize();
lineWord.intialize();


var gameTimer = null;
var tiktak = 0;
document.getElementById("btnStart").addEventListener("click", function (ev) {
    var btn = ev.currentTarget;
    var showTime = document.getElementById("showTime");

    btn.disabled = true;
    document.getElementById("lineContainer").innerHTML = '';
    lineWord.intialize();
    tiktak = 0;

    var wordContainer = document.getElementById("wordsContainer");
    if (wordContainer.childElementCount <= 0) {
        wordContainer.innerHTML = '';
        dropperWord.intialize();
    }

    dropperWord.startDrop();

    gameTimer = setInterval(function () {
        showTime.innerText = (++tiktak).toString();
    }, 1000);
});

function drag_enter(ev) {
    var isDroppable = lineWord.isDropAcceptable(dropperWord.getCurrentDroppedPosition());
    var color = isDroppable ? " #5cb85c" : "#d9534f";
    event.target.style.background = color;
}

function dragover_handler(ev) {
    ev.preventDefault();
    // Set the dropEffect to move
    ev.dataTransfer.dropEffect = "move";
}

function drop_handler(ev) {
    ev.preventDefault();
    var droppedPosition = dropperWord.getCurrentDroppedPosition();
    var isDroppable = lineWord.isDropAcceptable(droppedPosition);

    if (isDroppable) {
        //Append dropped word
        var wordId = ev.dataTransfer.getData("text");
        var wordElement = document.getElementById(wordId);

        //set position for word        
        document.getElementById(wordId).style.top = wordElement.dataset.top + "px";
        document.getElementById(wordId).style.left = wordElement.dataset.left + "px";

        ev.target.appendChild(wordElement);

        //Update dropped position in state of line word
        lineWord.updateDroppedPosition(droppedPosition);

        if (lineWord.isFinish()) {
            clearInterval(gameTimer);
            gameTimer = null;
            document.getElementById("btnStart").disabled = false;

            //allow user enters name
            var userName = prompt("Enter your name:");

            if (userName != null && userName != '') {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var list = JSON.parse(JSON.parse(this.responseText).list);
                        document.getElementById("listBody").innerHTML = '';

                        for (var i = 0; i < list.length; i++) {
                            var tr = document.createElement("tr");

                            //rank column
                            var tdRank = document.createElement("td");
                            tdRank.innerText = i + 1;

                            //Name
                            var tdName = document.createElement("td");
                            tdName.innerText = list[i].User;

                            //Score
                            var tdScore = document.createElement("td");
                            tdScore.innerText = list[i].UserScore;

                            tr.appendChild(tdRank);
                            tr.appendChild(tdName);
                            tr.appendChild(tdScore);

                            document.getElementById("listBody").appendChild(tr);
                        }

                        // Typical action to be performed when the document is ready:
                        // document.getElementById("demo").innerHTML = xhttp.responseText;
                    }
                };
                xhttp.open("POST", "/Drop/SaveScore", true);
                //xhttp.send({ User: userName, UserScore: tiktak });
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send("User=" + userName + "&UserScore=" + tiktak);
            }
        }
    }
    event.target.style.background = "#FFFFFF";
}

