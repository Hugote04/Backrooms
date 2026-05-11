package com.backrooms.lurking.repository;

import com.backrooms.lurking.model.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ScoreRepository extends JpaRepository<Score, String> {

    /** Leaderboard global: mejor tiempo por usuario (mínimo), ordenado ASC */
    @Query("""
        SELECT s FROM Score s
        WHERE s.tiempoSegundos = (
            SELECT MIN(s2.tiempoSegundos) FROM Score s2
            WHERE s2.userId = s.userId AND s2.nivel = s.nivel
        )
        ORDER BY s.tiempoSegundos ASC
    """)
    List<Score> findLeaderboard();

    /** Todos los scores de un usuario, ordenados por fecha DESC */
    List<Score> findByUserIdOrderByCreatedAtDesc(String userId);

    /** Total de puzles resueltos por un usuario */
    @Query("SELECT COALESCE(SUM(s.puzlesResueltos), 0) FROM Score s WHERE s.userId = :userId")
    int sumPuzlesByUserId(@Param("userId") String userId);

    /** Mejor tiempo de un usuario */
    @Query("SELECT MIN(s.tiempoSegundos) FROM Score s WHERE s.userId = :userId")
    Integer findBestTimeByUserId(@Param("userId") String userId);
}
