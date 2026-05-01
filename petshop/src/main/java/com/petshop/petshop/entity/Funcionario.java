package com.petshop.petshop.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "funcionarios")
@Getter
@Setter
public class Funcionario {

    // chave primária gerada automaticamente
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // nome do funcionário - obrigatório
    @Column(nullable = false)
    private String nome;

    // cargo do funcionário (ex: Veterinário, Tosador, Banhista)
    @Column(nullable = false)
    private String cargo;

    // telefone do funcionário
    private String telefone;

    // email único - não pode repetir
    @Column(unique = true)
    private String email;
}