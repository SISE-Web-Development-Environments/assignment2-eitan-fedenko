var modules = {};
var controllers = {};

$(document).ready(function () {
	// Create modules
	modules['auth'] = new AuthModule();
	modules['router'] = new RouterModule('welcome');
	modules['game'] = new GameModule();
	modules['dropdown'] = new DropdownModule();

	// Create controllers
	controllers['login'] = new LoginController();
	controllers['registration'] = new RegistrationController();
	controllers['game'] = new GameController();
	controllers['results'] = new ResultsController();
	
	Object.values(controllers).forEach((controller) => { controller.init(modules); });// This calls each controllers init method and injects app modules
});