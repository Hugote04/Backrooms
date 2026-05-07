package com.backrooms.lurking;

import com.backrooms.lurking.model.Review;
import com.backrooms.lurking.service.ReviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ReviewControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockBean  ReviewService reviewService;

    private Review buildReview() {
        return Review.builder()
                .id("rev-1")
                .userId("user-abc")
                .userName("Jugador Test")
                .rating(4)
                .text("Juego bastante bueno, muy recomendado.")
                .build();
    }

    // ── GET /api/reviews ──────────────────────────────────────────
    @Test
    @DisplayName("GET /api/reviews devuelve 200 con lista de reseñas")
    void getAll_200() throws Exception {
        when(reviewService.getAll()).thenReturn(List.of(buildReview()));

        mockMvc.perform(get("/api/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userName").value("Jugador Test"))
                .andExpect(jsonPath("$[0].rating").value(4));
    }

    // ── GET /api/reviews/stats ────────────────────────────────────
    @Test
    @DisplayName("GET /api/reviews/stats devuelve total y media")
    void getStats_200() throws Exception {
        when(reviewService.getTotalCount()).thenReturn(3L);
        when(reviewService.getAverageRating()).thenReturn(4.2);

        mockMvc.perform(get("/api/reviews/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(3))
                .andExpect(jsonPath("$.averageRating").value(4.2));
    }

    // ── POST /api/reviews ─────────────────────────────────────────
    @Test
    @DisplayName("POST /api/reviews con body válido devuelve 200")
    void create_valid_200() throws Exception {
        when(reviewService.create(any())).thenReturn(buildReview());

        String body = objectMapper.writeValueAsString(Map.of(
                "userId", "user-abc",
                "userName", "Jugador Test",
                "rating", 4,
                "text", "Juego bastante bueno, muy recomendado."
        ));

        mockMvc.perform(post("/api/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("rev-1"));
    }

    @Test
    @DisplayName("POST /api/reviews con texto vacío devuelve 400")
    void create_blankText_400() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "userId", "user-abc",
                "userName", "Jugador Test",
                "rating", 4,
                "text", ""
        ));

        mockMvc.perform(post("/api/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/reviews con rating fuera de rango devuelve 400")
    void create_invalidRating_400() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "userId", "user-abc",
                "userName", "Jugador Test",
                "rating", 99,
                "text", "Texto de prueba suficientemente largo."
        ));

        mockMvc.perform(post("/api/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    // ── DELETE /api/reviews/{id} ──────────────────────────────────
    @Test
    @DisplayName("DELETE /api/reviews/{id} devuelve 200 con mensaje")
    void delete_200() throws Exception {
        doNothing().when(reviewService).delete(eq("rev-1"), any());

        mockMvc.perform(delete("/api/reviews/rev-1")
                        .header("X-User-Id", "user-abc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Reseña eliminada"));
    }

    @Test
    @DisplayName("GET /api/reviews/{id} devuelve 404 si no existe")
    void getById_notFound() throws Exception {
        when(reviewService.getById("rev-999"))
                .thenThrow(new NoSuchElementException("Reseña no encontrada"));

        mockMvc.perform(get("/api/reviews/rev-999"))
                .andExpect(status().isNotFound());
    }
}
