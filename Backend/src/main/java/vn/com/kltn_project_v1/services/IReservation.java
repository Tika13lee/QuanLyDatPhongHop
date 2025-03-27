package vn.com.kltn_project_v1.services;

import vn.com.kltn_project_v1.dtos.Overview.ReservationViewDTO;
import vn.com.kltn_project_v1.dtos.ReservationDTO;
import vn.com.kltn_project_v1.model.Reservation;
import vn.com.kltn_project_v1.model.StatusReservation;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface IReservation {
    List<ReservationViewDTO> getAllReservationInRoom(long roomId,Date  dayStart, Date dayEnd);

    Reservation getReservationById(Long reservationId);
    List<Reservation> createReservation(ReservationDTO reservationDTO);
    List<Reservation> getAllReservationByBooker(String phone,Date dayStart,Date dayEnd);
    List<ReservationViewDTO> getReservationsByStatusReservationAndBookerPhoneAndTimeAndApproverAndTitle(StatusReservation statusReservation, String phone, Date dayStart, Date dayEnd, String approverName, String title);
    List<ReservationViewDTO> getReservationsByBookerPhone(String phone,StatusReservation statusReservation);
    Map<String, Object> checkDataCheckIn(Long roomId, Long employeeId);
    Reservation updateReservation(ReservationDTO reservationDTO);

}
