package com.backrooms.lurking.repository;

import com.backrooms.lurking.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {
    List<Comment> findByReviewIdOrderByCreatedAtAsc(String reviewId);
    void deleteAllByReviewId(String reviewId);

    @Modifying
    @Transactional
    @Query("UPDATE Comment c SET c.userName = :userName WHERE c.userId = :userId")
    void updateUserNameByUserId(@Param("userId") String userId, @Param("userName") String userName);

    @Modifying
    @Transactional
    @Query("UPDATE Comment c SET c.userId = :userId WHERE (c.userId = '' OR c.userId = 'anonymous') AND c.userName = :userName")
    void claimOrphansByUserName(@Param("userId") String userId, @Param("userName") String userName);
}
