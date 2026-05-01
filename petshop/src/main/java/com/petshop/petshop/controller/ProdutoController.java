package com.petshop.petshop.controller;

import com.petshop.petshop.entity.Produto;
import com.petshop.petshop.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    // injeta o ProdutoService automaticamente
    @Autowired
    private ProdutoService produtoService;

    // GET /produtos - lista todos
    @GetMapping
    public List<Produto> listarTodos() {
        return produtoService.listarTodos();
    }

    // GET /produtos/{id} - busca por id
    @GetMapping("/{id}")
    public Produto buscarPorId(@PathVariable Long id) {
        return produtoService.buscarPorId(id);
    }

    // GET /produtos/categoria/{categoria} - filtra por categoria
    @GetMapping("/categoria/{categoria}")
    public List<Produto> buscarPorCategoria(@PathVariable String categoria) {
        return produtoService.buscarPorCategoria(categoria);
    }

    // GET /produtos/especie/{especie} - filtra por especie
    @GetMapping("/especie/{especie}")
    public List<Produto> buscarPorEspecie(@PathVariable String especie) {
        return produtoService.buscarPorEspecie(especie);
    }

    // GET /produtos/buscar?nome=racao - busca por nome
    @GetMapping("/buscar")
    public List<Produto> buscarPorNome(@RequestParam String nome) {
        return produtoService.buscarPorNome(nome);
    }

    // GET /produtos/codigo/{codigoBarras} - busca por código de barras
    @GetMapping("/codigo/{codigoBarras}")
    public Produto buscarPorCodigoBarras(@PathVariable String codigoBarras) {
        return produtoService.buscarPorCodigoBarras(codigoBarras);
    }

    // GET /produtos/estoque-baixo - alerta de estoque baixo
    @GetMapping("/estoque-baixo")
    public List<Produto> alertaEstoqueBaixo() {
        return produtoService.alertaEstoqueBaixo();
    }

    // POST /produtos - cadastra novo produto
    @PostMapping
    public Produto salvar(@RequestBody Produto produto) {
        return produtoService.salvar(produto);
    }

    // PUT /produtos/{id} - atualiza produto
    @PutMapping("/{id}")
    public Produto atualizar(@PathVariable Long id, @RequestBody Produto produto) {
        produto.setId(id);
        return produtoService.salvar(produto);
    }

    // PATCH /produtos/{id}/adicionar-estoque - adiciona estoque
    @PatchMapping("/{id}/adicionar-estoque")
    public Produto adicionarEstoque(@PathVariable Long id, @RequestParam Integer quantidade) {
        return produtoService.adicionarEstoque(id, quantidade);
    }

    // DELETE /produtos/{id} - deleta produto
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        produtoService.deletar(id);
    }
}