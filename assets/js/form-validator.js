/**
 * FormValidator Framework v1.0.0
 * (c) 2023 Nathan Amaral
 * Licensed under the MIT License.
 */

/**
 * FormValidator module.
 * @namespace FormValidator
 */
const FormValidator = {
    /**
     * Default error messages for different languages.
     * @type {Object}
     * @property {Object} en - English error messages.
     * @property {string} en.required - This field is required.
     * @property {string} en.minLength - This field must have at least {minLength} characters.
     * @property {string} en.isEmail - Please enter a valid email.
     * @property {string} en.custom - This field does not meet custom validation requirements.
     * @property {Object} pt - Portuguese error messages.
     * @property {string} pt.required - Este campo é obrigatório.
     * @property {string} pt.minLength - Este campo deve ter no mínimo {minLength} caracteres.
     * @property {string} pt.isEmail - Por favor, insira um e-mail válido.
     * @property {string} pt.custom - Este campo não atende aos requisitos personalizados de validação.
     * @property {Object} es - Spanish error messages.
     * @property {string} es.required - Este campo es obligatorio.
     * @property {string} es.minLength - Este campo debe tener al menos {minLength} caracteres.
     * @property {string} es.isEmail - Por favor, ingrese un correo electrónico válido.
     * @property {string} es.custom - Este campo no cumple con los requisitos de validación personalizados.
     * @property {Object} fr - French error messages.
     * @property {string} fr.required - Ce champ est obligatoire.
     * @property {string} fr.minLength - Ce champ doit comporter au moins {minLength} caractères.
     * @property {string} fr.isEmail - Veuillez saisir une adresse e-mail valide.
     * @property {string} fr.custom - Ce champ ne répond pas aux exigences de validation personnalisées.
     */
    defaultMessages: {
        en: {
            required: 'This field is required.',
            minLength: 'This field must have at least {minLength} characters.',
            isEmail: 'Please enter a valid email.',
            custom: 'This field does not meet custom validation requirements.',
        },
        pt: {
            required: 'Este campo é obrigatório.',
            minLength: 'Este campo deve ter no mínimo {minLength} caracteres.',
            isEmail: 'Por favor, insira um e-mail válido.',
            custom: 'Este campo não atende aos requisitos personalizados de validação.',
        },
        es: {
            required: 'Este campo es obligatorio.',
            minLength: 'Este campo debe tener al menos {minLength} caracteres.',
            isEmail: 'Por favor, ingrese un correo electrónico válido.',
            custom: 'Este campo no cumple con los requisitos de validación personalizados.',
        },
        fr: {
            required: 'Ce champ est obligatoire.',
            minLength: 'Ce champ doit comporter au moins {minLength} caractères.',
            isEmail: 'Veuillez saisir une adresse e-mail valide.',
            custom: 'Ce champ ne répond pas aux exigences de validation personnalisées.',
        },
    },

    /**
     * Validates a form based on specified validation options.
     * @param {string[]} fields - An array of field IDs to be validated.
     * @param {Object} validationOptions - Validation options for each field.
     * @param {string} [language='en'] - The language for error messages.
     * @param {Object} [translations={}] - Custom translations for error messages.
     * @returns {boolean} - `true` if the form is valid, `false` otherwise.
     */
    validateForm: function (fields, validationOptions, language = 'en', translations = {}) {
        let isValid = true;
        const currentMessages = { ...this.defaultMessages[language], ...translations[language] };

        fields.forEach((field) => {
            const value = this.getElementValue(field);
            const options = validationOptions[field];

            const errorMessage = this.getErrorMessage(options, value, currentMessages);

            if (errorMessage) {
                isValid = false;
                this.displayError(field, errorMessage);
            } else {
                this.clearError(field);
            }
        });

        return isValid;
    },

    /**
     * Gets the error message for a specific field.
     * @param {Object} options - Validation options for the field.
     * @param {string} value - The value of the field.
     * @param {Object} translations - Translations for error messages.
     * @returns {string|null} - The error message or null if no error.
     */
    getErrorMessage: function (options, value, translations) {
        if (options) {
            if (options.required && (value.trim() === '' || value === null)) {
                return translations && translations.required ? translations.required : (this.defaultMessages[language] && this.defaultMessages[language].required) || 'This field is required.';
            } else if (options.minLength && value.length < options.minLength) {
                return translations && translations.minLength ? translations.minLength.replace('{minLength}', options.minLength) : (this.defaultMessages[language] && this.defaultMessages[language].minLength.replace('{minLength}', options.minLength)) || 'This field must have at least {minLength} characters.';
            } else if (options.customValidation && !options.customValidation(value)) {
                return options.custom || (translations && translations.custom) ? translations.custom : (this.defaultMessages[language] && this.defaultMessages[language].custom) || 'This field does not meet custom validation requirements.';
            } else if (options.isEmail && !this.isEmail(value)) {
                return translations && translations.isEmail ? translations.isEmail : (this.defaultMessages[language] && this.defaultMessages[language].isEmail) || 'Please enter a valid email.';
            }
        }
        return null;
    },



    /**
     * Checks if a string is a valid email address.
     * @param {string} email - The email address to be validated.
     * @returns {boolean} - `true` if the email is valid, `false` otherwise.
     */
    isEmail: function (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Displays an error message for a specific field.
     * @param {string} elementId - The ID of the form field.
     * @param {string} message - The error message to be displayed.
     */
    displayError: function (elementId, message) {
        const errorElement = this.getElement(`${elementId}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    },

    /**
     * Clears the error message for a specific field.
     * @param {string} elementId - The ID of the form field.
     */
    clearError: function (elementId) {
        const errorElement = this.getElement(`${elementId}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    },

    /**
     * Gets the DOM element with the specified ID.
     * @param {string} elementId - The ID of the element.
     * @returns {HTMLElement|null} - The DOM element or null if not found.
     */
    getElement: function (elementId) {
        return document.getElementById(elementId);
    },

    /**
     * Gets the value of a form field.
     * @param {string} elementId - The ID of the form field.
     * @returns {string} - The value of the form field.
     */
    getElementValue: function (elementId) {
        const element = this.getElement(elementId);
        return element ? element.value : '';
    },
};