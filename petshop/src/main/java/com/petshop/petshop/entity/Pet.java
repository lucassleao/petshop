package com.petshop.petshop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "pets")
@Getter
@Setter
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // cliente dono do pet - obrigatório
    @NotNull(message = "Cliente é obrigatório")
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    // nome do pet - obrigatório
    @NotBlank(message = "Nome do pet é obrigatório")
    @Size(min = 2, max = 50, message = "Nome deve ter entre 2 e 50 caracteres")
    @Column(nullable = false)
    private String nome;

    // espécie - obrigatório
    @NotBlank(message = "Espécie é obrigatória")
    @Column(nullable = false)
    private String especie;

    // raça - opcional
    private String raca;

    // peso - deve ser positivo
    @Positive(message = "Peso deve ser maior que zero")
    private Double peso;

    // lista de agendamentos do pet
    @OneToMany(mappedBy = "pet")
    @JsonIgnore
    private List<Agendamento> agendamentos;
}