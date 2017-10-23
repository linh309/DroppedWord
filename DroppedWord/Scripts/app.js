var Game = (function () {
    var props = {
        wordGame: "It's all about the flow",
        seperated: " ",
        lineId: "lineContainer",
        wordContainerId: "wordsContainer",
        showTime: "showTime",
        isReady: false,
        words: [],
        lineWord: null,
        lineContainer: null,
        currentMovedPosition: 0,
        modalUserId: "modalUser",
        userNameId: "txtUserName",
        warning: "warning",
        score: 0
    };
    var buttons = {
        start: "btnStart",
        stop: "btnStop",
        replay: "btnReplay",
        save: "btnSave",
        cancel: "btnCancel"
    }
    var timer = {
        timeId: "showTime",
        timeCalculating: null,
        ticktack: 0
    }

    function setDraggableForElement(isDraggable) {
        //Make all dropped word is unmoveable
        var wordContainer = document.getElementById(props.wordContainerId);
        var words = wordContainer.childNodes;
        for (var i = 0; i < words.length; i++) {
            if (words[i].nodeType === 1) {
                words[i].setAttribute("draggable", isDraggable);
            }
        }
    }

    function generateWords(line, isSetDraggable) {
        var arWordElement = [];
        var arWord = props.wordGame.split(props.seperated);

        for (var i = 0; i < arWord.length; i++) {
            var droppedWord = new DroppedWord(arWord[i], i + 1);
            var wordElement = droppedWord.generateWord(arWordElement);

            if (isSetDraggable) {
                droppedWord.setDraggable();
            }

            line.lineWord.push(droppedWord);
            props.words.push(droppedWord);
            arWordElement.push(wordElement);
        }
    }

    function setCurrentMovedPosition(pos) {
        props.currentMovedPosition = pos;
    }

    function getCurrentMovedPosition(pos) {
        return props.currentMovedPosition;
    }

    function ready() {
        props.isReady = true;
        //Line ready
        props.lineContainer = new LineWord(props.lineId);
        props.lineContainer.initialize(props.lineContainer);

        //word ready
        Game.generateWords(props.lineContainer, false);
    }

    function startTimer() {
        if (timer.timeCalculating == null) {
            var showTime = document.getElementById(timer.timeId);
            timer.timeCalculating = setInterval(function () {
                timer.ticktack++;
                var textTime = Utils.formatTime(timer.ticktack);
                showTime.innerText = textTime;
            }, 1000);
        }
    }

    function stopTimer() {
        clearInterval(timer.timeCalculating);
        timer.ticktack = 0;
        timer.timeCalculating = null;
    }

    function start() {
        if (props.isReady) {
            for (var i = 0; i < props.words.length; i++) {
                props.words[i].setDraggable();
            }
        }
        else {
            document.getElementById(props.lineId).innerHTML = '';
            document.getElementById(props.wordContainerId).innerHTML = '';
            props.isReady = true;
            props.lineContainer = new LineWord(props.lineId);
            props.lineContainer.initialize(props.lineContainer);
            Game.generateWords(props.lineContainer, true);
        }

        //Make all dropped word is moveable again
        setDraggableForElement(true);
        Game.startTimer();
        document.getElementById(buttons.stop).style.display = "block";

        var clsDisable = document.getElementById(buttons.start).getAttribute("class") + " disabled";
        document.getElementById(buttons.start).disabled = true;
        document.getElementById(buttons.start).setAttribute("class", clsDisable);
    }

    function stop() {
        clearInterval(timer.timeCalculating);
        timer.timeCalculating = null;

        //Make all dropped word is unmoveable
        setDraggableForElement(false);

        //set style for buttons
        document.getElementById(buttons.stop).style.display = "none";
        document.getElementById(buttons.start).disabled = false;
        var cls = document.getElementById(buttons.start).getAttribute("class");
        cls = cls.replace('disabled', '');
        document.getElementById(buttons.start).setAttribute("class", cls);
    }

    function replay() {
        this.reset();
        document.getElementById(buttons.replay).style.display = "none";

        var cls = document.getElementById(buttons.start).getAttribute("class");
        cls = cls.replace('disabled', '');
        document.getElementById(buttons.start).disabled = false;
        document.getElementById(buttons.start).setAttribute("class", cls);

        //re-generate word
        props.isReady = true;
        document.getElementById(props.lineId).innerHTML = '';
        document.getElementById(props.wordContainerId).innerHTML = '';
        props.lineContainer = new LineWord(props.lineId);
        props.lineContainer.initialize(props.lineContainer);
        Game.generateWords(props.lineContainer, false);
        document.getElementById(props.showTime).innerHTML = '00:00';
    }

    function reset() {
        props.words = [];
        props.lineWord = null
        props.lineContainer = null;
        props.currentMovedPosition = 0;
        props.isReady = false;
    }

    function cancelSave() {
        document.getElementById(props.modalUserId).style.display = "none";
        document.getElementById(props.userNameId).value = '';
    }

    function saveScore() {
        var userName = document.getElementById(props.userNameId).value;
        userName = userName.trim();
        if (userName === '') {
            document.getElementById("warning").style.visibility = "visible";
        }
        else {
            var score = props.score;
            Game.refreshUserList(userName, score);

            document.getElementById("warning").style.visibility = "hidden";
            document.getElementById(props.modalUserId).style.display = "none";
            document.getElementById(props.userNameId).value = '';
        }
    }

    function initialize() {
        //Bind events
        Utils.addEvent(buttons.start, "click", this.start);
        Utils.addEvent(buttons.stop, "click", this.stop.bind(this))
        Utils.addEvent(buttons.replay, "click", this.replay.bind(this))
        Utils.addEvent(buttons.cancel, "click", cancelSave);
        Utils.addEvent(buttons.save, "click", this.saveScore.bind(this));

        document.getElementById(buttons.stop).style.display = "none";
        document.getElementById(buttons.replay).style.display = "none";
    }

    function isFinish() {
        for (var i = 0; i < props.lineContainer.lineWord.length; i++) {
            if (!props.lineContainer.lineWord[i].isDropped) return false;
        }

        return true;
    }

    function finishGame() {
        props.score = timer.ticktack;
        Game.stopTimer();        
        document.getElementById(buttons.stop).style.display = "none";
        document.getElementById(buttons.replay).style.display = "block";
        document.getElementById(props.modalUserId).style.display = "block";
    }

    function numberOfSecondCalculating() {
        return timer.ticktack;
    }

    function refreshUserList(userName, scrore) {
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
            }
        };

        xhttp.open("POST", "/Drop/SaveScore", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("User=" + userName + "&UserScore=" + scrore);
    }

    return {
        initialize: initialize,
        start: start,
        stop: stop,
        replay: replay,
        reset: reset,
        generateWords: generateWords,
        ready: ready,
        isFinish: isFinish,
        startTimer: startTimer,
        stopTimer: stopTimer,
        setCurrentMovedPosition: setCurrentMovedPosition,
        getCurrentMovedPosition: getCurrentMovedPosition,
        finishGame: finishGame,
        refreshUserList: refreshUserList,
        numberOfSecondCalculating: numberOfSecondCalculating,
        saveScore: saveScore
    };

})();
Game.initialize();
Game.ready();