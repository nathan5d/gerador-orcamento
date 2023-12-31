const budgetNumberInput = document.getElementById('budgetNumber');

budgetNumberInput.value = generateBudgetNumber();

const discountInput = document.getElementById('discount');

function generateBudgetNumber() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString().slice(-2); // Dois dígitos do ano
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Dois dígitos do mês

    // Verifique se já existe um número de orçamento no localStorage
    let currentNumber = localStorage.getItem('budgetNumber');

    // Se não houver um número de orçamento anterior, comece com 1
    if (!currentNumber) {
        currentNumber = 1;
    } else {
        // Caso contrário, incremente o número existente
        currentNumber = parseInt(currentNumber) + 1;
    }

    // Formate o número do orçamento com ano, mês e um número com preenchimento de zeros à esquerda
    const budgetNumber = `${currentYear}${currentMonth}${currentNumber.toString().padStart(3, '0')}`;

    // Salve o novo número no localStorage
    localStorage.setItem('budgetNumber', currentNumber);

    return budgetNumber;
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
}





// Check if there is data in localStorage
const fieldsToSave = ['validityDate', 'title', 'subtitle', 'company', 'jobTitle', 'location', 'phone', 'cnpj', 'email'];
fieldsToSave.forEach(field => {
    const element = document.getElementById(field);

    // Se houver um valor no localStorage, preenche o campo
    if (localStorage.getItem(field)) {
        if (field != 'validityDate') {
            element.value = localStorage.getItem(field) || '';
        }

    }

    // Verifica se há um valor no parâmetro da URL
    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get(field)) {

        let paramValue = urlParams.get(field);
        console.log(paramValue);

        // Salva o valor do parâmetro da URL no localStorage
        localStorage.setItem(field, paramValue);

        // Preenche o campo com o valor atual
        element.value = paramValue;
    }

    // Adiciona um listener de evento de input para salvar no localStorage
    element.addEventListener('input', function () {

        localStorage.setItem(field, this.value);
    });
});

// Set up input masks for price unit and discount fields
const inputMaskOptions = {
    alias: 'numeric',
    radixPoint: ',',
    groupSeparator: '.',
    autoUnmask: true,
};
['item-price-unit'].forEach(fieldId => {
    //   Inputmask('currency', inputMaskOptions).mask(document.getElementById(fieldId));
});

// Set up input masks for price unit and discount fields
const inputMaskOptionsDiscount = {
    alias: 'percentage',
    rightAlign: false, // Alinhar à esquerda para que o símbolo de porcentagem (%) apareça à direita
};
//Inputmask(inputMaskOptionsDiscount).mask(document.getElementById('discount'));



// aplicação de máscaras utilizando jQuery
jQuery(function ($) {
    $('#item-price-unit,#discount').mask('000.000.000,00', { reverse: true });

    var SPMaskBehavior = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
        spOptions = {
            onKeyPress: function (val, e, field, options) {
                field.mask(SPMaskBehavior.apply({}, arguments), options);
            }
        };

    $('.phone').mask(SPMaskBehavior, spOptions);



    var options = {
        onKeyPress: function (cpfcnpj, e, field, options) {
            var masks = ['000.000.000-000', '00.000.000/0000-00'];
            var mask = (cpfcnpj.replace(/\D/g, '').length > 11) ? masks[1] : masks[0];
            $('.cpf-cnpj').mask(mask, options);
        }
    };

    $('.cpf-cnpj').mask('000.000.000-000', options);
});


let discountPercentage = 0;

discountInput.addEventListener('keyup', function () {
    let unmaskedValue = 0;
    if (this.value) {
        console.log('com mascara', this.value);
        unmaskedValue = this.value.replace(/\./g, '').replace(/,/g, '.');

        discountPercentage = parseFloat(unmaskedValue) || 0;
        updateTotal(parseFloat(discountPercentage));
        console.log('teste', discountPercentage);
    } else {
        discountPercentage = 0;
        updateTotal(parseFloat(discountPercentage));

    }
});



// Declare a list of service items
const serviceItems = [];

