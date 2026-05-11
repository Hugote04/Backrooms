package com.backrooms.lurking.repository;

import com.backrooms.lurking.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findAllByOrderByCreatedAtDesc();
    List<Review> findByUserId(String userId);

    @Query("SELECT AVG(r.rating) FROM Review r")
    Double findAverageRating();

    @Modifying
    @Transactional
    @Query("UPDATE Review r SET r.userName = :userName WHERE r.userId = :userId")
    void updateUserNameByUserId(@Param("userId") String userId, @Param("userName") String userName);
}
