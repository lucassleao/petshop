package com.petshop.petshop.service;

import com.petshop.petshop.entity.ItemVenda;
import com.petshop.petshop.entity.Produto;
import com.petshop.petshop.entity.Venda;
import com.petshop.petshop.exception.NaoEncontradoException;
import com.petshop.petshop.repository.ItemVendaRepository;
import com.petshop.petshop.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ItemVendaRepository itemVendaRepository;

    @Autowired
    private ProdutoService produtoService;

    // abre uma nova venda
    public Venda abrirVenda(Venda venda) {
        venda.setDataHora(LocalDateTime.now());
        venda.setStatus("ABERTA");
        venda.setTotal(0.0);
        return vendaRepository.save(venda);
    }

    // adiciona item na venda
    public Venda adicionarItem(Long vendaId, Long produtoId, Integer quantidade) {
        Venda venda = buscarPorId(vendaId);

        if (!venda.getStatus().equals("ABERTA"))
            throw new RuntimeException("Venda não está aberta!");

        Produto produto = produtoService.buscarPorId(produtoId);

        if (produto.getQuantidadeEstoque() < quantidade)
            throw new RuntimeException("Estoque insuficiente! Disponível: " + produto.getQuantidadeEstoque());

        // cria o item
        ItemVenda item = new ItemVenda();
        item.setVenda(venda);
        item.setProduto(produto);
        item.setQuantidade(quantidade);
        item.setPrecoUnitario(produto.getPrecoVenda());
        item.setSubtotal(produto.getPrecoVenda() * quantidade);
        itemVendaRepository.save(item);

        // atualiza o total da venda
        venda.setTotal(venda.getTotal() + item.getSubtotal());
        return vendaRepository.save(venda);
    }

    // finaliza a venda e baixa o estoque
    public Venda finalizarVenda(Long vendaId, String formaPagamento) {
        Venda venda = buscarPorId(vendaId);

        if (!venda.getStatus().equals("ABERTA"))
            throw new RuntimeException("Venda não está aberta!");

        if (venda.getItens() == null || venda.getItens().isEmpty())
            throw new RuntimeException("Venda não possui itens!");

        // baixa o estoque de cada item
        for (ItemVenda item : venda.getItens()) {
            produtoService.removerEstoque(item.getProduto().getId(), item.getQuantidade());
        }

        venda.setStatus("FINALIZADA");
        venda.setFormaPagamento(formaPagamento);
        return vendaRepository.save(venda);
    }

    // cancela a venda
    public Venda cancelarVenda(Long vendaId) {
        Venda venda = buscarPorId(vendaId);
        if (venda.getStatus().equals("FINALIZADA"))
            throw new RuntimeException("Venda finalizada não pode ser cancelada!");
        venda.setStatus("CANCELADA");
        return vendaRepository.save(venda);
    }

    // busca por id
    public Venda buscarPorId(Long id) {
        return vendaRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoException("Venda não encontrada: " + id));
    }

    // lista todas as vendas
    public List<Venda> listarTodas() {
        return vendaRepository.findAll();
    }

    // lista vendas por cliente
    public List<Venda> listarPorCliente(Long clienteId) {
        return vendaRepository.findByClienteId(clienteId);
    }

    // lista vendas abertas
    public List<Venda> listarAbertas() {
        return vendaRepository.findByStatus("ABERTA");
    }
}