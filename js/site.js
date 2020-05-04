var auth;
var router;
var controllers = {};

$(document).ready(function () {
	auth = new AuthModule();
	router = new RouterModule('welcome');
	controllers['registration'] = new RegistrationController();
	controllers['registration'].bootstrap()
});