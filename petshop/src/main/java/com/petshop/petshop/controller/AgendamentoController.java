package com.petshop.petshop.controller;

import com.petshop.petshop.entity.Agendamento;
import com.petshop.petshop.service.AgendamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    // injeta o AgendamentoService automaticamente
    @Autowired
    private AgendamentoService agendamentoService;

    // GET /agendamentos - lista todos
    @GetMapping
    public List<Agendamento> listarTodos() {
        return agendamentoService.listarTodos();
    }

    // GET /agendamentos/{id} - busca por id
    @GetMapping("/{id}")
    public Agendamento buscarPorId(@PathVariable Long id) {
        return agendamentoService.buscarPorId(id);
    }

    // GET /agendamentos/cliente/{id} - agendamentos de um cliente
    @GetMapping("/cliente/{clienteId}")
    public List<Agendamento> buscarPorCliente(@PathVariable Long clienteId) {
        return agendamentoService.buscarPorCliente(clienteId);
    }

    // GET /agendamentos/funcionario/{id} - agendamentos de um funcionário
    @GetMapping("/funcionario/{funcionarioId}")
    public List<Agendamento> buscarPorFuncionario(@PathVariable Long funcionarioId) {
        return agendamentoService.buscarPorFuncionario(funcionarioId);
    }

    // GET /agendamentos/status/{status} - filtra por status
    @GetMapping("/status/{status}")
    public List<Agendamento> buscarPorStatus(@PathVariable String status) {
        return agendamentoService.buscarPorStatus(status);
    }

    // POST /agendamentos - cria novo agendamento
    @PostMapping
    public Agendamento salvar(@RequestBody Agendamento agendamento) {
        return agendamentoService.salvar(agendamento);
    }

    // PUT /agendamentos/{id} - atualiza agendamento completo
    @PutMapping("/{id}")
    public Agendamento atualizar(@PathVariable Long id, @RequestBody Agendamento agendamento) {
        agendamento.setId(id);
        return agendamentoService.salvar(agendamento);
    }

    // PATCH /agendamentos/{id}/atendimento - funcionário atualiza observações e status
    @PatchMapping("/{id}/atendimento")
    public Agendamento atualizarAtendimento(@PathVariable Long id,
                                            @RequestParam String observacoes,
                                            @RequestParam String status) {
        return agendamentoService.atualizarAtendimento(id, observacoes, status);
    }

    // DELETE /agendamentos/{id} - deleta
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        agendamentoService.deletar(id);
    }
}