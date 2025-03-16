package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.com.kltn_project_v1.model.Reservation;
import vn.com.kltn_project_v1.model.Room;
import vn.com.kltn_project_v1.model.StatusReservation;

import java.util.Date;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findReservationsByRoomRoomId(Long roomId);
    @Query("select r from Reservation r where r.room.roomId = ?1 and r.timeStart between ?2 and ?3 and r.statusReservation != 'CANCELED' and r.statusReservation!='NO_APPROVED'")
    List<Reservation> findReservationsByRoomRoomIdAndTime(Long roomId, Date timeStart, Date timeEnd);
    @Query("select r from Reservation r where r.statusReservation = 'PENDING' and (?1=0 or r.room.approver.employeeId = ?1)")
    List<Reservation> findReservationsByStatusReservationPending(Long approverId);
    @Query("select r from Reservation r where r.statusReservation = 'NO_APPROVED' and (?1=0 or r.room.approver.employeeId = ?1)")
    List<Reservation> findReservationsByStatusReservationNoApproved(Long approverId);
    @Query("select r from Reservation r where r.statusReservation != 'PENDING' and r.statusReservation!='NO_APPROVED' and (?1=0 or r.room.approver.employeeId = ?1)")
    List<Reservation> findReservationsByStatusReservationNoPending(Long approverId);
    @Query("select r from Reservation r where r.statusReservation = 'WAITING_CANCEL'")
    List<Reservation> findReservationsByStatusReservationWaitingCancel();
    @Query("SELECT DISTINCT r.room FROM Reservation r WHERE r.booker.phone = ?1")
    List<Room> findDistinctRoomsByBookerPhone(String phone);
    @Query("SELECT r FROM Reservation r WHERE r.booker.phone = ?1 and r.statusReservation != 'CANCELED' and r.statusReservation!='NO_APPROVED' and (:timeStart is null or (r.timeStart between ?2 and ?3))")
    List<Reservation> findReservationsByBookerPhoneAndTime(String phone, Date timeStart, Date timeEnd);
    @Query("SELECT r FROM Reservation r WHERE (?1 is null or r.statusReservation = ?1) and r.booker.phone = ?2 and (?3 is null or r.time between ?3 and ?4) and (?5 is null or r.room.approver.employeeName like %?5%) and (?6 is null or r.title like %?6%) ")
    List<Reservation> findReservationsByStatusReservationAndBookerPhoneAndTimeAndApproverAndTitle(StatusReservation status, String phone, Date timeStart, Date timeEnd, String approver, String title);


    @Query("SELECT r.room FROM Reservation r WHERE (:timeStart IS NULL OR (r.timeStart >= :timeEnd AND r.timeEnd <= :timeStart))")
    List<Room> findDistinctRoomsByTime(@Param("timeStart") Date timeStart, @Param("timeEnd") Date timeEnd);

}