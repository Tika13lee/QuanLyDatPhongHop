package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.com.kltn_project_v1.model.Reservation;
import vn.com.kltn_project_v1.model.Room;
import vn.com.kltn_project_v1.model.Service;
import vn.com.kltn_project_v1.model.StatusReservation;

import java.util.Date;
import java.util.List;
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findReservationsByRoomRoomId(Long roomId);
    @Query("select r from Reservation r where r.room.roomId = ?1 and r.timeStart between ?2 and ?3 and r.statusReservation != 'CANCELED'")
    List<Reservation> findReservationsByRoomRoomIdAndTime(Long roomId, Date timeStart, Date timeEnd);
    @Query("SELECT DISTINCT r.room FROM Reservation r WHERE r.booker.phone = ?1")
    List<Room> findDistinctRoomsByBookerPhone(String phone);
    @Query("SELECT r FROM Reservation r join r.attendants a WHERE (r.booker.phone = ?1 or a.phone =?1) and r.statusReservation != 'CANCELED'  and (:timeStart is null or (r.timeStart between ?2 and ?3))")
    List<Reservation> findReservationsByBookerPhoneAndTime(String phone, Date timeStart, Date timeEnd);
    @Query("SELECT r FROM Reservation r join r.attendants a WHERE (?1 is null or r.statusReservation = ?1) and a.phone = ?2 and (?3 is null or r.time between ?3 and ?4) and (?5 is null or r.room.approver.employeeName like %?5%) and (?6 is null or r.title like %?6%) ")
    List<Reservation> findReservationsByStatusReservationAndBookerPhoneAndTimeAndApproverAndTitle(StatusReservation status, String phone, Date timeStart, Date timeEnd, String approver, String title);
    @Query("SELECT r FROM Reservation r JOIN r.attendants a WHERE a.phone = ?1 AND (?2 IS NULL OR r.statusReservation = ?2) ORDER BY r.time DESC")
    List<Reservation> findReservationsByBookerPhoneAndStatusReservation(String phone, StatusReservation statusReservation);
    @Query("select r.room from Reservation r where (:timeStart is null) or(r.timeStart < ?1 and r.timeStart> ?2)or(r.timeEnd < ?1 and r.timeEnd >?2) or(r.timeStart <= ?1 and r.timeEnd >= ?2)")
    List<Room> findRoomsByTime(Date timeStart, Date timeEnd);
    //lich cua nhan vien nam trong khoang thoi gian bi trung
    @Query("select r from Reservation r join r.attendants a " +
            "where (:timeStart is null or " +
            "(r.timeStart < ?2 and r.timeEnd > ?1)) " + // Điều kiện trùng lặp đơn giản hóa
            "and( r.room.roomId =?4 or a.employeeId = ?3)")
    List<Reservation> findRoomsByTimeAndAttendant(Date timeStart, Date timeEnd, Long attendantId,Long roomId);

    //so sánh ngày checkin
    @Query("SELECT r FROM Reservation r " +
            "WHERE r.booker.employeeId =?1 and FUNCTION('DATE', r.timeStart) = FUNCTION('DATE', ?2) order by r.timeStart")
    List<Reservation> findReservationCheckInByDay(Long employeeId, Date timeCheckin);
    @Query("SELECT r FROM Reservation r " +
            "where r.booker.employeeId =?1 and r.timeEnd < ?2 and FUNCTION('DATE', r.timeStart) = FUNCTION('DATE', ?2) order by r.timeStart desc")
    List<Reservation> findReservationCheckInOutTime(Long employeeId, Date timeCheckin);
    @Query("SELECT r FROM Reservation r " +
            "where r.booker.employeeId =?1 and ?2 between r.timeStart and r.timeEnd ")
    Reservation findReservationCheckInDone(Long employeeId, Date timeCheckin);

    @Query("SELECT r FROM Reservation r " +
            "where r.booker.employeeId =?1 and r.timeEnd > ?2 and FUNCTION('DATE', r.timeStart) = FUNCTION('DATE', ?2) order by r.timeStart ")
    List<Reservation> findReservationCheckInInTime(Long employeeId, Date timeCheckin);

    //lich trong ngay hom nay
    @Query("SELECT r FROM Reservation r " +
            "WHERE  FUNCTION('DATE', r.timeStart) = FUNCTION('DATE', ?1) order by r.timeStart desc")
    List<Reservation> findReservationsInDay(Date timeCheckin);
    @Query("select s.serviceName, count(s) from Reservation r join r.services s where r.timeStart between ?1 and ?2 group by s.serviceName")
    List<Object[]> statisticalService(Date timeStart, Date timeEnd);
    @Query("select r.room.location.building.branch.branchName, count(r), sum(r.total),count(distinct r.room.roomId)  from Reservation r where r.timeStart between ?1 and ?2 group by r.room.location.building.branch.branchName")
    List<Object[]> statisticalBranchData(Date timeStart, Date timeEnd);
    @Query("select FUNCTION('DATE', r.timeStart), count(r), sum(r.total) from Reservation r where r.timeStart between ?1 and ?2 group by FUNCTION('DATE', r.timeStart)")
    List<Object[]> statisticalDaily(Date timeStart, Date timeEnd);
    @Query("select r.room.roomName, count(r), sum(r.total) from Reservation r where (r.timeStart between ?1 and ?2) and r.room.location.building.branch.branchId = ?3  group by r.room.roomName")
    List<Object[]> statisticalRoom(Date timeStart, Date timeEnd,Long branchId);
    @Query("""
    select 
           FUNCTION('HOUR', r.timeStart),
           FUNCTION('MINUTE', r.timeStart),
           count(r),
           sum(r.total)
    from Reservation r
    where r.timeStart between ?1 and ?2
    group by 
             FUNCTION('HOUR', r.timeStart),
             FUNCTION('MINUTE', r.timeStart)
""")
    List<Object[]> fullStatistical(Date timeStart, Date timeEnd);

    @Query("select count(r) from Reservation r where FUNCTION('DATE', r.timeStart) = FUNCTION('DATE', ?1) ")
    int statisticalReservationInDay(Date date);
    @Query("select count(r) from Reservation r where FUNCTION('DATE', r.timeCancel) = FUNCTION('DATE', ?1) and r.statusReservation = ?2 ")
    int statisticalReservationCancelInDay(Date timeCancel, StatusReservation statusReservation);
    @Query("select count(r) from Reservation r where FUNCTION('DATE', r.timeCheckIn) = FUNCTION('DATE', ?1) and r.statusReservation = ?2 ")
    int statisticalReservationFinishInDay(Date timeCheckin, StatusReservation statusReservation);
}