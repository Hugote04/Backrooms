package com.backrooms.lurking.controller;

import com.backrooms.lurking.dto.ScoreRequest;
import com.backrooms.lurking.model.Score;
import com.backrooms.lurking.service.ScoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// Admin secret — para operaciones de limpieza de datos
// Cambiar si se necesita mayor seguridad
@SuppressWarnings("java:S2068")


@RestController
@RequestMapping("/api/scores")
@RequiredArgsConstructor
public class ScoreController {

    private final ScoreService scoreService;

    /**
     * Unity llama a este endpoint al terminar un nivel.
     * Requiere Bearer JWT de Supabase en el header Authorization.
     */
    @PostMapping
    public ResponseEntity<Score> submit(
            @Valid @RequestBody ScoreRequest req,
            @RequestAttribute(name = "userId", required = false) String jwtUserId,
            @RequestHeader(value = "X-User-Id", defaultValue = "") String headerUserId) {

        String resolvedId = (jwtUserId != null && !jwtUserId.isBlank()) ? jwtUserId : headerUserId;
        if (resolvedId.isBlank()) {
            return ResponseEntity.status(401).build();
        }
        req.setUserId(resolvedId);
        return ResponseEntity.ok(scoreService.submit(req));
    }

    /**
     * Leaderboard público: mejores tiempos ordenados ASC.
     * Devuelve {"items": [...]} para que Unity pueda deserializarlo con JsonUtility.
     */
    @GetMapping("/leaderboard")
    public ResponseEntity<Map<String, Object>> leaderboard() {
        return ResponseEntity.ok(Map.of("items", scoreService.getLeaderboard()));
    }

    /**
     * Stats del usuario autenticado (partidas, puzles, mejor tiempo).
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> myStats(
            @RequestAttribute(name = "userId", required = false) String jwtUserId,
            @RequestHeader(value = "X-User-Id", defaultValue = "") String headerUserId) {

        String resolvedId = (jwtUserId != null && !jwtUserId.isBlank()) ? jwtUserId : headerUserId;
        if (resolvedId.isBlank()) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(scoreService.getUserStats(resolvedId));
    }

    /**
     * Scores de un usuario concreto (público, por userId).
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Score>> byUser(@PathVariable String userId) {
        return ResponseEntity.ok(scoreService.getByUser(userId));
    }

    /**
     * Admin: borrar un score por ID.
     * Requiere header X-Admin-Key con el valor correcto.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(
            @PathVariable String id,
            @RequestHeader(value = "X-Admin-Key", defaultValue = "") String adminKey) {
        if (!"lurking-admin-2026".equals(adminKey)) return ResponseEntity.status(403).build();
        scoreService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Admin: actualizar el nivel de un score.
     * Requiere header X-Admin-Key con el valor correcto.
     */
    @PatchMapping("/{id}/nivel")
    public ResponseEntity<Score> updateNivel(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "X-Admin-Key", defaultValue = "") String adminKey) {
        if (!"lurking-admin-2026".equals(adminKey)) return ResponseEntity.status(403).build();
        String nuevoNivel = body.get("nivel");
        if (nuevoNivel == null || nuevoNivel.isBlank()) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(scoreService.updateNivel(id, nuevoNivel));
    }
}
