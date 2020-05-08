class LoginController {
    init(appModules) {
        this.routerModule = appModules['router'];
        this.authModule = appModules['auth'];

        this.bindSubmit();
    }

    bindSubmit() {
        var context = this;
        const routerCtx = this.routerModule;
        const authCtx = this.authModule;

        $('#login-form').submit(function (e) {
            const form = $(this);
            e.preventDefault();

            context.hideError(form);

            let username = form.find('input[name="username"]').val();
            let password = form.find('input[name="password"]').val();

            let loginSuccess = authCtx.login(username, password);

            if (loginSuccess)
                routerCtx.loginRedirect();
            else
                context.showError(form, 'Invalid username or password.');
        });
    }

    hideError(form) {
        this.toggleError(form, false);
    }

    showError(form, message) {
        this.toggleError(form, true, message);
    }

    toggleError(form, show, message) {
        const errorContainer = $(form.find('.error'));
        errorContainer.text(message);
        if (show)
            errorContainer.show();
        else
            errorContainer.hide();
    }
}