document.getElementById('add-item').addEventListener('click', function () {
    const description = document.getElementById('item-description').value;
    const quantity = parseFloat(document.getElementById('item-quantity').value) || 0;
    const priceUnit = parseFloat(document.getElementById('item-price-unit').value.replace(/[,.]/g, '')) / 100 || 0;


    const fields = [
        'validityDate',
        'budgetNumber',
        'title',
        'subtitle',
        'company',
        'jobTitle',
        'location',
        'phone',
        'cnpj',
        'email',
        'proposalFor',
        'proposalLocation',
        'proposalEmail',
        'proposalPhone',
        'proposalCPFCNPJ',
        'item-description',
        'item-quantity',
        'item-price-unit'
    ];

    const validationOptions = {
        title: {
            required: true,
            minLength: 3,
            //customValidation: value => value.startsWith('Orç'),
        },
        subtitle: {
            required: true,
            minLength: 3
        },
        company: {
            required: true,
            minLength: 2
        },
        email: {
            required: true,
            isEmail: true,
        },
        // Campos opcionais
        'item-description': {
            required: true,
        },
        'item-quantity': {
            required: true,
        },
        'item-price-unit': {
            required: true,
        },
        // Adicione outras opções de validação para outros campos conforme necessário
    };


    // Specify the desired language (e.g., 'en' for English or 'pt' for Portuguese)
    const language = 'pt';
    const translations = {

        pt: {
            required: 'Este campo é obrigatório.',
            minLength: 'Este campo deve ter no mínimo {minLength} caracteres.',
            isEmail: 'Por favor, insira um e-mail válido.',
            custom: 'Este campo não atende aos requisitos personalizados de validação.'
        },
    };

    const isValid = FormValidator.validateForm(fields, validationOptions, language, translations);

    if (isValid) {


        const serviceItem = {
            description: description,
            quantity: quantity,
            priceUnit: priceUnit
        };

        serviceItems.push(serviceItem);

        document.getElementById('item-description').value = '';
        document.getElementById('item-quantity').value = '';
        document.getElementById('item-price-unit').value = '';

        updateServiceItemsList();
        //updateTotal(parseFloat(document.getElementById('discount').value.replace(',', '.')));
        // updateTotal(parseFloat(document.getElementById('discount'.value.replace(/[,.]/g, ''))));

        // Recupere o valor atual do input discount
        let discountValue = $('#discount').cleanVal(); // Use o método cleanVal para obter apenas os números

        // Verifique se o valor é uma string antes de chamar a função updateTotal
        if (typeof discountValue === 'string') {
            updateTotal(parseFloat(discountValue) / 100); // Divida por 100 para converter centavos
        }

    }


});

function updateServiceItemsList() {
    const itemsContainer = document.getElementById('items-add');
    itemsContainer.innerHTML = '';

    serviceItems.forEach(function (item, index) {
        const listContainer = document.createElement('ul');
        const listItem = document.createElement('li');
        const itemInfo = document.createElement('div');
        itemInfo.innerHTML = `
        <strong>#</strong> ${index + 1}<br>
        <strong>Descrição:</strong> ${item.description}<br>
        <strong>Quantidade:</strong> ${item.quantity}<br>
        <strong>Preço Unitário:</strong> ${item.priceUnit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}<br>
        <strong>Preço Total:</strong> ${(item.quantity * item.priceUnit).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}<br>
    `;

        const removeButton = document.createElement('button');
        removeButton.innerHTML = 'Remover';
        removeButton.className = 'ui button is-danger';
        removeButton.addEventListener('click', function () {

            serviceItems.splice(index, 1);
            updateServiceItemsList();
            updateTotal(parseFloat(document.getElementById('discount').value.replace(',', '.')));
            //updateTotal(parseFloat(discountValue) / 100);


        });

        listItem.appendChild(itemInfo);
        listItem.appendChild(removeButton);
        listContainer.appendChild(listItem);
        itemsContainer.appendChild(listContainer);
    });
}

