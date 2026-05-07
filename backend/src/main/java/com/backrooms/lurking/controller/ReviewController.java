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

        // Prioridad: JWT validado > header
        String resolvedId = (jwtUserId != null && !jwtUserId.isBlank()) ? jwtUserId : headerUserId;
        req.setUserId(resolvedId);
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

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(Map.of(
                "total", reviewService.getTotalCount(),
                "averageRating", reviewService.getAverageRating() != null ? reviewService.getAverageRating() : 0.0
        ));
    }
}
