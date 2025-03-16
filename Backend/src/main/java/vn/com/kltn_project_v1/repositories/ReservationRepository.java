package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.com.kltn_project_v1.model.Reservation;
import vn.com.kltn_project_v1.model.Room;

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
    @Query("SELECT DISTINCT r.room FROM Reservation r WHERE r.booker.phone = ?1")
    List<Room> findDistinctRoomsByBookerPhone(String phone);
    @Query("SELECT r FROM Reservation r WHERE r.booker.phone = ?1 and (:timeStart is null or (r.timeStart between ?2 and ?3))")
    List<Reservation> findReservationsByBookerPhoneAndTime(String phone, Date timeStart, Date timeEnd);
    @Query("SELECT r.room FROM Reservation r WHERE (:timeStart IS NULL OR (r.timeStart >= :timeEnd AND r.timeEnd <= :timeStart))")
    List<Room> findDistinctRoomsByTime(@Param("timeStart") Date timeStart, @Param("timeEnd") Date timeEnd);

}