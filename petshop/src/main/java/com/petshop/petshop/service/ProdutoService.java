package com.petshop.petshop.service;

import com.petshop.petshop.entity.Produto;
import com.petshop.petshop.exception.NaoEncontradoException;
import com.petshop.petshop.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    // injeta o ProdutoRepository automaticamente
    @Autowired
    private ProdutoRepository produtoRepository;

    // retorna todos os produtos
    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    // salva ou atualiza um produto
    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

    // busca por id
    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoException("Produto não encontrado: " + id));
    }

    // busca por categoria
    public List<Produto> buscarPorCategoria(String categoria) {
        return produtoRepository.findByCategoria(categoria);
    }

    // busca por especie
    public List<Produto> buscarPorEspecie(String especie) {
        return produtoRepository.findByEspecie(especie);
    }

    // busca por nome
    public List<Produto> buscarPorNome(String nome) {
        return produtoRepository.findByNomeContainingIgnoreCase(nome);
    }

    // busca por código de barras
    public Produto buscarPorCodigoBarras(String codigoBarras) {
        return produtoRepository.findByCodigoBarras(codigoBarras);
    }

    // alerta produtos com estoque baixo
    public List<Produto> alertaEstoqueBaixo() {
        return produtoRepository.findByQuantidadeEstoqueLessThanEqual(5);
    }

    // adiciona estoque
    public Produto adicionarEstoque(Long id, Integer quantidade) {
        Produto produto = buscarPorId(id);
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + quantidade);
        return produtoRepository.save(produto);
    }

    // remove estoque - usado na venda
    public Produto removerEstoque(Long id, Integer quantidade) {
        Produto produto = buscarPorId(id);
        if (produto.getQuantidadeEstoque() < quantidade) {
            throw new RuntimeException("Estoque insuficiente! Disponível: " + produto.getQuantidadeEstoque());
        }
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - quantidade);
        return produtoRepository.save(produto);
    }

    // deleta um produto
    public void deletar(Long id) {
        produtoRepository.deleteById(id);
    }
}