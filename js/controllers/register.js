class RegistrationController {
    init(appModules) {
        this.routerModule = appModules['router'];
        this.authModule = appModules['auth'];

        this.setupValidator();
        this.bindSubmit();
    }

    setupValidator() {
        $('#registrationForm').validator();

        $.tools.validator.fn('[type=password]', 'Password should contain at least one letter and one digit', function (input, value) {
            return (/[a-z]/.test(value) || /[A-Z]/.test(value))
                && /\d/.test(value);
        });
    }


    bindSubmit() {
        const routerCtx = this.routerModule;
        const authCtx = this.authModule;

        $('#registrationForm').validator().submit(function (e) {
            var form = $(this);
            // Check client side validation
            if (!e.isDefaultPrevented()) {
                let username = form.find('input[name="username"]').val();
                let password = form.find('input[name="password"]').val();
                e.preventDefault();
                
                authCtx.register(username, password);
                routerCtx.navigate('login');
            }
        });
    }
}