package com.petshop.petshop.exception;

// exceção lançada quando um recurso não é encontrado no banco
public class NaoEncontradoException extends RuntimeException {
    public NaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}