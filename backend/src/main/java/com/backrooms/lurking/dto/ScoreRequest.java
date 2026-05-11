package com.backrooms.lurking.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ScoreRequest {

    @NotBlank
    @Size(max = 100)
    private String userName;

    @NotBlank
    @Size(max = 100)
    private String nivel;

    @Min(1)
    private int tiempoSegundos;

    @Min(0)
    private int puzlesResueltos;

    // Se rellena desde el JWT en el controlador
    private String userId;
}
