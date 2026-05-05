package com.backrooms.lurking.service;

import com.backrooms.lurking.dto.CommentRequest;
import com.backrooms.lurking.model.Comment;
import com.backrooms.lurking.repository.CommentRepository;
import com.backrooms.lurking.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final ReviewRepository reviewRepository;

    public List<Comment> getByReviewId(String reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new NoSuchElementException("Reseña no encontrada");
        }
        return commentRepository.findByReviewIdOrderByCreatedAtAsc(reviewId);
    }

    public Comment create(CommentRequest req) {
        if (!reviewRepository.existsById(req.getReviewId())) {
            throw new NoSuchElementException("Reseña no encontrada");
        }
        String userId = req.getUserId() != null ? req.getUserId() : "anonymous";
        Comment comment = Comment.builder()
                .reviewId(req.getReviewId())
                .userId(userId)
                .userName(req.getUserName())
                .content(req.getContent())
                .build();
        return commentRepository.save(comment);
    }

    public void delete(String id, String requestUserId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Comentario no encontrado"));
        if (!comment.getUserId().equals(requestUserId) && !requestUserId.equals("admin")) {
            throw new SecurityException("No tienes permiso");
        }
        commentRepository.delete(comment);
    }
}
