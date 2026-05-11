package com.backrooms.lurking.repository;

import com.backrooms.lurking.model.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ScoreRepository extends JpaRepository<Score, String> {

    /** Leaderboard global: todas las partidas ordenadas por tiempo ASC */
    List<Score> findAllByOrderByTiempoSegundosAsc();

    /** Todos los scores de un usuario, ordenados por fecha DESC */
    List<Score> findByUserIdOrderByCreatedAtDesc(String userId);

    /** Total de puzles resueltos por un usuario */
    @Query("SELECT COALESCE(SUM(s.puzlesResueltos), 0) FROM Score s WHERE s.userId = :userId")
    int sumPuzlesByUserId(@Param("userId") String userId);

    /** Mejor tiempo de un usuario */
    @Query("SELECT MIN(s.tiempoSegundos) FROM Score s WHERE s.userId = :userId")
    Integer findBestTimeByUserId(@Param("userId") String userId);
}
