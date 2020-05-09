var gameContext;
var gameTicks;
const boardSize = 10;

class GameModule {
	constructor() {
		this.context = gameCanvas.getContext("2d");
		this.shape = new Object();
		this.rotate = 0;
		this.availablePrizes = 1;
		this.backgroundMusic = new Audio('assets/sounds/background.mp3');
		this.backgroundMusic.volume = 0.05;
		this.backgroundMusic.loop = true;
		this.entities = [
			new Prize(0, 0)
		];

		this.loadAssets(Enemy.assetName, Prize.assetName, ExtraTime.assetName, ExtraLife.assetName);

		gameContext = this;
	}

	loadAssets(...assetNames) {
		// Load assets
		let loaded = {};
		assetNames.forEach(asset => {
			loaded[asset] = new Image();
			loaded[asset].src = asset;
		});
		this.assets = loaded;
	}


	getTotalRemainingFood() {
		return this.foodRemaining.reduce((a, b) => a + (b.amount || 0), 0);
	}

	startGame(configuration, gameFinishCallback) {
		gameTicks = 0;
		this.board = new Array();
		const totalFood = configuration.collectiblesAmount;

		let nextFoodType = 10;
		this.foodRemaining = configuration.collectiblesComposition.map(foodConfig => {
			return {
				type: nextFoodType++,
				amount: foodConfig.percent / 100 * totalFood,
				points: foodConfig.points,
				color: foodConfig.color
			};
		});

		const disparity = totalFood - this.getTotalRemainingFood();
		console.log(`After allocating food, need ${disparity} more`)
		this.foodRemaining[0].amount += disparity;

		this.pac_color = "yellow";
		this.start_time = new Date();
		this.config = configuration;
		this.gameState = {
			lives: 5,
			score: 0,
			time: configuration.gameTime
		}
		this.createBoard();
		this.keysDown = {};
		this.gameFinishCallback = gameFinishCallback;
		addEventListener(
			"keydown",
			function (e) {
				for (const keyName in configuration.controls) {
					if (configuration.controls.hasOwnProperty(keyName)) {
						if (e.keyCode == configuration.controls[keyName])
							gameContext.keysDown[keyName] = true;
					}
				}
			},
			false
		);
		addEventListener(
			"keyup",
			function (e) {
				for (const keyName in configuration.controls) {
					if (configuration.controls.hasOwnProperty(keyName)) {
						if (e.keyCode == configuration.controls[keyName])
							gameContext.keysDown[keyName] = false;
					}
				}
			},
			false
		);
		this.interval = setInterval(this.gameTick, 250);
		this.backgroundMusic.play();

		$('#gameSettingSummary').html(JSON.stringify(configuration, null, 4).replace(/\n/g,'<br/>').replace(/ /g,'&nbsp;'));
	}

