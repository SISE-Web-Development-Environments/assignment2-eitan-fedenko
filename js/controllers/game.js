class GameController {
    init(appModules) {
        const router = appModules['router'];
        const gameModule = appModules['game'];
        const authModule = appModules['auth'];
        const configModule = appModules['config'];

        const openResults = function () {
            router.navigate('result');
        };

        router.subscribe('game', 'show', function () {
            const user = authModule.getUser();
            $('#lblName').text(user.username);

            let configuration = configModule.getConfig();
            gameModule.startGame(configuration, openResults);
        });


        router.subscribe('game', 'hide', function () {
            gameModule.dispose();
        });
    }
}