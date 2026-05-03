package com.petshop.petshop.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vendas")
@Getter
@Setter
public class Venda {

    // chave primária gerada automaticamente
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // cliente que está comprando
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // funcionário que realizou a venda
    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionario funcionario;

    // data e hora da venda
    @Column(nullable = false)
    private LocalDateTime dataHora;

    // status da venda: ABERTA, FINALIZADA, CANCELADA
    @Column(nullable = false)
    private String status = "ABERTA";

    // forma de pagamento: DINHEIRO, CARTAO, PIX
    private String formaPagamento;

    // valor total da venda calculado automaticamente
    @Column(nullable = false)
    private Double total = 0.0;

    // observações da venda
    private String observacoes;

    // lista de itens da venda
    // cascade = operações na venda refletem nos itens
    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL)
    private List<ItemVenda> itens;
}