//
//  form.mixin.ts
//  InspiringApps modules
//
//  Created by InspiringApps on 5/3/2024.
//

import { Component, Vue, Watch } from 'vue-facing-decorator';
import { FormInput } from '@models/FormInput/FormInput.model';

@Component({
    name: 'MixinForm',
})
class MixinForm extends Vue {
    //
    // Data
    //
    formData: any = {};
    isFormValid = false;

    //
    // Computed
    //
    get formKeys(): Array<string> {
        return Object.keys(this.formData);
    }

    get formValues(): any {
        const { formData } = this;
        const values: any = {};

        this.formKeys.forEach((key) => {
            if (!formData[key].isSubmitInput) {
                values[key] = formData[key].value;
            }
        });

        return values;
    }

    get formSubmitInputs(): Array<FormInput> {
        const { formData } = this;

        return this.formKeys
            .filter((key) => formData[key].isSubmitInput)
            .map((key) => formData[key]);
    }

    get joiMessages(): any {
        const messages = {
            string: {
                'string.empty': this.$t('inputErrors.required'),
                'string.min': this.$t('inputErrors.minLength', { min: '{#limit}' }),
                'string.email': this.$t('inputErrors.email'),
                'string.max': this.$t('inputErrors.maxLength', { max: '{#limit}' }),
            },
            password: {
                'password.minOfUppercase': this.$t('inputErrors.minOfUppercase', { min: '{#min}' }),
                'password.minOfLowercase': this.$t('inputErrors.minOfLowercase', { min: '{#min}' }),
                'password.minOfNumeric': this.$t('inputErrors.minOfNumeric', { min: '{#min}' }),
                'password.minOfSpecialCharacters': this.$t('inputErrors.minOfSpecialCharacters', { min: '{#min}' }),
                'password.noWhiteSpaces': this.$t('inputErrors.noWhiteSpaces'),
                'password.onlyLatinCharacters': this.$t('inputErrors.onlyLatinCharacters'),
                'password.doesNotInclude': this.$t('inputErrors.doesNotInclude'),
            }
        };

        return messages;
    }

    get locale() {
        return this.$i18n.locale;
    }

    //
    // Methods
    //
    watchFormInputs() {
        const { formData } = this;

        this.formKeys.forEach((key) => {
            if (!formData[key].isSubmitInput) {
                this.$watch(`formData.${key}`, () => {
                    this.checkValidForAll();
                    this.updateFormSubmitSuccess('');
                    this.updateFormSubmitError('');
                }, { deep: true });
            }
        });

        this.validateAll();
    }

    populateFormInput(formInput: FormInput, value): void {
        formInput.value = value || '';
        formInput.validate();
    }

    blur(formInput: FormInput): void {
        console.log(`Example: Optional Parent Blur: ${formInput.name}`);
    }

    input(formInput: FormInput): void {
        console.log(`Example: Optional Parent Input: ${formInput.name}`);
    }

    validateAll(): void {
        const { formData } = this;

        this.formKeys.forEach((key) => {
            formData[key].validate();
        });
    }

    checkValidForAll(): void {
        const { formData } = this;

        this.isFormValid = this.formKeys.every((key) => formData[key].isValid);
    }

    updateFormSubmitSuccess(message: string): void {
        this.formSubmitInputs.forEach((submitInput) => {
            submitInput.successMessage = message;
        });
    }

    updateFormSubmitError(message: string): void {
        this.formSubmitInputs.forEach((submitInput) => {
            submitInput.errorMessage = message;
        });
    }

    initFormInputs(): void { // Placeholder method in case an implementing child decides not to use a specific form init.
        // Continue
    }

    handleSubmit(): void { // Placeholder method in case an implementing child decides not to use a specific submit handler.
        // Continue
    }

    @Watch('locale') localeChanged() {
        // @TODO: For now we just brute force the form re-init on language change. Making all the layers reactive (messages inside Joi schemas, etc) was messy.
        this.initFormInputs();
    }
}

// export default toNative(MixinForm);

export default MixinForm;
