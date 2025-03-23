package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.com.kltn_project_v1.model.Price;
import vn.com.kltn_project_v1.model.Type;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
@Repository
public interface PriceRepository extends JpaRepository<Price, Long> {

    @Query("SELECT p FROM Price p " +
            "WHERE p.isActive = true " +
            "AND FUNCTION('DATE', p.timeStart) <= FUNCTION('DATE', ?2) " +
            "AND FUNCTION('DATE', p.timeEnd) >= FUNCTION('DATE', ?1)")
    List<Price> findPriceByTimeOverlap(LocalDate timeStart, LocalDate timeEnd);

    @Query("SELECT p FROM Price p " +
            "WHERE p.isActive = true " +
            "AND (:time IS NULL OR FUNCTION('DATE', p.timeStart) <= FUNCTION('DATE', :time) " +
            "AND FUNCTION('DATE', p.timeEnd) >= FUNCTION('DATE', :time))")
    Price findActivePrice(@Param("time") Date time);

    @Query("SELECT p FROM Price p " +
            "WHERE :time IS NULL OR (FUNCTION('DATE', p.timeStart) <= FUNCTION('DATE', :time) " +
            "AND FUNCTION('DATE', p.timeEnd) >= FUNCTION('DATE', :time))")
    List<Price> findPriceInTime(@Param("time") Date time);

}