"use strict";
/**
 * Form Validator Framework v1.0.0
 * (c) 2023 Nathan Amaral
 * Licensed under the MIT License.
 */
/**
 * Object to store custom error messages.
 */
const errorMessages = {
    required: 'This field is required.',
    minLength: 'This field must have at least {minLength} characters.',
    isEmail: 'Please enter a valid email.',
    custom: 'This field does not meet custom validation requirements.'
};
/**
 * Main function for form validation.
 * @param {string[]} fields - A list of form field IDs to be validated.
 * @param {Record<string, ValidationOptions>} validationOptions - An object mapping field IDs to validation options.
 * @returns {boolean} - `true` if the form is valid, `false` otherwise.
 */
function validateForm(fields, validationOptions) {
    let isValid = true;
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        const options = validationOptions[field];
        if (options) {
            if (options.required && (value.trim() === '' || value === null)) {
                isValid = false;
                displayError(field, errorMessages.required);
            }
            else if (options.minLength && value.length < options.minLength) {
                isValid = false;
                displayError(field, errorMessages.minLength.replace('{minLength}', options.minLength.toString()));
            }
            else if (options.customValidation && !options.customValidation(value)) {
                isValid = false;
                displayError(field, errorMessages.custom);
            }
            else if (options.isEmail && !isEmail(value)) {
                isValid = false;
                displayError(field, errorMessages.isEmail);
            }
            else {
                // Clear the error message if the field is valid
                clearError(field);
            }
        }
    });
    return isValid;
}
/**
 * Helper function to validate email.
 * @param {string} email - The string to be checked if it's a valid email.
 * @returns {boolean} - `true` if the email is valid, `false` otherwise.
 */
function isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Function to display error message.
 * @param {string} elementId - The ID of the form field associated with the error.
 * @param {string} message - The error message to be displayed.
 */
function displayError(elementId, message) {
    const errorElement = document.getElementById(`${elementId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}
/**
 * Function to clear error message.
 * @param {string} elementId - The ID of the form field associated with the error to be cleared.
 */
function clearError(elementId) {
    const errorElement = document.getElementById(`${elementId}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}
