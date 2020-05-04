var router;

$(document).ready(function () {
	router = new Router('welcome');
	RegistrationController.setupValidator();
});