package com.petshop.petshop.repository;

import com.petshop.petshop.entity.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {

    // busca vendas por cliente
    List<Venda> findByClienteId(Long clienteId);

    // busca vendas por status
    List<Venda> findByStatus(String status);

    // busca vendas por funcionário
    List<Venda> findByFuncionarioId(Long funcionarioId);
}