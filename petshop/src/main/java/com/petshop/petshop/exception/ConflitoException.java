package com.petshop.petshop.exception;

// exceção lançada quando há conflito (ex: horário ocupado, CPF duplicado)
public class ConflitoException extends RuntimeException {
    public ConflitoException(String mensagem) {
        super(mensagem);
    }
}