function updateTotal(discount) {
    if (isNaN(discount)) {

        discount = 0;
    }
    var totalValues = calculateTotal(serviceItems, discount);
    console.log(parseFloat(discount)) //150.000.000,00 imprime 15;
    document.getElementById('subtotal').textContent = totalValues.subtotal;
    document.getElementById('total').textContent = totalValues.total;
    /*
    
        // Remova pontos e vírgulas do valor do desconto antes de converter para número
    
    
        if (isNaN(discount)) {
            discount = 0;
        }
    
        var totalValues = calculateTotal(serviceItems, discount);
       // console.log(discount) // Deve imprimir corretamente agora
        document.getElementById('subtotal').textContent = totalValues.subtotal;
        document.getElementById('total').textContent = totalValues.total;
        */
}


function updateTotalPercent(discountPercent) {
    var totalValues = calculateTotal(serviceItems, discountPercent);
    document.getElementById('subtotal').textContent = totalValues.subtotal;
    document.getElementById('total').textContent = totalValues.total;
}


function calculateTotalPercent(items, discountPercent) {
    let subtotal = 0;
    for (let i = 0; i < items.length; i++) {
        subtotal += items[i].quantity * items[i].priceUnit;
    }

    // Converta o desconto em porcentagem para uma fração (por exemplo, 1,2% para 0,012)
    const discountFraction = discountPercent / 100;
    const discount = subtotal * discountFraction;
    const total = subtotal - discount;

    return {
        subtotal: subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        total: total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    };
}

function calculateTotal(items, discount, log = '') {


    let subtotal = 0;
    for (let i = 0; i < items.length; i++) {
        subtotal += items[i].quantity * items[i].priceUnit;
    }

    const total = subtotal - discount;


    return {
        subtotal: subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        total: total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    };
}


