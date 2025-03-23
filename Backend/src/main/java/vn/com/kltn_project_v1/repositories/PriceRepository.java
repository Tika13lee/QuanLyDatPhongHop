package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.com.kltn_project_v1.model.Price;
import vn.com.kltn_project_v1.model.Type;

import java.util.Date;
import java.util.List;
import java.util.Optional;
@Repository
public interface PriceRepository extends JpaRepository<Price, Long> {
    @Query("SELECT p FROM Price p " +
            "WHERE p.isActive = true " +
            "AND FUNCTION('DATE', p.timeStart) <= FUNCTION('DATE', ?2) " +
            "AND FUNCTION('DATE', p.timeEnd) >= FUNCTION('DATE', ?1)")
    List<Price> findPriceByTimeOverlap(Date timeStart, Date timeEnd);

}