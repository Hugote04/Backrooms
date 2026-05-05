package com.backrooms.lurking.controller;

import com.backrooms.lurking.dto.CommentRequest;
import com.backrooms.lurking.model.Comment;
import com.backrooms.lurking.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<List<Comment>> getByReview(@RequestParam String reviewId) {
        return ResponseEntity.ok(commentService.getByReviewId(reviewId));
    }

    @PostMapping
    public ResponseEntity<Comment> create(@Valid @RequestBody CommentRequest req) {
        return ResponseEntity.ok(commentService.create(req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Id", defaultValue = "anonymous") String userId) {
        commentService.delete(id, userId);
        return ResponseEntity.ok(Map.of("message", "Comentario eliminado"));
    }
}
