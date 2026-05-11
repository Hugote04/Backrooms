package com.backrooms.lurking.service;

import com.backrooms.lurking.dto.ReviewRequest;
import com.backrooms.lurking.model.Review;
import com.backrooms.lurking.repository.CommentRepository;
import com.backrooms.lurking.repository.ReviewRepository;
import com.backrooms.lurking.repository.ScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository  reviewRepository;
    private final CommentRepository commentRepository;
    private final ScoreRepository   scoreRepository;

    public List<Review> getAll() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    public Review getById(String id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Reseña no encontrada"));
    }

    public Review create(ReviewRequest req) {
        String userId   = req.getUserId() != null && !req.getUserId().isBlank() ? req.getUserId() : "anonymous";
        String userName = req.getUserName() != null && !req.getUserName().isBlank() ? req.getUserName() : "Anónimo";
        Review review = Review.builder()
                .userId(userId)
                .userName(userName)
                .rating(req.getRating())
                .text(req.getText())
                .build();
        return reviewRepository.save(review);
    }

    public Review update(String id, ReviewRequest req, String requestUserId) {
        Review review = getById(id);
        if (!review.getUserId().equals(requestUserId) && !requestUserId.equals("admin")) {
            throw new SecurityException("No tienes permiso para editar esta reseña");
        }
        review.setRating(req.getRating());
        review.setText(req.getText());
        // actualizar nombre si viene en el request
        if (req.getUserName() != null && !req.getUserName().isBlank()) {
            review.setUserName(req.getUserName());
        }
        return reviewRepository.save(review);
    }

    @Transactional
    public void delete(String id, String requestUserId) {
        Review review = getById(id);
        if (!review.getUserId().equals(requestUserId) && !requestUserId.equals("admin")) {
            throw new SecurityException("No tienes permiso para eliminar esta reseña");
        }
        commentRepository.deleteAllByReviewId(id);
        reviewRepository.delete(review);
    }

    @Transactional
    public void updateUserName(String userId, String oldName, String newName) {
        // 1. Reclamar reseñas/comentarios huérfanos (userId vacío) por nombre anterior
        if (oldName != null && !oldName.isBlank()) {
            reviewRepository.claimOrphansByUserName(userId, oldName);
            commentRepository.claimOrphansByUserName(userId, oldName);
        }
        // 2. Actualizar nombre en todo lo que ya tiene el userId correcto
        reviewRepository.updateUserNameByUserId(userId, newName);
        commentRepository.updateUserNameByUserId(userId, newName);
        scoreRepository.updateUserNameByUserId(userId, newName);
    }

    public Double getAverageRating() {
        return reviewRepository.findAverageRating();
    }

    public long getTotalCount() {
        return reviewRepository.count();
    }
}
