class Enemy {
    static assetName = "assets/sprites/enemy.svg";

    moveTicks = 4;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.delay = this.moveTicks;
    }

    performMove(distanceMatrix) {
        if (--this.delay > 0)
            return;
            
        let currentDistance = distanceMatrix[this.x][this.y];
        let nextPos = [this.x, this.y];
        let positions = [[this.x - 1, this.y], [this.x + 1, this.y], [this.x, this.y - 1], [this.x, this.y + 1]];
        positions.forEach(pos => {
            let distanceRow = distanceMatrix[pos[0]]
            if (distanceRow === undefined)
                return;
            let distanceAtPos = distanceRow[pos[1]];
            if (distanceAtPos !== undefined && distanceAtPos >= 0 && distanceAtPos < currentDistance) {
                nextPos = pos;
                currentDistance = distanceAtPos;
            }
        });

        this.x = nextPos[0];
        this.y = nextPos[1];

        this.delay = this.moveTicks;
    }

    isAt(x, y) {
        return this.x === x && this.y === y;
    }

    getAsset() {
        return Enemy.assetName;
    }

    getValue() {
        return -10;
    }
}