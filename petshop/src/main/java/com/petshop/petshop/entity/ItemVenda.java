package com.petshop.petshop.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "itens_venda")
@Getter
@Setter
public class ItemVenda {

    // chave primária gerada automaticamente
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // venda a qual esse item pertence
    @ManyToOne
    @JoinColumn(name = "venda_id", nullable = false)
    private Venda venda;

    // produto que foi vendido
    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    // quantidade do produto vendido
    @Column(nullable = false)
    private Integer quantidade;

    // preço unitário no momento da venda
    // guardamos o preço na hora da venda porque o preço do produto pode mudar depois
    @Column(nullable = false)
    private Double precoUnitario;

    // subtotal desse item (quantidade * precoUnitario)
    @Column(nullable = false)
    private Double subtotal;
}