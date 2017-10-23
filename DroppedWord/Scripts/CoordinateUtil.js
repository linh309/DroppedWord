var CoordinateUtil = (function () {
    function getRandomPosition(maxTop, maxLeft) {
        var top = Math.floor((Math.random() * maxTop) + 1);
        var left = Math.floor((Math.random() * maxLeft) + 1);
        return new ElementPosition(top, left);
    }

    function isPositionCrossBoundaries(top, left, maxTop, maxLeft) {
        return top > maxTop || left > maxLeft;
    }

    function isInScopePosition(scopeTop, scopeMaxTop, scopeLeft, scopeMaxLeft, top, left) {
        return scopeLeft <= left && left <= scopeMaxLeft &&
                scopeTop <= top && top <= scopeMaxTop;
    }

    function isPositionsOverlap(newTopLeftPosition, newBottemRightPosition, element) {
        //each word will be added extra size to avoid overlapping together
        var extraSize = 5;
        var newLeftMax = newBottemRightPosition.left + extraSize;
        var newTopMax = newBottemRightPosition.top + extraSize;

        var elLeftMax = element.left + element.width + extraSize;
        var elTopMax = element.top + element.height + extraSize;

        //this.left <= newWord.left && newWord.left <= currentLeftMax &&
        //(this.top <= newWord.top && newWord.top <= currentTopMax);
        var isNewTopLeftIn = this.isInScopePosition(element.top, elTopMax, element.left, elLeftMax, newTopLeftPosition.top, newTopLeftPosition.left)

        //this.left <= neWordLeftMax && neWordLeftMax <= currentLeftMax &&
        //(this.top <= newWord.top && newWord.top <= currentTopMax);
        var isNewTopRightIn = this.isInScopePosition(element.top, elTopMax, element.left, elLeftMax, newTopLeftPosition.top, newLeftMax);

        //this.left <= newWord.left && newWord.left <= currentLeftMax &&
        //(this.top <= neWordTopMax && neWordTopMax <= currentTopMax);
        var isNewBottomLeftIn = this.isInScopePosition(element.top, elTopMax, element.left, elLeftMax, newTopMax, newTopLeftPosition.left);

        //this.left <= neWordLeftMax && neWordLeftMax <= currentLeftMax &&
        //(this.top <= neWordTopMax && neWordTopMax <= currentTopMax);
        var isNewBottomRightIn = this.isInScopePosition(element.top, elTopMax, element.left, elLeftMax, newTopMax, newLeftMax);

        //newWord.left <= this.left && this.left <= neWordLeftMax &&
        //(newWord.top <= this.top && this.top <= neWordTopMax);
        var isTopLeftIn = this.isInScopePosition(newTopLeftPosition.top, newTopMax, newTopLeftPosition.left, newLeftMax, element.top, element.left);

        //newWord.left <= currentLeftMax && currentLeftMax <= neWordLeftMax &&
        //(newWord.top <= this.top && this.top <= neWordTopMax);
        var isTopRightIn = this.isInScopePosition(newTopLeftPosition.top, newTopMax, newTopLeftPosition.left, newLeftMax, element.top, elLeftMax);

        //newWord.left <= this.left && this.left <= neWordLeftMax &&
        //(newWord.top <= currentTopMax && currentTopMax <= neWordTopMax);
        var isBottomLeftIn = this.isInScopePosition(newTopLeftPosition.top, newTopMax, newTopLeftPosition.left, newLeftMax, elTopMax, element.left);

        //newWord <= currentLeftMax && currentLeftMax <= neWordLeftMax &&
        //(newWord <= currentTopMax && currentTopMax <= neWordTopMax);
        var isBottomRightIn = this.isInScopePosition(newTopLeftPosition.top, newTopMax, newTopLeftPosition.left, newLeftMax, elTopMax, elLeftMax);

        return isTopLeftIn || isTopRightIn || isBottomLeftIn || isBottomRightIn
                || isNewTopLeftIn || isNewTopRightIn || isNewBottomLeftIn || isNewBottomRightIn;
    }

    function positionIsOccupied(newTopLeftPosition, newBottemRightPosition, arElement) {
        var isOccupied = false;
        for (var i = 0; i < arElement.length; i++) {
            isOccupied = this.isPositionsOverlap(newTopLeftPosition, newBottemRightPosition, arElement[i]);
            if (isOccupied) return isOccupied;
        }

        return isOccupied;
    }

    return {
        getRandomPosition: getRandomPosition,
        isPositionCrossBoundaries: isPositionCrossBoundaries,
        isInScopePosition: isInScopePosition,
        positionIsOccupied: positionIsOccupied,
        isPositionsOverlap: isPositionsOverlap
    }
})();
