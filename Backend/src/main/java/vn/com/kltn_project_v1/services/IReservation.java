package vn.com.kltn_project_v1.services;

import vn.com.kltn_project_v1.dtos.Overview.ReservationViewDTO;
import vn.com.kltn_project_v1.model.Reservation;

import java.util.Date;
import java.util.List;

public interface IReservation {
    List<ReservationViewDTO> getAllReservationInRoom(long roomId,Date  dayStart, Date dayEnd);

    List<ReservationViewDTO> getAllReservationPending();
    List<ReservationViewDTO> getAllReservationWaitingCancel();
    Reservation getReservationById(Long reservationId);

}