document.getElementById('export-button').addEventListener('click', function () {
    const formData = new FormData(document.getElementById('pdf-form'));
    const budgetData = Object.fromEntries(formData);

    if (serviceItems.length <= 0) {

        FormValidator.displayError('export-button', 'Não existe Produtos/Serviços a serem exibidos.');
        return;

    } else {
        FormValidator.clearError('export-button');
    }



    //var totalValues = {
    //    discount: 0
    //}; // Inicialize o valor de desconto


    const budgetObservations = document.getElementById('observations').value;


    function formatToDDMMYYYY(isoDate) {
        const dateParts = isoDate.split('-'); // Suponhamos que a data está no formato ISO 8601 (yyyy-mm-dd)
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];

        return `${day}/${month}/${year}`;
    }


    //const validityDateInput = document.getElementById('validity-date');
    //const isoDate = validityDateInput.value; // O valor da entrada é "yyyy-mm-dd"







    //let formatedDate = formatToDDMMYYYY(validityDate);
    // validityDate = 'Validade: '+ validityDate : '';


    //budgetData.observations = document.getElementById('observations').value;
    //const budgetDiscount = parseFloat(document.getElementById('discount').value.replace(',', '.')) || 0;

    let discountPercentage = 0;
    if (discountInput.value /* valor é igual a 15.000,00 */) {
        // Remova todos os caracteres não numéricos, exceto pontos e vírgulas

        console.log('com mascara', discountInput.value);
        const unmaskedValue = discountInput.value.replace(/\./g, '').replace(/,/g, '.');

        //const unmaskedValue = discountInput.value.replace('.', '').replace(',', '.');

        console.log('sem mascara', unmaskedValue);
        // Substitua vírgulas por pontos antes de converter para um número
        discountPercentage = parseFloat(unmaskedValue.replace(',', '.')) || 0;
    }

    budgetData.discount = discountPercentage;
    console.log(discountPercentage); // retorna 15



    //budgetData.discount = budgetDiscount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    budgetData.number = budgetNumberInput.value || ''




    /* for (const key in budgetData) {
         if (budgetData.hasOwnProperty(key) && typeof budgetData[key] === 'string') {
            // budgetData[key] = budgetData[key].toUpperCase();
         }
     }*/

    const propertiesToUppercase = ['title', 'subtitle', 'company', 'jobTitle', 'location', 'proposalFor', 'proposalLocation'];

    // Usar um loop for...in para percorrer as propriedades
    for (const key in budgetData) {
        if (budgetData.hasOwnProperty(key)) {
            // Verificar se a propriedade está em propertiesToUppercase
            if (propertiesToUppercase.includes(key)) {
                // Converter para letras maiúsculas se a propriedade existir e não for vazia
                if (budgetData[key]) {
                    budgetData[key] = budgetData[key].toUpperCase();
                } else {
                    budgetData[key] = '';
                }
            } else if (key === 'validityDate' && budgetData[key]) {
                // Manipular 'validityDate' como desejado (por exemplo, formatar)
                const formattedDate = formatToDDMMYYYY(budgetData[key]);
                budgetData[key] = 'Validade: ' + formattedDate;
            } else if (key === 'budgetNumber' && budgetData[key]) {
                // Manipular 'budgetNumber' como desejado
                budgetData[key] = '#' + budgetData[key];
            }
        }
    }


    budgetData.items = serviceItems.map(item => {
        return {
            description: item.description,
            quantity: item.quantity,
            priceUnit: item.priceUnit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            priceTotal: (item.quantity * item.priceUnit).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        };
    });

    //console.log(budgetData);
    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();
    const hora = String(dataAtual.getHours()).padStart(2, '0');
    const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
    const segundos = String(dataAtual.getSeconds()).padStart(2, '0');
    const dataFormatada = `${dia}/${mes}/${ano}`;
    const dataFormatadaHoras = `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;

    //var totalValues = calculateTotal(serviceItems, budgetData.discount);

    //var totalValues = calculateTotal(serviceItems, budgetData.discount, 'export'); // Calcular o total aqui


    //var totalValues = calculateTotal(serviceItems, );
    var totalValues = calculateTotal(serviceItems, parseFloat(budgetData.discount));


    //console.log(totalValues);

    var docDefinition = {
        content: [
            {
                columns: [
                    {
                        text: [
                            { text: budgetData.company + '\n', style: ['header', 'darkText'], fontSize: 32, bold: true, alignment: "left" },
                            { text: budgetData.jobTitle, style: ['subheader', 'darkText'], fontSize: 12, bold: false, alignment: "left" },
                        ]
                    },
                    {
                        text: [
                            { text: budgetData.title + '\n', style: "header", fontSize: 32, bold: true, alignment: "right" },
                            { text: budgetData.subtitle, style: 'subheader', fontSize: 12, bold: false, alignment: "right" },
                        ]
                    }
                ],
            },
            {
                canvas: [
                    {
                        type: 'line',
                        x1: 0,
                        y1: 10,
                        x2: 515,
                        y2: 10,
                        lineWidth: 2,
                        lineColor: '#333'
                    }
                ],
            },
            {
                text: ' '
            },

            {
                columns: [

                    {
                        text: [
                            { text: 'Data: ' + dataFormatada + '\n', alignment: "left", fontSize: 12 },

                        ]
                    },

                    {
                        text: [
                            { text: budgetData.budgetNumber + '\n', alignment: "right", fontSize: 12 },
                        ]
                    },
                ],
            },
            {
                text: [
                    { text: budgetData.validityDate, alignment: "left", fontSize: 12 },
                ]
            },
            /* {
                 canvas: [
                     {
                         type: 'line',
                         x1: 0,
                         y1: 10,
                         x2: 515,
                         y2: 10,
                         lineWidth: 2,
                         lineColor: '#333'
                     }
                 ],
             },
 */
            {
                text: ' '
            },

            {
                columns: [
                    {
                        text: [
                            { text: budgetData.company + '\n', bold: true },
                            { text: budgetData.location + '\n', bold: true },

                            { text: "Email: ", bold: true }, budgetData.email + '\n',
                            { text: "Telefone: ", bold: true }, budgetData.phone + '\n',
                        ]
                    },
                    /*{
                        text: [
                            { text: budgetData.budgetNumber + '\n', alignment: "right", fontSize: 12 },
                            { text: 'Data: ' + dataFormatada + '\n', alignment: "right", fontSize: 12 },

                            { text: budgetData.validityDate, alignment: "right", fontSize: 12 },
                        ]
                    }*/
                ],
            },
            {
                columns: [
                    {
                        text: [
                            //budgetData.cnpj + '\n',
                            //{ text: "Email: ", bold: true }, budgetData.email + '\n',
                            //{ text: "Telefone: ", bold: true }, budgetData.phone + '\n',
                            { text: budgetData.cnpj + '\n' },
                        ]
                    },
                ],
            },
            {
                text: "Cliente:",
                style: "subheader"
            },
            {
                columns: [
                    {
                        text: [
                            { text: budgetData.proposalFor + '\n', bold: true },
                            //{ text: "CPF/CNPJ: ", bold: true }, budgetData.proposalCPFCNPJ + '\n',
                            { text: "Endereço: ", bold: true }, budgetData.proposalLocation + '\n',
                            { text: "Email: ", bold: true }, budgetData.proposalEmail + '\n',
                            { text: "Telefone: ", bold: true }, budgetData.proposalPhone + '\n',
                            { text: "CPF/CNPJ: ", bold: true }, budgetData.proposalCPFCNPJ
                        ]
                    },
                ],
            },
            {
                text: "Descrição:",
                style: "subheader"
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['auto', '*', 80, 80, 80],
                    body: [
                        ["#", "Produto/Serviço", "Quantidade", "Preço Unitário", "Preço Total"],
                        ...budgetData.items.map((item, index) => [index + 1, item.description, item.quantity, item.priceUnit, item.priceTotal])
                    ]
                },
                layout: "lightHorizontalLines"
            },
            {
                text: "SUBTOTAL: " + totalValues.subtotal,
                style: "subtotal",
                alignment: "right",
                //fontSize: 14
            },

            {
                text: "DESCONTO: " + budgetData.discount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                style: "discount",
                alignment: "right",
                //fontSize: 14
            },
            {
                text: "TOTAL: " + totalValues.total,
                style: "total",
                alignment: "right",
                //fontSize: 14
            },

            {
                text: "Observações:",
                alignment: "center",
                color: '#444',
                margin: [0, 10, 0, 5],
                //fontSize: 14
            },
            {
                text: budgetObservations,
                alignment: "center",
                fontSize: 9,
                color: '#444',
                margin: [0, 10, 0, 10],
                //fontSize: 14
            }
        ],
        footer: function (currentPage, pageCount) {
            return {
                text: [
                    { text: budgetData.company + ' - ' + budgetData.phone + ' - ' + budgetData.email + '\n', fontSize: 9, color: '#888', alignment: 'center' },
                    { text: 'Página ' + currentPage.toString() + ' de ' + pageCount, fontSize: 8, color: '#ccc', alignment: 'center' }
                ],
            };
        },
        defaultStyle: {
            font: 'Roboto',
        },
        styles: {
            header: {
                color: "#3e8ed0",
                fontSize: 28,
                bold: true,
                margin: [0, 10, 0, 10]
            },

            subheader: {
                color: "#3e8ed0",
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 10],
            },
            item: {
                margin: [0, 5, 0, 5]
            },
            subtotal: {
                fontSize: 12,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            discount: {
                fontSize: 12,
                color: '#48c78e',
                bold: true,
            },
            total: {
                fontSize: 14,
                bold: true,
                margin: [0, 5, 0, 10]
            },
            darkText: {
                color: "#333",
            }
        }
    };


    const pdfOutput = {
        name: 'ORC-' + (budgetData.budgetNumber ? budgetData.budgetNumber.replace('#', '') : (dataFormatada ? dataFormatada.replace(/\//g, '_') : '')),
        //name: 'ORC-' + (budgetData.budgetNumber.replace('#', ''),
        extension: '.pdf'
    }
    //const pdfName = 'ORC-'+ budgetData.dataAtual.replace('/','') +budgetData.budgetNumber ;
    // pdfMake.createPdf(docDefinition).download("orcamento.pdf");
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    pdfDocGenerator.getBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = pdfOutput.name + pdfOutput.extension; // Nome do arquivo
        a.click();
        URL.revokeObjectURL(url);
    });
});
