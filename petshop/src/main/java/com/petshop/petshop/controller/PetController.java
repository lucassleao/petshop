package com.petshop.petshop.controller;

import com.petshop.petshop.entity.Pet;
import com.petshop.petshop.service.PetService;
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
    // POST /pet - cadastrar novo pet
    @PostMapping
    public Pet salvar(@RequestBody Pet pet) {
        return petService.salvar(pet);
    }

    // PUT /pet/{id} - atualizar pet
    @PutMapping("/{id}")
    public Pet atualizar(@PathVariable Long id, @RequestBody Pet pet) {
        pet.setId(id);
        return petService.salvar(pet);
    }

    // DELETE /pet/{id} - deletar pet
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        petService.deletar(id);
    }
}

