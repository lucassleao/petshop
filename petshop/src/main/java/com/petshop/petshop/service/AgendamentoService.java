package com.petshop.petshop.service;

import com.petshop.petshop.entity.Agendamento;
import com.petshop.petshop.exception.ConflitoException;
import com.petshop.petshop.repository.AgendamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgendamentoService {

    // injeta o AgendamentoRepository automaticamente
    @Autowired
    private AgendamentoRepository agendamentoRepository;

    // retorna todos os agendamentos
    public List<Agendamento> listarTodos() {
        return agendamentoRepository.findAll();
    }

    // salva um agendamento - verifica conflito de horário antes
    public Agendamento salvar(Agendamento agendamento) {
        // só verifica conflito em agendamentos novos (sem id)
        if (agendamento.getId() == null) {
            boolean conflito = agendamentoRepository.existsByFuncionarioIdAndDataHora(
                    agendamento.getFuncionario().getId(),
                    agendamento.getDataHora()
            );
            // se o funcionário já tem agendamento nesse horário, bloqueia
            if (conflito) {
                throw new ConflitoException("Horário indisponível! O funcionário já possui um agendamento às " + agendamento.getDataHora());
            }
        }
        return agendamentoRepository.save(agendamento);
    }

    // busca por id
    public Agendamento buscarPorId(Long id) {
        return agendamentoRepository.findById(id).orElse(null);
    }

    // busca agendamentos de um cliente
    public List<Agendamento> buscarPorCliente(Long clienteId) {
        return agendamentoRepository.findByClienteId(clienteId);
    }

    // busca agendamentos de um funcionário
    public List<Agendamento> buscarPorFuncionario(Long funcionarioId) {
        return agendamentoRepository.findByFuncionarioId(funcionarioId);
    }

    // busca agendamentos por status
    public List<Agendamento> buscarPorStatus(String status) {
        return agendamentoRepository.findByStatus(status);
    }

    // funcionário atualiza observações e status durante o atendimento
    public Agendamento atualizarAtendimento(Long id, String observacoes, String status) {
        Agendamento agendamento = agendamentoRepository.findById(id).orElse(null);
        if (agendamento != null) {
            agendamento.setObservacoes(observacoes);
            agendamento.setStatus(status);
            return agendamentoRepository.save(agendamento);
        }
        return null;
    }

    // deleta um agendamento
    public void deletar(Long id) {
        agendamentoRepository.deleteById(id);
    }
}