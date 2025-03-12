package vn.com.kltn_project_v1.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.com.kltn_project_v1.dtos.Overview.ReservationViewDTO;
import vn.com.kltn_project_v1.model.Reservation;
import vn.com.kltn_project_v1.repositories.ReservationRepository;
import vn.com.kltn_project_v1.services.IReservation;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
@RequiredArgsConstructor
@Service
public class ReservationService implements IReservation {
    private final ReservationRepository reservationRepository;
    @Override
    public List<ReservationViewDTO> getAllReservationInRoom(long roomId, Date dayStart, Date dayEnd) {
        List<Reservation> reservations = reservationRepository.findReservationsByRoomRoomIdAndTime(roomId, dayStart, dayEnd);
        ArrayList<ReservationViewDTO> reservationViewDTOS = new ArrayList<>();
        reservations.forEach(r->{
            ReservationViewDTO reservationViewDTO = new ReservationViewDTO();
            reservationViewDTO.setReservationId(r.getReservationId());
            reservationViewDTO.setStatusReservation(r.getStatusReservation());
            reservationViewDTO.setTimeEnd(r.getTimeEnd());
            reservationViewDTO.setTimeStart(r.getTimeStart());
            reservationViewDTO.setTitle(r.getTitle());
            reservationViewDTOS.add(reservationViewDTO);
        });
        return reservationViewDTOS;
    }

    @Override
    public List<ReservationViewDTO> getAllReservationPending() {
        List<Reservation> reservations = reservationRepository.findReservationsByStatusReservationPending();
        return convertApprovalReservation(reservations);
    }

    @Override
    public List<ReservationViewDTO> getAllReservationWaitingCancel() {
        List<Reservation> reservations = reservationRepository.findReservationsByStatusReservationWaitingCancel();
        return convertApprovalReservation(reservations);
    }

    @Override
    public Reservation getReservationById(Long reservationId) {
        return reservationRepository.findById(reservationId).orElse(null);
    }

    private List<ReservationViewDTO> convertApprovalReservation(List<Reservation> reservations) {
        ArrayList<ReservationViewDTO> reservationViewDTOS = new ArrayList<>();
        reservations.forEach(r->{
            ReservationViewDTO reservationViewDTO = new ReservationViewDTO();
            reservationViewDTO.setReservationId(r.getReservationId());
            reservationViewDTO.setImg(r.getBooker().getAvatar());
            reservationViewDTO.setNameBooker(r.getBooker().getEmployeeName());
            reservationViewDTO.setTime(r.getTime());
            reservationViewDTO.setTimeEnd(r.getTimeEnd());
            reservationViewDTO.setTimeStart(r.getTimeStart());
            reservationViewDTO.setTitle(r.getTitle());
            reservationViewDTOS.add(reservationViewDTO);
        });
        return reservationViewDTOS;
    }
}
