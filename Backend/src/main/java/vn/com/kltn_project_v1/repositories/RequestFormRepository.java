package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.com.kltn_project_v1.model.RequestForm;
import vn.com.kltn_project_v1.model.StatusRequestForm;
import vn.com.kltn_project_v1.model.TypeRequestForm;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface RequestFormRepository extends JpaRepository<RequestForm, Long> {
    @Query("SELECT r FROM RequestForm r WHERE ( :statusRequestForm is null or r.statusRequestForm = :statusRequestForm) and (:typeRequestForm is null or r.typeRequestForm = :typeRequestForm) and r.requestReservation.bookerId = :bookerId order by r.timeRequest desc ")
    List<RequestForm> findRequestFormByBookerId(long bookerId, StatusRequestForm statusRequestForm, TypeRequestForm typeRequestForm);

    @Query("SELECT r FROM RequestForm r WHERE ( :statusRequestForm is null or r.statusRequestForm = :statusRequestForm) and r.requestReservation.roomId = :roomId and (:typeRequestForm is null or r.typeRequestForm = :typeRequestForm) order by r.timeRequest desc ")
    List<RequestForm> findRequestFormByRoomId(long roomId,StatusRequestForm statusRequestForm, TypeRequestForm typeRequestForm);
    @Query("SELECT r FROM RequestForm r WHERE  ( :statusRequestForm is null or r.statusRequestForm = :statusRequestForm) and (:typeRequestForm is null or r.typeRequestForm = :typeRequestForm) and (:dayStart is null or FUNCTION('DATE', r.timeRequest) = FUNCTION('DATE', dayStart)) order by r.timeRequest desc ")
    List<RequestForm> findRequestFormByStatusPending(StatusRequestForm statusRequestForm, TypeRequestForm typeRequestForm,Date dayStart);
    @Query("select r from RequestForm r join r.reservations res where res.reservationId = :reservationId and r.statusRequestForm = 'APPROVED' order by r.timeRequest desc ")
    List<RequestForm> findRequestFormByReservationId(long reservationId);

}