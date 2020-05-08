class ExtraLife {
    static assetName = "assets/sprites/extraLife.png";

    moveTicks = 50;
    persistent = true; // whether it disapears when board resets

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.delay = this.moveTicks;
    }

    performMove(distanceMatrix) {
        if (--this.delay > 0)
            return;
            
        let positions = [[this.x - 1, this.y], [this.x + 1, this.y], [this.x, this.y - 1], [this.x, this.y + 1]];
        let availablePositions = [];
        positions.forEach(pos => {
            let distanceRow = distanceMatrix[pos[0]]
            if (distanceRow === undefined)
                return;
            let distanceAtPos = distanceRow[pos[1]];
            if (distanceAtPos !== undefined && distanceAtPos >= 0) {
                availablePositions.push(pos);
            }
        });        

        let nextPos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
        this.x = nextPos[0];
        this.y = nextPos[1];
        
        this.delay = this.moveTicks;
    }

    isAt(x, y) {
        return this.x === x && this.y === y;
    }

    getAsset() {
        return ExtraLife.assetName;
    }
    
    getValue() {
        return { lives: 1 };
    }
}