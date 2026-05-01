package com.petshop.petshop.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // captura ConflitoException e retorna 409
    @ExceptionHandler(ConflitoException.class)
    public ResponseEntity<Map<String, Object>> handleConflito(ConflitoException ex) {
        Map<String, Object> erro = new HashMap<>();
        erro.put("timestamp", LocalDateTime.now());
        erro.put("status", 409);
        erro.put("erro", "Conflito");
        erro.put("mensagem", ex.getMessage());
        erro.put("dica", "Verifique os dados e tente novamente");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(erro);
    }

    // captura NaoEncontradoException e retorna 404
    @ExceptionHandler(NaoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> handleNaoEncontrado(NaoEncontradoException ex) {
        Map<String, Object> erro = new HashMap<>();
        erro.put("timestamp", LocalDateTime.now());
        erro.put("status", 404);
        erro.put("erro", "Não encontrado");
        erro.put("mensagem", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }
}