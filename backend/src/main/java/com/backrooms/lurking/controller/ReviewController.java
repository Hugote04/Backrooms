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
    public ResponseEntity<Review> create(@Valid @RequestBody ReviewRequest req) {
        return ResponseEntity.ok(reviewService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> update(
            @PathVariable String id,
            @Valid @RequestBody ReviewRequest req,
            @RequestHeader(value = "X-User-Id", defaultValue = "anonymous") String userId) {
        return ResponseEntity.ok(reviewService.update(id, req, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Id", defaultValue = "anonymous") String userId) {
        reviewService.delete(id, userId);
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
