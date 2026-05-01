package com.petshop.petshop.repository;

import com.petshop.petshop.entity.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    // busca agendamentos por cliente
    List<Agendamento> findByClienteId(Long clienteId);

    // busca agendamentos por funcionário
    List<Agendamento> findByFuncionarioId(Long funcionarioId);

    // busca agendamentos por status
    List<Agendamento> findByStatus(String status);

    // busca agendamentos por pet
    List<Agendamento> findByPetId(Long petId);

    // verifica se funcionário já tem agendamento nesse horário
    boolean existsByFuncionarioIdAndDataHora(Long funcionarioId, LocalDateTime dataHora);
}