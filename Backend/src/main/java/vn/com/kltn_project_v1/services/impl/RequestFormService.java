package vn.com.kltn_project_v1.services.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import vn.com.kltn_project_v1.dtos.RequestFormDTO;
import vn.com.kltn_project_v1.dtos.ReservationDTO;
import vn.com.kltn_project_v1.model.RequestForm;
import vn.com.kltn_project_v1.model.RequestReservation;
import vn.com.kltn_project_v1.model.Reservation;
import vn.com.kltn_project_v1.model.StatusRequestForm;
import vn.com.kltn_project_v1.repositories.RequestFormRepository;
import vn.com.kltn_project_v1.repositories.RequestReservationRepository;
import vn.com.kltn_project_v1.repositories.ReservationRepository;
import vn.com.kltn_project_v1.services.IRequestForm;
import vn.com.kltn_project_v1.services.IReservation;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestFormService implements IRequestForm {
    private final RequestFormRepository requestFormRepository;
    private final RequestReservationRepository requestReservationRepository;
    private final ReservationRepository reservationRepository;
    private final IReservation reservationService;
    private final ModelMapper modelMapper;
    @Override
    public RequestForm createRequestForm(RequestFormDTO requestFormDTO) {
        RequestReservation requestReservation = modelMapper.map(requestFormDTO.getReservationDTO(), RequestReservation.class);
        RequestForm requestForm = modelMapper.map(requestFormDTO, RequestForm.class);
        requestForm.setRequestReservation(requestReservation);
        requestForm.setStatusRequestForm(StatusRequestForm.PENDING);

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
            List<Reservation> reservations =  reservationService.createReservation(modelMapper.map(requestForm.getRequestReservation(), ReservationDTO.class));
            System.out.println("1");
            requestForm.setReservations(reservations);
            return requestFormRepository.save(requestForm);
        }
        return null;
    }

    @Override
    public RequestForm rejectRequestForm(Long requestFormId, String reasonReject) {
        return null;
    }
}
