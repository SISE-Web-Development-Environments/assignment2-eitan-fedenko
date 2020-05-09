class ResultsController {
    init(appModules) {
        const router = appModules['router'];
        const gameModule = appModules['game'];


        router.subscribe('result', 'show', function () {
            const gameState = gameModule.getState();
            const resultElement = $('#gameResult');
            resultElement.addClass('banner');
            if (gameState.lives > 0 && gameState.score >= 100) {
                resultElement.text('Winner!!!');
            } else if (gameState.lives > 0) {
                resultElement.text(`You are better than ${gameState.score} points!`);
                resultElement.removeClass('banner');
            } else {
                resultElement.text('Loser!');
            }
        });
    }
}