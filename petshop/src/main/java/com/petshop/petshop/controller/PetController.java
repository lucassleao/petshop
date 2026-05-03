package com.petshop.petshop.controller;

import com.petshop.petshop.entity.Pet;
import com.petshop.petshop.service.PetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pet")
public class PetController {

    @Autowired
    private PetService petService;

    @GetMapping
    public List<Pet> listarTodos() {
        return petService.listarTodos();
    }

    @GetMapping("/{id}")
    public Pet buscarPorId(@PathVariable Long id) {
        return petService.buscarPorId(id);
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Pet> listarPorCliente(@PathVariable Long clienteId) {
        return petService.listarPorCliente(clienteId);
    }

    // @Valid = ativa as validações antes de processar
    @PostMapping
    public Pet salvar(@Valid @RequestBody Pet pet) {
        return petService.salvar(pet);
    }

    // @Valid = ativa as validações antes de processar
    @PutMapping("/{id}")
    public Pet atualizar(@PathVariable Long id, @Valid @RequestBody Pet pet) {
        pet.setId(id);
        return petService.salvar(pet);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        petService.deletar(id);
    }
}