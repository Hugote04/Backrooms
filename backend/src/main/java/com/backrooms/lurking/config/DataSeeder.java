package com.backrooms.lurking.config;

import com.backrooms.lurking.model.Comment;
import com.backrooms.lurking.model.Review;
import com.backrooms.lurking.model.Score;
import com.backrooms.lurking.repository.CommentRepository;
import com.backrooms.lurking.repository.ReviewRepository;
import com.backrooms.lurking.repository.ScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final ReviewRepository  reviewRepository;
    private final CommentRepository commentRepository;
    private final ScoreRepository   scoreRepository;

    @Override
    public void run(ApplicationArguments args) {
        seedReviews();
        seedScores();
    }

    private void seedReviews() {
        if (reviewRepository.count() > 0) return;

        Review r1 = reviewRepository.save(Review.builder()
                .userId("user-seed-001").userName("SombraPlayer").rating(5)
                .text("Una experiencia de terror única. Los pasillos amarillos infinitos crean una atmósfera opresiva que pocos juegos logran. El diseño de sonido es impecable.")
                .build());

        Review r2 = reviewRepository.save(Review.builder()
                .userId("user-seed-002").userName("BackroomsExplorer").rating(4)
                .text("Muy buen juego indie de terror. La IA del enemigo funciona bien y los jumpscares están bien colocados. Para ser un proyecto estudiantil está increíble.")
                .build());

        reviewRepository.save(Review.builder()
                .userId("user-seed-003").userName("NightmareGamer").rating(5)
                .text("Me encantó la ambientación. El noclip al vacío está bien recreado. Recomendado para fans del lore de las Backrooms.")
                .build());

        commentRepository.save(Comment.builder()
                .reviewId(r1.getId()).userId("user-seed-004").userName("VoidWalker")
                .content("¡Totalmente de acuerdo! Los sonidos de las tuberías me pusieron los pelos de punta.")
                .build());

        commentRepository.save(Comment.builder()
                .reviewId(r2.getId()).userId("user-seed-005").userName("LiminalFan")
                .content("¿Has llegado al nivel 2? Ahí es donde se pone realmente interesante.")
                .build());
    }

    private void seedScores() {
        if (scoreRepository.count() > 0) return;

        Object[][] data = {
            {"user-seed-001", "SombraPlayer",      "Nivel 1 — Pasillos", 187, 3},
            {"user-seed-001", "SombraPlayer",      "Nivel 2 — Oficinas", 312, 5},
            {"user-seed-002", "BackroomsExplorer", "Nivel 1 — Pasillos", 243, 2},
            {"user-seed-002", "BackroomsExplorer", "Nivel 2 — Oficinas", 289, 4},
            {"user-seed-003", "NightmareGamer",    "Nivel 1 — Pasillos", 158, 3},
            {"user-seed-003", "NightmareGamer",    "Nivel 2 — Oficinas", 401, 6},
            {"user-seed-004", "VoidWalker",        "Nivel 1 — Pasillos", 220, 1},
            {"user-seed-005", "LiminalFan",        "Nivel 1 — Pasillos", 195, 2},
            {"user-seed-005", "LiminalFan",        "Nivel 2 — Oficinas", 267, 4},
        };

        for (Object[] row : data) {
            scoreRepository.save(Score.builder()
                    .userId((String) row[0])
                    .userName((String) row[1])
                    .nivel((String) row[2])
                    .tiempoSegundos((int) row[3])
                    .puzlesResueltos((int) row[4])
                    .build());
        }
    }
}
