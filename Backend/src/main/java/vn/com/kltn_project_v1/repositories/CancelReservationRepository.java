package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.com.kltn_project_v1.model.CancelReservation;
@Repository

public interface CancelReservationRepository extends JpaRepository<CancelReservation, Long> {
}