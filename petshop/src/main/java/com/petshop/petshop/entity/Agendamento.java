package com.petshop.petshop.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "agendamentos")
@Getter
@Setter
public class Agendamento {

    // chave primária gerada automaticamente
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // qual pet vai ser atendido
    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    // qual funcionário vai atender
    @ManyToOne
    @JoinColumn(name = "funcionario_id", nullable = false)
    private Funcionario funcionario;

    // cliente dono do pet - facilita notificações
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    // data e hora do atendimento
    // LocalDateTime = data + hora juntos (ex: 2025-01-15T10:00:00)
    @Column(nullable = false)
    private LocalDateTime dataHora;

    // tipo do serviço (ex: Banho, Tosa, Consulta)
    @Column(nullable = false)
    private String tipoServico;

    // observações preenchidas pelo funcionário durante o atendimento
    private String observacoes;

    // status do agendamento
    // AGENDADO → EM_ANDAMENTO → CONCLUIDO ou CANCELADO
    @Column(nullable = false)
    private String status = "AGENDADO";
}