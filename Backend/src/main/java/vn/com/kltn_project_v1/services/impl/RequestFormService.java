package vn.com.kltn_project_v1.services.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import vn.com.kltn_project_v1.dtos.RequestFormDTO;
import vn.com.kltn_project_v1.dtos.ReservationDTO;
import vn.com.kltn_project_v1.model.*;
import vn.com.kltn_project_v1.repositories.RequestFormRepository;
import vn.com.kltn_project_v1.repositories.RequestReservationRepository;
import vn.com.kltn_project_v1.repositories.ReservationRepository;
import vn.com.kltn_project_v1.repositories.RoomRepository;
import vn.com.kltn_project_v1.services.IRequestForm;
import vn.com.kltn_project_v1.services.IReservation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestFormService implements IRequestForm {
    private final RequestFormRepository requestFormRepository;
    private final RequestReservationRepository requestReservationRepository;
    private final ReservationRepository reservationRepository;
    private final IReservation reservationService;
    private final ModelMapper modelMapper;
    private final RoomRepository roomRepository;
    @Override
    public RequestForm createRequestForm(RequestFormDTO requestFormDTO) {
        RequestReservation requestReservation = modelMapper.map(requestFormDTO.getReservationDTO(), RequestReservation.class);
        RequestForm requestForm = modelMapper.map(requestFormDTO, RequestForm.class);
        requestForm.setRequestReservation(requestReservation);
        requestForm.setStatusRequestForm(StatusRequestForm.PENDING);
        List<Reservation> reservations =  reservationService.createReservation(modelMapper.map(requestForm.getRequestReservation(), ReservationDTO.class));
        requestForm.setReservations(reservations);
        return requestFormRepository.save(requestForm);
    }
    @Override
    public RequestForm getRequestFormById(Long requestFormId) {
        return requestFormRepository.findById(requestFormId).orElse(null);
    }

    @Override
    public List<RequestForm> getAllRequestForm() {
        return requestFormRepository.findAll();
    }
    @Override
    public RequestForm approveRequestForm(Long requestFormId) {
        RequestForm requestForm = requestFormRepository.findById(requestFormId).orElse(null);
        if (requestForm != null) {
            requestForm.setStatusRequestForm(StatusRequestForm.APPROVED);
            requestForm.getReservations().forEach(reservation -> {
                reservation.setStatusReservation(StatusReservation.WAITING);
                reservationRepository.save(reservation);
            });
            return requestFormRepository.save(requestForm);
        }
        return null;
    }

    @Override
    public RequestForm rejectRequestForm(Long requestFormId, String reasonReject) {
        RequestForm requestForm = requestFormRepository.findById(requestFormId).orElse(null);
        if (requestForm != null) {
            requestForm.setStatusRequestForm(StatusRequestForm.REJECTED);
            requestForm.setReasonReject(reasonReject);
            return requestFormRepository.save(requestForm);
        }
        return null;
    }

    @Override
    public List<RequestForm> getRequestFormByBookerId(Long bookerId, StatusRequestForm statusRequestForm) {
        return requestFormRepository.findRequestFormByBookerId(bookerId, statusRequestForm);
    }

    @Override
    public List<RequestForm> getRequestFormByApproverId(Long approverId, StatusRequestForm statusRequestForm) {
        ArrayList<RequestForm> requestForms = new ArrayList<>();
        roomRepository.findRoomsByApproverId(approverId).forEach(room -> {
            requestForms.addAll(requestFormRepository.findRequestFormByRoomId(room.getRoomId(), statusRequestForm));
        });
        return requestForms;
    }

    @Override
    public List<RequestForm> getRequestFormByStatus(StatusRequestForm statusRequestForm) {
        return requestFormRepository.findRequestFormByStatusPending(statusRequestForm);
    }
    @Override
    public List<Reservation> checkDayRequestForm(RequestFormDTO requestFormDTO){
        ArrayList<Reservation> reservations = new ArrayList<>();
        requestFormDTO.getReservationDTO().getTimeFinishFrequency().forEach(date -> {
            LocalDate day = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            LocalTime hourStart = requestFormDTO.getReservationDTO().getTimeStart().toInstant().atZone(ZoneId.systemDefault()).toLocalTime();
            LocalTime hourEnd = requestFormDTO.getReservationDTO().getTimeEnd().toInstant().atZone(ZoneId.systemDefault()).toLocalTime();
            LocalDateTime timeStart = LocalDateTime.of(day, hourStart);
            LocalDateTime timeEnd = LocalDateTime.of(day, hourEnd);
            Date dateEnd = Date.from(timeEnd.atZone(ZoneId.systemDefault()).toInstant());
            Date dateStart = Date.from(timeStart.atZone(ZoneId.systemDefault()).toInstant());
            reservationRepository.findRoomsByTimeAndAttendant(dateStart,dateEnd,requestFormDTO.getReservationDTO().getBookerId()).forEach(reservation -> {
               if(reservation.getRoom().getRoomId()==requestFormDTO.getReservationDTO().getRoomId()){
                   reservations.add(reservation);
               }
            });
        });
        return reservations;
    }
}
