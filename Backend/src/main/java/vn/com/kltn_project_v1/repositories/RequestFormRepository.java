package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.com.kltn_project_v1.model.RequestForm;
import vn.com.kltn_project_v1.model.StatusRequestForm;

import java.util.List;
@Repository
public interface RequestFormRepository extends JpaRepository<RequestForm, Long> {
    @Query("SELECT r FROM RequestForm r WHERE ( :statusRequestForm is null or r.statusRequestForm = :statusRequestForm) and r.requestReservation.bookerId = :bookerId ")
    List<RequestForm> findRequestFormByBookerId(long bookerId, StatusRequestForm statusRequestForm);
    @Query("SELECT r FROM RequestForm r WHERE ( :statusRequestForm is null or r.statusRequestForm = :statusRequestForm) and r.requestReservation.roomId = :roomId")
    List<RequestForm> findRequestFormByRoomId(long roomId,StatusRequestForm statusRequestForm);
    @Query("SELECT r FROM RequestForm r WHERE  ( :statusRequestForm is null or r.statusRequestForm = :statusRequestForm) ")
    List<RequestForm> findRequestFormByStatusPending(StatusRequestForm statusRequestForm);
    @Query("select r from RequestForm r join r.reservations res where res.reservationId = :reservationId and r.typeRequestForm != 'UPDATE_RESERVATION'")
    RequestForm findRequestFormByReservationId(long reservationId);
}