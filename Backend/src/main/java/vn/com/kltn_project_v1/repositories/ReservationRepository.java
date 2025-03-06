package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.com.kltn_project_v1.model.Reservation;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findReservationsByRoomRoomId(Long roomId);

}