class RegistrationController {
    bootstrap() {
        this.setupValidator();
        this.bindSubmit();
    }

    setupValidator() {
        $("#registration-form").validator();

        $.tools.validator.fn("[type=password]", "Password should contain at least one letter and one digit", function (input, value) {
            console.log("ASDGSADGSD")
            return (/[a-z]/.test(value) || /[A-Z]/.test(value))
                && /\d/.test(value);
        });
    }


    bindSubmit() {
        $("#registration-form").validator().submit(function (e) {
            var form = $(this);
            // client-side validation OK.
            if (!e.isDefaultPrevented()) {
                let username = form.find('input[name="username"]').val();
                let password = form.find('input[name="password"]').val();
                e.preventDefault();
                
                auth.register(username, password);
                auth.login(username, password);
            }
        });
    }
}