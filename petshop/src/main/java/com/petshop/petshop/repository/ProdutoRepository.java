package com.petshop.petshop.repository;

import com.petshop.petshop.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // busca por categoria (ex: Alimentação, Higiene)
    List<Produto> findByCategoria(String categoria);

    // busca por especie (ex: Cachorro, Gato)
    List<Produto> findByEspecie(String especie);

    // busca por nome contendo o texto digitado
    List<Produto> findByNomeContainingIgnoreCase(String nome);

    // busca produtos com estoque abaixo do mínimo
    List<Produto> findByQuantidadeEstoqueLessThanEqual(Integer estoqueMinimo);

    // busca por código de barras
    Produto findByCodigoBarras(String codigoBarras);
}