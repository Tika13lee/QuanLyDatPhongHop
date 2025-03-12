package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.com.kltn_project_v1.model.Reservation;

import java.util.Date;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findReservationsByRoomRoomId(Long roomId);
    @Query("select r from Reservation r where r.room.roomId = ?1 and r.timeStart between ?2 and ?3")
    List<Reservation> findReservationsByRoomRoomIdAndTime(Long roomId, Date timeStart, Date timeEnd);
    @Query("select r from Reservation r where r.statusReservation = 'PENDING'")
    List<Reservation> findReservationsByStatusReservationPending();
    @Query("select r from Reservation r where r.statusReservation = 'WAITING_CANCEL'")
    List<Reservation> findReservationsByStatusReservationWaitingCancel();
}