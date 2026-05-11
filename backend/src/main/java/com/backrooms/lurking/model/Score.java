package com.backrooms.lurking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "scores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "user_name", nullable = false)
    @NotBlank
    @Size(max = 100)
    private String userName;

    @Column(nullable = false)
    @NotBlank
    @Size(max = 100)
    private String nivel;

    @Column(name = "tiempo_segundos", nullable = false)
    @Min(1)
    private int tiempoSegundos;

    @Column(name = "puzles_resueltos", nullable = false)
    @Min(0)
    private int puzlesResueltos;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
