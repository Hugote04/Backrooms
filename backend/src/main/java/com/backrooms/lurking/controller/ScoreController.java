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
     * Leaderboard público: mejores tiempos por usuario, ordenados ASC.
     */
    @GetMapping("/leaderboard")
    public ResponseEntity<List<Score>> leaderboard() {
        return ResponseEntity.ok(scoreService.getLeaderboard());
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
}
