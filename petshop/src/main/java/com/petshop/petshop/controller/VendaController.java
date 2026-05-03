package com.petshop.petshop.controller;

import com.petshop.petshop.entity.Venda;
import com.petshop.petshop.service.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendas")
public class VendaController {

    @Autowired
    private VendaService vendaService;

    // GET /vendas - lista todas
    @GetMapping
    public List<Venda> listarTodas() {
        return vendaService.listarTodas();
    }

    // GET /vendas/abertas - lista vendas abertas
    @GetMapping("/abertas")
    public List<Venda> listarAbertas() {
        return vendaService.listarAbertas();
    }

    // GET /vendas/{id} - busca por id
    @GetMapping("/{id}")
    public Venda buscarPorId(@PathVariable Long id) {
        return vendaService.buscarPorId(id);
    }

    // GET /vendas/cliente/{id} - vendas de um cliente
    @GetMapping("/cliente/{clienteId}")
    public List<Venda> listarPorCliente(@PathVariable Long clienteId) {
        return vendaService.listarPorCliente(clienteId);
    }

    // POST /vendas - abre nova venda
    @PostMapping
    public Venda abrirVenda(@RequestBody Venda venda) {
        return vendaService.abrirVenda(venda);
    }

    // POST /vendas/{id}/itens - adiciona item na venda
    @PostMapping("/{id}/itens")
    public Venda adicionarItem(@PathVariable Long id,
                               @RequestParam Long produtoId,
                               @RequestParam Integer quantidade) {
        return vendaService.adicionarItem(id, produtoId, quantidade);
    }

    // POST /vendas/{id}/finalizar - finaliza a venda
    @PostMapping("/{id}/finalizar")
    public Venda finalizar(@PathVariable Long id,
                           @RequestParam String formaPagamento) {
        return vendaService.finalizarVenda(id, formaPagamento);
    }

    // POST /vendas/{id}/cancelar - cancela a venda
    @PostMapping("/{id}/cancelar")
    public Venda cancelar(@PathVariable Long id) {
        return vendaService.cancelarVenda(id);
    }
}