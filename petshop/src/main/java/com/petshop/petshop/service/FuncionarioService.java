package com.petshop.petshop.service;

import com.petshop.petshop.entity.Funcionario;
import com.petshop.petshop.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuncionarioService {

    // injeta o FuncionarioRepository automaticamente
    @Autowired
    private FuncionarioRepository funcionarioRepository;

    // retorna todos os funcionários do banco
    public List<Funcionario> listarTodos() {
        return funcionarioRepository.findAll();
    }

    // salva ou atualiza um funcionário
    public Funcionario salvar(Funcionario funcionario) {
        return funcionarioRepository.save(funcionario);
    }

    // busca um funcionário pelo id
    public Funcionario buscarPorId(Long id) {
        return funcionarioRepository.findById(id).orElse(null);
    }

    // deleta um funcionário pelo id
    public void deletar(Long id) {
        funcionarioRepository.deleteById(id);
    }
}