package com.backrooms.lurking.repository;

import com.backrooms.lurking.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findAllByOrderByCreatedAtDesc();
    List<Review> findByUserId(String userId);

    @Query("SELECT AVG(r.rating) FROM Review r")
    Double findAverageRating();
}
