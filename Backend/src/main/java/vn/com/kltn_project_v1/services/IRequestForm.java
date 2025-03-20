package vn.com.kltn_project_v1.services;

import vn.com.kltn_project_v1.dtos.RequestFormDTO;
import vn.com.kltn_project_v1.model.RequestForm;

import java.util.List;

public interface IRequestForm {
    RequestForm createRequestForm(RequestFormDTO requestFormDTO);
    RequestForm getRequestFormById(Long requestFormId);
    List<RequestForm> getAllRequestForm();
    RequestForm approveRequestForm(Long requestFormId);
    RequestForm rejectRequestForm(Long requestFormId, String reasonReject);


}
