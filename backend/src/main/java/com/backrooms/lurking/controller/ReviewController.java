package com.backrooms.lurking.controller;

import com.backrooms.lurking.dto.ReviewRequest;
import com.backrooms.lurking.model.Review;
import com.backrooms.lurking.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<Review>> getAll() {
        return ResponseEntity.ok(reviewService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getById(@PathVariable String id) {
        return ResponseEntity.ok(reviewService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Review> create(
            @Valid @RequestBody ReviewRequest req,
            @RequestAttribute(name = "userId", required = false) String jwtUserId,
            @RequestHeader(value = "X-User-Id", defaultValue = "") String headerUserId) {

        // Prioridad: JWT > header > body (fallback para clientes sin JWT)
        String resolvedId = (jwtUserId != null && !jwtUserId.isBlank()) ? jwtUserId : headerUserId;
        if (resolvedId.isBlank() && req.getUserId() != null && !req.getUserId().isBlank()) {
            resolvedId = req.getUserId();
        }
        req.setUserId(resolvedId.isBlank() ? "anonymous" : resolvedId);
        return ResponseEntity.ok(reviewService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> update(
            @PathVariable String id,
            @Valid @RequestBody ReviewRequest req,
            @RequestAttribute(name = "userId", required = false) String jwtUserId,
            @RequestHeader(value = "X-User-Id", defaultValue = "") String headerUserId) {

        String resolvedId = (jwtUserId != null && !jwtUserId.isBlank()) ? jwtUserId : headerUserId;
        return ResponseEntity.ok(reviewService.update(id, req, resolvedId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(
            @PathVariable String id,
            @RequestAttribute(name = "userId", required = false) String jwtUserId,
            @RequestHeader(value = "X-User-Id", defaultValue = "") String headerUserId) {

        String resolvedId = (jwtUserId != null && !jwtUserId.isBlank()) ? jwtUserId : headerUserId;
        reviewService.delete(id, resolvedId);
        return ResponseEntity.ok(Map.of("message", "Reseña eliminada"));
    }

    /** Actualiza el userName en todas las reseñas y comentarios del usuario autenticado */
    @PatchMapping("/username")
    public ResponseEntity<Map<String, String>> updateUsername(
            @RequestBody Map<String, String> body,
            @RequestAttribute(name = "userId", required = false) String jwtUserId,
            @RequestHeader(value = "X-User-Id", defaultValue = "") String headerUserId) {

        String resolvedId = (jwtUserId != null && !jwtUserId.isBlank()) ? jwtUserId : headerUserId;
        if (resolvedId.isBlank()) return ResponseEntity.status(401).build();

        String userName = body.get("userName");
        String oldName  = body.get("oldName");
        if (userName == null || userName.isBlank()) return ResponseEntity.badRequest().build();

        reviewService.updateUserName(resolvedId, oldName, userName.trim());
        return ResponseEntity.ok(Map.of("message", "Nombre actualizado"));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(Map.of(
                "total", reviewService.getTotalCount(),
                "averageRating", reviewService.getAverageRating() != null ? reviewService.getAverageRating() : 0.0
        ));
    }
}
