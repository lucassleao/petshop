package com.petshop.petshop.controller;

import com.petshop.petshop.entity.Funcionario;
import com.petshop.petshop.service.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// recebe requisições HTTP e responde JSON
@RestController

// URL base: /funcionarios
@RequestMapping("/funcionarios")
public class FuncionarioController {

    // injeta o FuncionarioService automaticamente
    @Autowired
    private FuncionarioService funcionarioService;

    // GET /funcionarios - lista todos
    @GetMapping
    public List<Funcionario> listarTodos() {
        return funcionarioService.listarTodos();
    }

    // GET /funcionarios/{id} - busca por id
    @GetMapping("/{id}")
    public Funcionario buscarPorId(@PathVariable Long id) {
        return funcionarioService.buscarPorId(id);
    }

    // POST /funcionarios - cadastra novo
    @PostMapping
    public Funcionario salvar(@RequestBody Funcionario funcionario) {
        return funcionarioService.salvar(funcionario);
    }

    // PUT /funcionarios/{id} - atualiza
    @PutMapping("/{id}")
    public Funcionario atualizar(@PathVariable Long id, @RequestBody Funcionario funcionario) {
        funcionario.setId(id);
        return funcionarioService.salvar(funcionario);
    }

    // DELETE /funcionarios/{id} - deleta
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        funcionarioService.deletar(id);
    }
}