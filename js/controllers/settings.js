class SettingsController {
    init(appModules) {
        this.configModule = appModules['config'];
        this.routerModule = appModules['router'];
        this.form = $('#settingsForm');
        this.setupValidator();

        const config = this.configModule.getConfig();
        this.initValues(config);
        this.bindSubmit();
    }

    setupValidator() {
        this.form.validator();
    }

    initValues(config) {

        this.controls = config.controls;

        this.form.find('input[name="foodAmount"]').val(config.collectiblesAmount);

        for (let i = 0; i <= 2; i++)
            this.initFoodCompFromConfig(config, i);

        this.form.find('input[name="gameTime"]').val(config.gameTime);
        this.form.find('input[name="enemies"]').val(config.enemySpawns);

        jscolor.installByClassName("jscolor");
    }

    initFoodCompFromConfig(config, i) {
        this.form.find(`input[name="foodComp[${i}].percent"]`).val(config.collectiblesComposition[i].percent);
        this.form.find(`input[name="foodComp[${i}].points"]`).val(config.collectiblesComposition[i].points);

        let colorInput = this.form.find(`input[name="foodComp[${i}].color"]`);
        if (!colorInput.hasClass('jscolor')) {
            colorInput.val(config.collectiblesComposition[i].color);
            colorInput.addClass('jscolor');
        } else {
            colorInput.get(0).jscolor.fromString(config.collectiblesComposition[i].color);
        }
    }

    extractFoodCompFromForm(i) {
        let color = this.form.find(`input[name="foodComp[${i}].color"]`).val();
        if (!color.includes('#'))
            color = '#' + color;

        return {
            percent: parseInt(this.form.find(`input[name="foodComp[${i}].percent"]`).val()),
            points: parseInt(this.form.find(`input[name="foodComp[${i}].points"]`).val()),
            color: color
        };
    }

    bindSubmit() {
        const context = this;
        const configCtx = this.configModule;
        const routerCtx = this.routerModule;
        const formCtx = this.form;

        formCtx.validator().submit(function (e) {
            // Check client side validation
            if (!e.isDefaultPrevented()) {
                // Controls
                configCtx.updateConfig('controls', context.controls);

                // Scalars
                let foodAmount = formCtx.find('input[name="foodAmount"]').val();
                configCtx.updateConfig('collectiblesAmount', parseInt(foodAmount));

                let gameTime = formCtx.find('input[name="gameTime"]').val();
                configCtx.updateConfig('gameTime', parseInt(gameTime));

                let enemySpawns = formCtx.find('input[name="enemies"]').val();
                configCtx.updateConfig('enemySpawns', parseInt(enemySpawns));

                // Food types
                let updatedFood = [];
                for (let i = 0; i <= 2; i++)
                    updatedFood.push(context.extractFoodCompFromForm(i));
                configCtx.updateConfig('collectiblesComposition', updatedFood);

                e.preventDefault();

                routerCtx.navigateBack();
            }
        });

        $('#btnSetControls').unbind().click(() => this.advanceControlsWizard());

        $('#btnRandomSettings').unbind().click((e) => {
            let newConfig = ConfigModule.generateRandomConfig();
            this.initValues(newConfig);
            e.preventDefault();
        });
    }

    advanceControlsWizard(step) {
        const directions = ['up', 'down', 'left', 'right'];
        const dialog = $('#setControlsModal');
        const settingsCtx = this;

        if (step === undefined)
            step = 0;

        if (step >= directions.length) {
            $('.jquery-modal').hide();
            return;
        }

        dialog.text(`Press ${directions[step].toUpperCase()}`);

        addEventListener(
            "keydown",
            function (e) {
                settingsCtx.updateControl(directions[step], e.keyCode);
                settingsCtx.advanceControlsWizard(step + 1);
            }, { once: true }
        );
    }

    updateControl(control, key) {
        this.controls[control] = key;
    }
}