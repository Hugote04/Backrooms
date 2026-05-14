package com.backrooms.lurking.service;

import com.backrooms.lurking.dto.ScoreRequest;
import com.backrooms.lurking.model.Score;
import com.backrooms.lurking.repository.ScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ScoreService {

    private final ScoreRepository scoreRepository;

    public Score submit(ScoreRequest req) {
        Score score = Score.builder()
                .userId(req.getUserId())
                .userName(req.getUserName())
                .nivel(req.getNivel())
                .tiempoSegundos(req.getTiempoSegundos())
                .puzlesResueltos(req.getPuzlesResueltos())
                .build();
        return scoreRepository.save(score);
    }

    public List<Score> getLeaderboard() {
        return scoreRepository.findAllByOrderByTiempoSegundosAsc();
    }

    public List<Score> getByUser(String userId) {
        return scoreRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Map<String, Object> getUserStats(String userId) {
        List<Score> scores  = scoreRepository.findByUserIdOrderByCreatedAtDesc(userId);
        int puzles          = scoreRepository.sumPuzlesByUserId(userId);
        Integer bestTime    = scoreRepository.findBestTimeByUserId(userId);
        return Map.of(
                "totalPartidas",    scores.size(),
                "puzlesResueltos",  puzles,
                "mejorTiempo",      bestTime != null ? bestTime : 0,
                "partidas",         scores
        );
    }

    public void deleteById(String id) {
        scoreRepository.deleteById(id);
    }

    public Score updateNivel(String id, String nuevoNivel) {
        Score score = scoreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Score not found: " + id));
        score.setNivel(nuevoNivel);
        return scoreRepository.save(score);
    }
}
