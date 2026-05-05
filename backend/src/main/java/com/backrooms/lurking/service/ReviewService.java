package com.backrooms.lurking.service;

import com.backrooms.lurking.dto.ReviewRequest;
import com.backrooms.lurking.model.Review;
import com.backrooms.lurking.repository.CommentRepository;
import com.backrooms.lurking.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;

    public List<Review> getAll() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    public Review getById(String id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Reseña no encontrada"));
    }

    public Review create(ReviewRequest req) {
        String userId = req.getUserId() != null ? req.getUserId() : "anonymous";
        Review review = Review.builder()
                .userId(userId)
                .userName(req.getUserName())
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

    public Double getAverageRating() {
        return reviewRepository.findAverageRating();
    }

    public long getTotalCount() {
        return reviewRepository.count();
    }
}
