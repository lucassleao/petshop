package com.petshop.petshop.service;

import com.petshop.petshop.entity.Pet;
import com.petshop.petshop.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetService {

    // injeta o PetRepository automaticamente
    @Autowired
    private PetRepository petRepository;

    // retorna todos os pets do banco
    public List<Pet> listarTodos() {
        return petRepository.findAll();
    }

    // salva ou atualiza um pet
    public Pet salvar(Pet pet) {
        return petRepository.save(pet);
    }

    // busca um pet pelo id, retorna null se não encontrar
    public Pet buscarPorId(Long id) {
        return petRepository.findById(id).orElse(null);
    }

    // deleta um pet pelo id
    public void deletar(Long id) {
        petRepository.deleteById(id);
    }
}