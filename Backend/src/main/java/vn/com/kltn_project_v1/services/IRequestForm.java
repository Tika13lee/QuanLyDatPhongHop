package vn.com.kltn_project_v1.services;

import vn.com.kltn_project_v1.dtos.RequestFormDTO;
import vn.com.kltn_project_v1.model.RequestForm;
import vn.com.kltn_project_v1.model.Reservation;
import vn.com.kltn_project_v1.model.StatusRequestForm;

import java.util.Date;
import java.util.List;

public interface IRequestForm {
    RequestForm createRequestForm(RequestFormDTO requestFormDTO);
    RequestForm getRequestFormById(Long requestFormId);
    List<RequestForm> getAllRequestForm();
    List<RequestForm> approveRequestForm(List<Long> requestFormId);
    List<RequestForm> rejectRequestForm(List<Long> requestFormId, String reasonReject);
    List<RequestForm> getRequestFormByBookerId(Long bookerId, StatusRequestForm statusRequestForm);

    List<RequestForm> getRequestFormByApproverId(Long approverId, StatusRequestForm statusRequestForm);
    List<RequestForm> getRequestFormByStatus(StatusRequestForm statusRequestForm);
    List<Reservation> checkDayRequestForm(RequestFormDTO requestFormDTO);
    RequestForm createRequestFormUpdateReservationOne(RequestFormDTO requestFormDTO);
    RequestForm createRequestFormUpdateReservationMany(Long requestFormId, Date dayFisnishFrequencyNew);
}
