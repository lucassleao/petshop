package com.petshop.petshop.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "pets")
@Getter
@Setter
public class Pet {

    // chave primária gerada automaticamente
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // nome do pet - obrigatório
    @Column(nullable = false)
    private String nome;

    // espécie do animal (ex: cachorro, gato)
    @Column(nullable = false)
    private String especie;

    // raça do animal (ex: labrador, persa)
    private String raca;

    // peso em kg
    private Double peso;

    // @ManyToOne = muitos pets podem pertencer a um cliente
    // um cliente pode ter vários pets, mas cada pet tem só um dono
    @ManyToOne
    // @JoinColumn = define a coluna de chave estrangeira na tabela pets
    // vai criar uma coluna "cliente_id" que referencia a tabela clientes
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;
}