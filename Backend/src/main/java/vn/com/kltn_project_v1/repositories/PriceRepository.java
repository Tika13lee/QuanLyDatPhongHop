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
    @Query("SELECT p FROM Price p WHERE(p.timeStart < ?1 and p.timeStart> ?2)or(p.timeEnd < ?1 and p.timeEnd >?2) or(p.timeStart <= ?1 and p.timeEnd >= ?2)")
    List<Price> findPriceByTimeStartAndTimeEnd(Date timeStart, Date timeEnd);
}