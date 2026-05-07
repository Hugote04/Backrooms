package com.backrooms.lurking;

import com.backrooms.lurking.dto.ReviewRequest;
import com.backrooms.lurking.model.Review;
import com.backrooms.lurking.repository.CommentRepository;
import com.backrooms.lurking.repository.ReviewRepository;
import com.backrooms.lurking.service.ReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock ReviewRepository reviewRepository;
    @Mock CommentRepository commentRepository;
    @InjectMocks ReviewService reviewService;

    private Review sampleReview;

    @BeforeEach
    void setUp() {
        sampleReview = Review.builder()
                .id("rev-1")
                .userId("user-abc")
                .userName("Jugador Test")
                .rating(4)
                .text("Juego bastante bueno, me ha gustado mucho.")
                .build();
    }

    // ── getAll ────────────────────────────────────────────────────
    @Test
    @DisplayName("getAll devuelve lista vacía cuando no hay reseñas")
    void getAll_emptyList() {
        when(reviewRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of());
        assertThat(reviewService.getAll()).isEmpty();
    }

    @Test
    @DisplayName("getAll devuelve las reseñas existentes")
    void getAll_returnsList() {
        when(reviewRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(sampleReview));
        List<Review> result = reviewService.getAll();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getUserName()).isEqualTo("Jugador Test");
    }

    // ── getById ───────────────────────────────────────────────────
    @Test
    @DisplayName("getById lanza NoSuchElementException si la reseña no existe")
    void getById_notFound() {
        when(reviewRepository.findById("rev-999")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> reviewService.getById("rev-999"))
                .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    @DisplayName("getById devuelve la reseña correcta")
    void getById_found() {
        when(reviewRepository.findById("rev-1")).thenReturn(Optional.of(sampleReview));
        Review r = reviewService.getById("rev-1");
        assertThat(r.getId()).isEqualTo("rev-1");
    }

    // ── create ────────────────────────────────────────────────────
    @Test
    @DisplayName("create persiste la reseña y devuelve el objeto guardado")
    void create_success() {
        ReviewRequest req = new ReviewRequest();
        req.setUserId("user-abc");
        req.setUserName("Jugador Test");
        req.setRating(5);
        req.setText("Experiencia increíble, muy recomendado.");

        when(reviewRepository.save(any(Review.class))).thenReturn(sampleReview);

        Review result = reviewService.create(req);
        assertThat(result).isNotNull();
        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    // ── update ────────────────────────────────────────────────────
    @Test
    @DisplayName("update modifica la reseña si el usuario es el propietario")
    void update_ownerSuccess() {
        when(reviewRepository.findById("rev-1")).thenReturn(Optional.of(sampleReview));
        when(reviewRepository.save(any(Review.class))).thenReturn(sampleReview);

        ReviewRequest req = new ReviewRequest();
        req.setRating(3);
        req.setText("Revisando mi opinión, es entretenido pero corto.");

        Review updated = reviewService.update("rev-1", req, "user-abc");
        assertThat(updated).isNotNull();
        verify(reviewRepository).save(sampleReview);
    }

    @Test
    @DisplayName("update lanza SecurityException si el usuario no es el propietario")
    void update_notOwner() {
        when(reviewRepository.findById("rev-1")).thenReturn(Optional.of(sampleReview));

        ReviewRequest req = new ReviewRequest();
        req.setRating(1);
        req.setText("Quiero editar la reseña de otro.");

        assertThatThrownBy(() -> reviewService.update("rev-1", req, "user-intruso"))
                .isInstanceOf(SecurityException.class);
    }

    // ── delete ────────────────────────────────────────────────────
    @Test
    @DisplayName("delete elimina la reseña y sus comentarios si el usuario es propietario")
    void delete_ownerSuccess() {
        when(reviewRepository.findById("rev-1")).thenReturn(Optional.of(sampleReview));

        reviewService.delete("rev-1", "user-abc");

        verify(commentRepository).deleteAllByReviewId("rev-1");
        verify(reviewRepository).delete(sampleReview);
    }

    @Test
    @DisplayName("delete lanza SecurityException si el usuario no es el propietario")
    void delete_notOwner() {
        when(reviewRepository.findById("rev-1")).thenReturn(Optional.of(sampleReview));

        assertThatThrownBy(() -> reviewService.delete("rev-1", "user-intruso"))
                .isInstanceOf(SecurityException.class);
    }

    // ── stats ─────────────────────────────────────────────────────
    @Test
    @DisplayName("getTotalCount devuelve el número total de reseñas")
    void getTotalCount() {
        when(reviewRepository.count()).thenReturn(5L);
        assertThat(reviewService.getTotalCount()).isEqualTo(5L);
    }

    @Test
    @DisplayName("getAverageRating devuelve null cuando no hay reseñas")
    void getAverageRating_empty() {
        when(reviewRepository.findAverageRating()).thenReturn(null);
        assertThat(reviewService.getAverageRating()).isNull();
    }
}
