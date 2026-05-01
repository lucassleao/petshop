package com.petshop.petshop.controller;

import com.petshop.petshop.entity.Cliente;
import com.petshop.petshop.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// @RestController = essa classe recebe requisições HTTP e responde JSON
// combina @Controller + @ResponseBody
@RestController

// @RequestMapping = define a URL base de todos os endpoints dessa classe
// todos vão começar com /clientes
@RequestMapping("/clientes")
public class ClienteController {

    // injeta o ClienteService automaticamente (injeção de dependência)
    @Autowired
    private ClienteService clienteService;

    // @GetMapping = responde requisições GET
    // URL: GET http://localhost:8080/clientes
    // usado pra LISTAR dados
    @GetMapping
    public List<Cliente> listarTodos() {
        return clienteService.listarTodos(); // chama o service que chama o repository
    }

    // @GetMapping("/{id}") = GET com parâmetro na URL
    // URL: GET http://localhost:8080/clientes/1
    // @PathVariable = pega o {id} da URL e coloca na variável id
    @GetMapping("/{id}")
    public Cliente buscarPorId(@PathVariable Long id) {
        return clienteService.buscarPorId(id);
    }

    // @PostMapping = responde requisições POST
    // URL: POST http://localhost:8080/clientes
    // usado pra CRIAR dados
    // @RequestBody = pega o JSON do corpo da requisição e transforma em objeto Cliente
    @PostMapping
    public Cliente salvar(@RequestBody Cliente cliente) {
        return clienteService.salvar(cliente);
    }

    // @PutMapping = responde requisições PUT
    // URL: PUT http://localhost:8080/clientes/1
    // usado pra ATUALIZAR dados
    @PutMapping("/{id}")
    public Cliente atualizar(@PathVariable Long id, @RequestBody Cliente cliente) {
        cliente.setId(id); // garante que vai atualizar o cliente certo
        return clienteService.salvar(cliente);
    }

    // @DeleteMapping = responde requisições DELETE
    // URL: DELETE http://localhost:8080/clientes/1
    // usado pra DELETAR dados
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        clienteService.deletar(id);
    }
}