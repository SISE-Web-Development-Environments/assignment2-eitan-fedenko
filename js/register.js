class RegistrationController {
    static setupValidator() {
        $("#registration-form").validator();

        $.tools.validator.fn("[type=password]", "Password should contain at least one letter and one digit", function (input, value) {
            console.log("ASDGSADGSD")
            return (/a-z/.test(value) || /A-Z/.test(value))
                && /0-9/.test(value);
        });
    }
}