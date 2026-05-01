package com.petshop.petshop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "clientes")
@Getter
@Setter
public class Cliente {

    // chave primária gerada automaticamente
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // nome do cliente - obrigatório
    @Column(nullable = false)
    private String nome;

    // CPF único - não pode repetir
    @Column(nullable = false, unique = true)
    private String cpf;

    // email único - não pode repetir
    @Column(nullable = false, unique = true)
    private String email;

    // telefone do cliente
    private String telefone;

    // um cliente pode ter muitos pets
    // mappedBy = "cliente" indica que o lado dono do relacionamento é o Pet
    // @JsonIgnore evita loop infinito na conversão pra JSON
    @OneToMany(mappedBy = "cliente")
    @JsonIgnore
    private List<Pet> pets;
}