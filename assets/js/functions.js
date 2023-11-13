// validationFramework.js

// Função para aplicar validações genéricas
function applyValidation(options) {
    $(function () {
        Object.keys(options).forEach(function (fieldId) {
            var input = $('#' + fieldId);
            var error = $('.' + fieldId + '-error');

            input.on('input', function () {
                var value = $(this).val();
                var isValid = options[fieldId].validate(value);

                if (isValid) {
                    input.removeClass('is-danger');
                    error.hide();
                } else {
                    input.addClass('is-danger');
                    error.show();
                }
            });
        });
    });
}

// Exemplo de função para validar CPF
function validateCpf(value) {
    // Implemente a lógica de validação de CPF aqui
    // Retorna true se válido, false caso contrário
    return true;
}

// Exemplo de função para validar email
function validateEmail(value) {
    // Implemente a lógica de validação de email aqui
    // Retorna true se válido, false caso contrário
    return /\S+@\S+\.\S+/.test(value);
}

// Exemplo de função para validar número
function validateNumber(value) {
    // Implemente a lógica de validação de número aqui
    // Retorna true se válido, false caso contrário
    return !isNaN(value);
}
