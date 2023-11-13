// Objeto para armazenar mensagens de erro personalizadas
const errorMessages = {
    required: 'Este campo é obrigatório.',
    minLength: 'Este campo deve ter no mínimo {minLength} caracteres.',
    isEmail: 'Por favor, insira um e-mail válido.',
    custom: 'Este campo não atende aos requisitos personalizados de validação.'
};

// Função principal para validação de formulário
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
            } else if (options.isEmail && !isValidEmail(value)) {
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


// Função auxiliar para validar e-mail
function isValidEmail(email) {
    // Adicione uma lógica de validação de e-mail apropriada aqui
    // Por exemplo, usando expressões regulares
    return true;
}



// Função para verificar se o valor é um e-mail válido
function isEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

// Função para exibir mensagem de erro
function displayError(elementId, message) {
    const errorElement = document.getElementById(`${elementId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Função para limpar mensagem de erro
function clearError(elementId) {
    const errorElement = document.getElementById(`${elementId}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}