	createBoard() {
		var pacman_remain = 1;
		var cnt = 100;
		this.board = [
			[0, 0, 0, 0, 0, 4, 0, 0, 0, 0],
			[0, 4, 4, 4, 0, 4, 0, 4, 0, 4],
			[0, 4, 0, 0, 0, 0, 0, 4, 0, 0],
			[0, 4, 0, 4, 0, 4, 4, 4, 4, 0],
			[0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
			[0, 4, 0, 0, 0, 4, 0, 0, 4, 0],
			[0, 4, 0, 4, 0, 4, 4, 0, 4, 0],
			[0, 4, 0, 4, 0, 4, 0, 0, 4, 0],
			[0, 4, 0, 4, 0, 4, 0, 4, 4, 0],
			[0, 0, 0, 4, 0, 0, 0, 0, 0, 0]];
		for (var i = 0; i < boardSize; i++) {
			for (var j = 0; j < boardSize; j++) {
				if (this.board[i][j] != 4) {
					var randomNum = Math.random();
					if (randomNum < (1.0 * (pacman_remain)) / cnt) {
						this.shape.i = i;
						this.shape.j = j;
						pacman_remain--;
						this.board[i][j] = 2;
					} else {
						this.board[i][j] = 0;
					}
					cnt--;
				}
			}
		}

		while (pacman_remain > 0) {
			var emptyCell = this.findRandomEmptyCell();
			this.shape.i = emptyCell[0];
			this.shape.j = emptyCell[1];
			pacman_remain--;
			this.board[emptyCell[0]][emptyCell[1]] = 2;
		}

		this.foodRemaining.forEach(foodType => {
			for (let placed = 0; placed <= foodType.amount; placed++) {
				var emptyCell = this.findRandomEmptyCell();
				if (emptyCell)
					this.board[emptyCell[0]][emptyCell[1]] = foodType.type;
				else break;
			}
		});


		this.placeEnemies();
	}

	placeBonusEntities() {
		// Extra life every 30 seconds * 4 ticks / second = 80 ticks
		if (gameTicks % (30 * 4) === 15)
			this.placeExtraLife();

		if (this.extraTimeTimer > 0)
			--this.extraTimeTimer;
		if (this.extraTimeTimer === undefined || this.extraTimeTimer == 0)
			this.placeExtraTime();
	}

	placeExtraTime() {
		var [x, y] = this.findRandomEmptyCell(x => x !== 4);
		this.entities.push(new ExtraTime(x, y));
		this.extraTimeTimer = -1;
	}

	placeExtraLife() {
		var [x, y] = this.findRandomEmptyCell(x => x !== 4);
		this.entities.push(new ExtraLife(x, y));
	}

	placeEnemies() {
		// Position entities
		let availableEnemies = [
			new Enemy(0, 0),
			new Enemy(boardSize - 1, boardSize - 1),
			new Enemy(0, boardSize - 1),
			new Enemy(boardSize - 1, 0)];

		this.entities = this.entities
			.filter(entity => entity.persistent) // Clear non-persistent entities
			.concat(availableEnemies.slice(0, this.config.enemySpawns));
	}

	findRandomEmptyCell(condition) {
		var i = Math.floor(Math.random() * 10);
		var j = Math.floor(Math.random() * 10);
		let tries = 1000;

		if (condition === undefined)
			condition = x => x === 0;

		while (!condition(this.board[i][j]) && tries-- > 0) {
			i = Math.floor(Math.random() * 10);
			j = Math.floor(Math.random() * 10);
		}

		if (condition(this.board[i][j]))
			return [i, j];
		else
			return null;
	}

	getKeyPressed() {
		if (this.keysDown['up']) {
			return 1;
		}
		if (this.keysDown['down']) {
			return 2;
		}
		if (this.keysDown['left']) {
			return 3;
		}
		if (this.keysDown['right']) {
			return 4;
		}
	}

	draw() {
		gameCanvas.width = gameCanvas.width; //clean this.board
		lblScore.value = this.gameState.score;
		lblTime.value = parseInt(this.remainingTime);
		lblLives.value = this.gameState.lives;
		for (var i = 0; i < boardSize; i++) {
			for (var j = 0; j < boardSize; j++) {
				var center = new Object();
				center.x = i * 60 + 30;
				center.y = j * 60 + 30;
				if (this.board[i][j] == 2) {
					let phase = this.rotate;
					this.context.beginPath();
					this.context.arc(center.x, center.y, 30, 0.15 * Math.PI + phase, 1.85 * Math.PI + phase); // half circle
					this.context.lineTo(center.x, center.y);
					this.context.fillStyle = this.pac_color; //color
					this.context.fill();
					this.context.beginPath();

					// Draw eye
					let eye = { x: 5, y: -15 };

					// Fix eye when turning left
					if (phase === Math.PI)
						eye.y = -eye.y;
					let rotatedEye = {};
					rotatedEye.x = eye.x * Math.cos(phase) - eye.y * Math.sin(phase)
					rotatedEye.y = eye.x * Math.sin(phase) + eye.y * Math.cos(phase)
					this.context.arc(center.x + rotatedEye.x, center.y + rotatedEye.y, 5, 0, 2 * Math.PI); // circle
					this.context.fillStyle = "black"; //color
					this.context.fill();
				} else if (this.board[i][j] == 4) {
					this.context.beginPath();
					this.context.rect(center.x - 30, center.y - 30, 60, 60);
					this.context.fillStyle = "grey"; //color
					this.context.fill();
				} else {
					// Check if its a food
					this.foodRemaining.forEach(foodType => {
						if (this.board[i][j] === foodType.type) {
							this.context.beginPath();
							this.context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
							this.context.fillStyle = foodType.color; //color
							this.context.fill();
						}
					});
				}
			}
		}

		const assetsCtx = this.assets;
		this.entities.forEach(entity => {
			const texture = assetsCtx[entity.getAsset()];
			this.context.drawImage(texture, entity.x * 60, entity.y * 60, 60, 60);
		});
	}

	gameTick() {
		gameTicks++;

		gameContext.updatePlayer();
		gameContext.moveEntities();
		gameContext.checkEntities();
		gameContext.placeBonusEntities();
		gameContext.updateGame();
	}

	updatePlayer() {
		this.board[this.shape.i][this.shape.j] = 0;
		this.updatePosition();
		this.checkFood();
		this.board[this.shape.i][this.shape.j] = 2;
	}

	updatePosition() {
		if (this.keysDown['up']) {
			if (this.shape.j > 0 && this.board[this.shape.i][this.shape.j - 1] != 4) {
				this.shape.j--;
				this.rotate = Math.PI * 3 / 2;
			}
			return;
		}
		if (this.keysDown['down']) {
			if (this.shape.j < 9 && this.board[this.shape.i][this.shape.j + 1] != 4) {
				this.shape.j++;
				this.rotate = Math.PI / 2;
			}
			return;
		}
		if (this.keysDown['left']) {
			if (this.shape.i > 0 && this.board[this.shape.i - 1][this.shape.j] != 4) {
				this.shape.i--;
				this.rotate = Math.PI;
			}
			return;
		}
		if (this.keysDown['right']) {
			if (this.shape.i < 9 && this.board[this.shape.i + 1][this.shape.j] != 4) {
				this.shape.i++;
				this.rotate = 0;
			}
			return;
		}
	}

	updateGame() {
		var currentTime = new Date();
		let time_elapsed = (currentTime - this.start_time) / 1000;
		if (this.gameState.score >= 20 && time_elapsed <= 10) {
			this.pac_color = "green";
		}
		this.remainingTime = this.gameState.time - time_elapsed;


		if (this.remainingTime <= 0 || this.getTotalRemainingFood() === 0) {
			this.gameFinished();
		}

		this.draw();
	}

	updateState(stateDiff) {
		for (let [key, value] of Object.entries(stateDiff)) {
			this.gameState[key] += value;


			switch (key) {
				case "lives":
					// If lost life, reset board or finish game
					if (value < 0) {
						if (this.gameState.lives > 0) {
							this.createBoard();
						} else {
							this.gameFinished();
						}
					}
					break;
				case "time":
					this.extraTimeTimer = 25 * 4;
					break;

			}
		}
	}

	moveEntities() {
		const distanceMatrix = this.calculateDistanceMatrix();

		this.entities.forEach((enemy) => {
			enemy.performMove(distanceMatrix);
		});
	}

	checkFood() {
		this.foodRemaining.forEach(foodType => {
			if (this.board[this.shape.i][this.shape.j] === foodType.type) {
				this.gameState.score += foodType.points;
				foodType.amount--;
			}
		});
	}

	checkEntities() {
		let indeciesToRemove = [];
		this.entities.forEach((enemy, index) => {
			if (enemy.isAt(this.shape.i, this.shape.j)) {
				indeciesToRemove.push(index);
			}
		});

		const entitiesCtx = this.entities;
		indeciesToRemove.reverse();
		indeciesToRemove.forEach(index => {
			let entity = entitiesCtx[index];
			entitiesCtx.splice(index, 1);
			gameContext.updateState(entity.getValue());
		});
	}

	gameFinished() {
		this.gameFinishCallback(this.gameState.score);
	}


	calculateDistanceMatrix() {
		let visited = new Set();
		let distance = Array(10).fill().map(() => Array(10).fill(-1));
		distance[this.shape.i][this.shape.j] = 0;
		let Q = [];
		Q.push([this.shape.i, this.shape.j]);
		visited.add([this.shape.i, this.shape.j].toString());

		let dr = [-1, 1, 0, 0];
		let dc = [0, 0, -1, 1];

		while (Q.length > 0) {
			let cur = Q.shift();
			let row = cur[0];
			let col = cur[1];

			for (let k = 0; k < 4; k++) {
				let newRow = row + dr[k];
				let newCol = col + dc[k];

				if (newRow >= 0 && newCol >= 0 && newRow < 10 && newCol < 10) {
					if (!visited.has([newRow, newCol].toString()) && this.board[newRow][newCol] !== 4) {
						visited.add([newRow, newCol].toString());
						distance[newRow][newCol] = distance[row][col] + 1;
						Q.push([newRow, newCol]);
					}
				}
			}
		}

		return distance;
	}

	getState() {
		return this.gameState;
	}

	dispose() {
		window.clearInterval(this.interval);
		this.backgroundMusic.pause();
		this.backgroundMusic.currentTime = 0;
	}
}
