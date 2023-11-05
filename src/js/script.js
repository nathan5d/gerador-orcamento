$(document).ready(function () {
    const $item = $('#item');
    const $descricao = $('#descricao');
    const $quantidade = $('#quantidade');
    const $preco = $('#preco');
    const $adicionarItem = $('#adicionar-item');
    const $tabelaOrcamento = $('#tabela-orcamento');
  
    $adicionarItem.click(function () {
      const item = $item.val();
      const descricao = $descricao.val();
      const quantidade = parseFloat($quantidade.val());
      const preco = parseFloat($preco.val());
  
      if (item && descricao && !isNaN(quantidade) && !isNaN(preco)) {
        const subtotal = quantidade * preco;
        const novaLinha = `
          <tr>
            <td>${item}</td>
            <td>${descricao}</td>
            <td>${quantidade}</td>
            <td>${preco}</td>
            <td>${subtotal}</td>
            <td><button class="remover-item">Remover</button></td>
          </tr>
        `;
  
        $tabelaOrcamento.find('tbody').append(novaLinha);
  
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
  
    $('#gerar-orcamento').click(function () {
      const doc = new jsPDF();
      doc.text('Orçamento Gerado', 10, 10);
  
      // Adicione os detalhes do orçamento a partir da tabela
  
      $tabelaOrcamento.find('tbody tr').each(function () {
        const $linha = $(this);
        const item = $linha.find('td:eq(0)').text();
        const descricao = $linha.find('td:eq(1)').text();
        const quantidade = parseFloat($linha.find('td:eq(2)').text());
        const preco = parseFloat($linha.find('td:eq(3)').text());
        const subtotal = parseFloat($linha.find('td:eq(4)').text());
  
        // Adicione as informações da linha ao documento PDF
        doc.text(`Item: ${item}, Descrição: ${descricao}, Quantidade: ${quantidade}, Preço: ${preco}, Subtotal: ${subtotal}`);
      });
  
      doc.save('orcamento.pdf');
    });
  });
  