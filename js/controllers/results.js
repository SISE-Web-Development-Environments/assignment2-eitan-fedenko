class ResultsController {
    init(appModules) {
        const router = appModules['router'];
        const gameModule = appModules['game'];


        router.subscribe('result', function () {
            const score = gameModule.getScore();
            $('#score-result').text(score);
        });
    }
}