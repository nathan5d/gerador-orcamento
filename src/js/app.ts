import jsPDF from 'jspdf';


$(function() {
    console.log('Document ready'); // Verifique se isso é exibido no console

  const $item = $('#item');
  const $descricao = $('#descricao');
  const $quantidade = $('#quantidade');
  const $preco = $('#preco');
  const $adicionarItem = $('#adicionar-item');
  const $tabelaOrcamento = $('#tabela-orcamento');

  $adicionarItem.click(() => {

        console.log('Adicionar item button clicked'); // Verifique se isso é exibido no console

        
    const item = $item.val() as string;
    const descricao = $descricao.val() as string;
    const quantidade = parseFloat($quantidade.val() as string);
    const preco = parseFloat($preco.val() as string);

    if (item && descricao && quantidade && preco) {
      const subtotal = quantidade * preco;
      const $novaLinha = $(`
        <tr>
          <td>${item}</td>
          <td>${descricao}</td>
          <td>${quantidade}</td>
          <td>${preco}</td>
          <td>${subtotal}</td>
          <td><button class="remover-item">Remover</button></td>
        </tr>
      `);

      $tabelaOrcamento.find('tbody').append($novaLinha);

      // Limpa os campos do formulário
      $item.val('');
      $descricao.val('');
      $quantidade.val('');
      $preco.val('');
    }
  });

  // Lidar com a remoção de itens
  $tabelaOrcamento.on('click', '.remover-item', function () {
    $(this).closest('tr').remove();
  });

  $('#gerar-orcamento').click(() => {
    const doc = new jsPDF();
    doc.text('Orçamento Gerado', 10, 10);

    // Adicione os detalhes do orçamento a partir da tabela

    $tabelaOrcamento.find('tbody tr').each(function () {
      const $linha = $(this);
      const item = $linha.find('td:eq(0)').text();
      const descricao = $linha.find('td:eq(1)').text();
      const quantidade = $linha.find('td:eq(2)').text();
      const preco = $linha.find('td:eq(3)').text();
      const subtotal = $linha.find('td:eq(4)').text();

      // Adicione as informações da linha ao documento PDF
      // Exemplo: doc.text(`Item: ${item}, Descrição: ${descricao}, Quantidade: ${quantidade}, Preço: ${preco}, Subtotal: ${subtotal}`);
    });

    doc.save('orcamento.pdf');
  });
});
