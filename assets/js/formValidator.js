/**
 * Framework Form Validator v1.0.0
 * (c) 2023 Nathan Amaral
 * Licenciado sob a Licença MIT.
 */

/**
 * Objeto para armazenar mensagens de erro personalizadas.
 */
const errorMessages = {
    required: 'Este campo é obrigatório.',
    minLength: 'Este campo deve ter no mínimo {minLength} caracteres.',
    isEmail: 'Por favor, insira um e-mail válido.',
    custom: 'Este campo não atende aos requisitos personalizados de validação.'
};

/**
 * Função principal para validação de formulário.
 * @param {Array} fields - Uma lista de IDs de campos de formulário a serem validados.
 * @param {Object} validationOptions - Um objeto que mapeia os IDs dos campos para opções de validação.
 * @returns {boolean} - `true` se o formulário for válido, `false` caso contrário.
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
            } else if (options.minLength && value.length < options.minLength) {
                isValid = false;
                displayError(field, errorMessages.minLength.replace('{minLength}', options.minLength));
            } else if (options.customValidation && !options.customValidation(value)) {
                isValid = false;
                displayError(field, errorMessages.custom);
            } else if (options.isEmail && !isEmail(value)) {
                isValid = false;
                displayError(field, errorMessages.isEmail);
            } else {
                // Limpa a mensagem de erro se o campo for válido
                clearError(field);
            }
        }
    });

    return isValid;
}

/**
 * Função auxiliar para validar e-mail.
 * @param {string} email - A string a ser verificada se é um e-mail válido.
 * @returns {boolean} - `true` se o e-mail for válido, `false` caso contrário.
 */
function isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Função para exibir mensagem de erro.
 * @param {string} elementId - O ID do campo de formulário associado ao erro.
 * @param {string} message - A mensagem de erro a ser exibida.
 */
function displayError(elementId, message) {
    const errorElement = document.getElementById(`${elementId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Função para exibir mensagem de erro geral.
 * @param {string} elementId - O ID do elemento associado à mensagem de erro.
 * @param {string} message - A mensagem de erro a ser exibida.
 */
function displayGeneralError(elementId, message) {
    const errorElement = document.getElementById(`${elementId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Função para limpar mensagem de erro.
 * @param {string} elementId - O ID do campo de formulário associado à mensagem de erro a ser limpa.
 */
function clearError(elementId) {
    const errorElement = document.getElementById(`${elementId}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

/**
 * Função para limpar mensagem de erro geral.
 * @param {string} elementId - O ID do elemento associado à mensagem de erro.
 */
function clearGeneralError(elementId) {
    const errorElement = document.getElementById(`${elementId}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}