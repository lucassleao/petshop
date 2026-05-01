package com.petshop.petshop.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "produtos")
@Getter
@Setter
public class Produto {

    // chave primária gerada automaticamente
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // nome do produto (ex: Ração Golden Adult)
    @Column(nullable = false)
    private String nome;

    // marca do produto (ex: Royal Canin, Pedigree)
    private String marca;

    // categoria (ex: Alimentação, Higiene, Medicamento)
    @Column(nullable = false)
    private String categoria;

    // descrição detalhada do produto
    private String descricao;

    // pra qual animal é (ex: Cachorro, Gato, Peixe)
    private String especie;

    // unidade de medida (ex: KG, UN, ML)
    private String unidade;

    // peso do produto (ex: 1.0, 5.0, 15.0)
    private Double peso;

    // código de barras pra leitura no caixa
    @Column(unique = true)
    private String codigoBarras;

    // quanto o pet shop pagou pelo produto
    @Column(nullable = false)
    private Double precoCusto;

    // quanto vai cobrar do cliente
    @Column(nullable = false)
    private Double precoVenda;

    // quantidade atual em estoque
    @Column(nullable = false)
    private Integer quantidadeEstoque;

    // quantidade mínima - alerta quando chegar nesse valor
    @Column(nullable = false)
    private Integer estoqueMinimo;

    // fornecedor do produto
    private String fornecedor;
}