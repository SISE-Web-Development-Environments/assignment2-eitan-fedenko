class ConfigModule {
	constructor() {
		this.config = {
			controls: {
				up: 38,
				down: 40,
				left: 37,
				right: 39
			},
			gameTime: 60,
			enemySpawns: 4,
			collectiblesAmount: 50,
			collectiblesComposition: [
				{
					percent: 60,
					points: 5,
					color: '#FFFFFF'
				},
				{
					percent: 30,
					points: 15,
					color: '#FF5733'
				},
				{
					percent: 10,
					points: 25,
					color: '#6A1B9A'
				}
			]
		};
	}

	getConfig() {
		return this.config;
	}

	updateConfig(key, value) {
		this.config[key] = value;
	}

    static generateRandomConfig() {
        let commonAmount = this.generateRandomValue(0, 80);
        let mediumAmount = this.generateRandomValue(15, 100 - commonAmount);
        let rareAmount = 100 - commonAmount - mediumAmount;
        let commonPoints = this.generateRandomValue(1, 5);
        let mediumPoints = commonPoints * this.generateRandomValue(2, 4);
        let rarePoints = mediumPoints * this.generateRandomValue(2, 4);

        return {
            controls: {
                up: 38,
                down: 40,
                left: 37,
                right: 39
            },
            gameTime: this.generateRandomValue(60),
            enemySpawns: this.generateRandomValue(1, 4),
            collectiblesAmount: this.generateRandomValue(50, 90),
            collectiblesComposition: [
                {
                    percent: commonAmount,
                    points: commonPoints,
                    color: this.generateRandomColor()
                },
                {
                    percent: mediumAmount,
                    points: mediumPoints,
                    color: this.generateRandomColor()
                },
                {
                    percent: rareAmount,
                    points: rarePoints,
                    color: this.generateRandomColor()
                }
            ]
        };
	}
	
    static generateRandomValue(min, max) {
        if (min === undefined)
            min = 0;

        if (max === undefined)
            max = 100;

        return Math.floor(min + Math.random() * (max - min));
    }

    static generateRandomColor() {
        return '#' + this.generateRandomValue(0, 0xFFFFFF).toString(16);
    }
}