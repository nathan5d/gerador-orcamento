
jQuery(function($){
    $("#export-button").on('click',()=>{
        console.log('tst')
    });

    // Crie uma instância de jsPDF
    const doc = new jsPDF();

    // Selecione o elemento HTML que deseja exportar (por exemplo, toda a página)
    const element = document.documentElement;

    // Gere o PDF
    doc.html(element, {
        callback: function (pdf) {
            // Salve o PDF
            pdf.save('pagina.pdf');
        },
        x: 10,
        y: 10,
    });
})