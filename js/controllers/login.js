class LoginController {
    bootstrap() {
        this.bindSubmit();
    }

    bindSubmit() {
        $("#login-form").submit(function (e) {
            var form = $(this);
            let username = form.find('input[name="username"]').value;
            let password = form.find('input[name="password"]').value;

            auth.login(username, password);
        });
    }
}