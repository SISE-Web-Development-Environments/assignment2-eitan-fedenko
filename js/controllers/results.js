class ResultsController {
    init(appModules) {
        const router = appModules['router'];
        const gameModule = appModules['game'];


        router.subscribe('result', 'show', function () {
            const score = gameModule.getScore();
            $('#scoreResult').text(score);
        });
    }
}