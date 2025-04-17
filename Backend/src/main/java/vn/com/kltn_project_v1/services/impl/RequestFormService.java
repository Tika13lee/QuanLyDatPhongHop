package vn.com.kltn_project_v1.services.impl;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import vn.com.kltn_project_v1.dtos.RequestFormDTO;
import vn.com.kltn_project_v1.dtos.ReservationDTO;
import vn.com.kltn_project_v1.model.*;
import vn.com.kltn_project_v1.repositories.*;
import vn.com.kltn_project_v1.services.INotification;
import vn.com.kltn_project_v1.services.IRequestForm;
import vn.com.kltn_project_v1.services.IReservation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RequestFormService implements IRequestForm {
    private final RequestFormRepository requestFormRepository;
    private final RequestReservationRepository requestReservationRepository;
    private final ReservationRepository reservationRepository;
    private final IReservation reservationService;
    private final ModelMapper modelMapper;
    private final RoomRepository roomRepository;
    private final ServiceRepository serviceRepository;
    private final EmployeeRepository employeeRepository;
    private final EntityManager entityManager;
    private final INotification notificationService;
    @Override
    public RequestForm createRequestForm(RequestFormDTO requestFormDTO) {
        RequestReservation requestReservation = modelMapper.map(requestFormDTO.getReservationDTO(), RequestReservation.class);
        RequestForm requestForm = modelMapper.map(requestFormDTO, RequestForm.class);
        requestForm.setRequestReservation(requestReservation);
        requestForm.setStatusRequestForm(StatusRequestForm.PENDING);
        requestForm.setTypeRequestForm(requestFormDTO.getTypeRequestForm());
        List<Reservation> reservations =  reservationService.createReservation(modelMapper.map(requestForm.getRequestReservation(), ReservationDTO.class));
        requestForm.setReservations(reservations);
        notificationService.approveNotification(requestForm, employeeRepository.findById(requestFormDTO.getReservationDTO().getBookerId()).orElse(null));
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
    public List<RequestForm> approveRequestForm(List<Long> requestFormIds) {
        ArrayList<RequestForm> requestForms = new ArrayList<>();
        requestFormIds.forEach(requestFormId -> {
            RequestForm requestForm = requestFormRepository.findById(requestFormId).orElse(null);
            if (requestForm != null) {
                if(!requestForm.getTypeRequestForm().equals(TypeRequestForm.UPDATE_RESERVATION)){
                    requestForms.add(approveRequestFormCreate(requestForm));
                }else {
                    RequestForm requestFormOld = requestFormRepository.findRequestFormByReservationId(requestForm.getReservations().get(0).getReservationId()).get(0);
                    System.out.println(requestFormOld.getReservations().size());
                    if(requestFormOld.getReservations().size()==1){
                        requestForms.add(approveRequestFormUpdateOne(requestForm));
                    }else{
                        requestForms.add(approveRequestFormUpdateMany(requestForm,requestFormOld));

                    }
                }
            }
        });
        return requestForms;
    }
    private RequestForm approveRequestFormCreate(RequestForm requestForm){
        requestForm.setStatusRequestForm(StatusRequestForm.APPROVED);
        requestForm.setTimeResponse(new Date());
        requestForm.getReservations().forEach(reservation -> {
            reservation.setStatusReservation(StatusReservation.WAITING);
            reservationRepository.save(reservation);

        });
        reservationService.inviteMembersNotification(requestForm.getReservations().get(0), requestForm.getReservations().get(0).getAttendants());
        return requestFormRepository.save(requestForm);
    }
    protected RequestForm approveRequestFormUpdateOne(RequestForm requestForm){
        requestForm.setStatusRequestForm(StatusRequestForm.APPROVED);
        requestForm.setTimeResponse(new Date());
        requestForm.getReservations().forEach(reservation -> {
            reservation.setNote(requestForm.getRequestReservation().getNote());
            reservation.setServices(requestForm.getRequestReservation().getServiceIds().stream().map(serviceId -> serviceRepository.findById(serviceId).orElse(null)).toList());
            reservation.setFilePaths(requestForm.getRequestReservation().getFilePaths());
            reservation.setAttendants(requestForm.getRequestReservation().getEmployeeIds().stream().map(employeeId -> employeeRepository.findById(employeeId).orElse(null)).toList());
            entityManager.detach(reservation);
            reservationRepository.save(reservation);
        });
        reservationService.updateReservationNotification(requestForm.getReservations().get(0), requestForm.getReservations().get(0).getAttendants());
        return requestFormRepository.save(requestForm);
    }
    protected RequestForm approveRequestFormUpdateMany(RequestForm requestForm, RequestForm requestFormOld){
        ArrayList<Date> timeFinishNew = new ArrayList<>();// danh sách lịch cần tạo
        System.out.println("1");
        List<Date> timeFinishOld = new ArrayList<>(requestForm.getRequestReservation().getTimeFinishFrequency());
        System.out.println(timeFinishOld.size());
        for (Date date : requestForm.getRequestReservation().getTimeFinishFrequency()){
            LocalDate dayNew = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            System.out.println(dayNew);
            LocalDate dayOld = requestFormOld.getReservations().get(requestFormOld.getReservations().size()-1).getTimeStart().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            System.out.println(dayOld);
            if(dayNew.isAfter(dayOld)){
                timeFinishNew.add(date);// Thêm ngày mới vào danh sách nếu nó lớn hơn ngày cũ
            }
        }

        LocalDate dayNew = requestForm.getRequestReservation().getTimeFinishFrequency().get(requestForm.getRequestReservation().getTimeFinishFrequency().size()-1).toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate dayOld = requestFormOld.getReservations().get(requestFormOld.getReservations().size()-1).getTimeStart().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        System.out.println(dayNew);
        System.out.println(dayOld);
        dayNew = dayNew.plusDays(1);
        while (!dayNew.isAfter(dayOld)){
            LocalDate finalDayNew = dayNew;
            System.out.println(dayNew);
            requestFormOld.getReservations().forEach(r->{
                if(r.getTimeStart().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().isEqual(finalDayNew)){
                    r.setStatusReservation(StatusReservation.CANCELED);
                    reservationRepository.save(r);
                }

            });
            dayNew = dayNew.plusDays(1);
        }

        requestFormOld.getReservations().forEach(r->{
            if(!r.equals(requestFormOld.getReservations().get(0))&&!r.getStatusReservation().equals(StatusReservation.CANCELED)) {
                requestForm.getReservations().add(r);
            }
        });
        System.out.println(timeFinishNew.size());
        if(!timeFinishNew.isEmpty()){
            requestForm.getRequestReservation().setTimeFinishFrequency(timeFinishNew);
            List<Reservation> reservations =  reservationService.createReservation(modelMapper.map(requestForm.getRequestReservation(), ReservationDTO.class));
            reservations.forEach(reservation -> {
                reservation.setStatusReservation(StatusReservation.WAITING);
                reservationRepository.save(reservation);
            });
            requestForm.getReservations().addAll(reservations);
            requestForm.getRequestReservation().setTimeFinishFrequency(timeFinishOld);
        }

        requestForm.setStatusRequestForm(StatusRequestForm.APPROVED);
        requestForm.setTimeResponse(new Date());
        reservationService.updateReservationNotification(requestForm.getReservations().get(0), requestForm.getReservations().get(0).getAttendants());

        return requestFormRepository.save(requestForm);
    }
    @Override
    public List<RequestForm> rejectRequestForm(List<Long> requestFormIds, String reasonReject) {
        ArrayList<RequestForm> requestForms = new ArrayList<>();
        requestFormIds.forEach(requestFormId -> {
            RequestForm requestForm = requestFormRepository.findById(requestFormId).orElse(null);
            if (requestForm != null) {
                requestForm.setStatusRequestForm(StatusRequestForm.REJECTED);
                requestForm.setReasonReject(reasonReject);
                requestForm.setTimeResponse(new Date());
                requestForm.getReservations().forEach(reservation -> {
                    reservation.setStatusReservation(StatusReservation.CANCELED);
                    reservationRepository.save(reservation);
                });
                requestForms.add(requestFormRepository.save(requestForm));
            }
        });
        return requestForms;
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
        if(requestFormDTO.getReservationDTO().getTimeFinishFrequency().isEmpty()){
            System.out.println("1");
            requestFormDTO.getReservationDTO().setTimeFinishFrequency(Collections.singletonList(requestFormDTO.getReservationDTO().getTimeStart()));
        }
        System.out.println("2");
        requestFormDTO.getReservationDTO().getTimeFinishFrequency().forEach(date -> {
            LocalDate day = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            LocalTime hourStart = requestFormDTO.getReservationDTO().getTimeStart().toInstant().atZone(ZoneId.systemDefault()).toLocalTime();
            LocalTime hourEnd = requestFormDTO.getReservationDTO().getTimeEnd().toInstant().atZone(ZoneId.systemDefault()).toLocalTime();
            LocalDateTime timeStart = LocalDateTime.of(day, hourStart);
            LocalDateTime timeEnd = LocalDateTime.of(day, hourEnd);
            Date dateEnd = Date.from(timeEnd.atZone(ZoneId.systemDefault()).toInstant());
            Date dateStart = Date.from(timeStart.atZone(ZoneId.systemDefault()).toInstant());
            System.out.println(dateStart);
            System.out.println(dateEnd);
            System.out.println(date);

            System.out.println(reservationRepository.findRoomsByTimeAndAttendant(dateStart, dateEnd, requestFormDTO.getReservationDTO().getBookerId(), requestFormDTO.getReservationDTO().getRoomId()));
            reservations.addAll(reservationRepository.findRoomsByTimeAndAttendant(dateStart, dateEnd, requestFormDTO.getReservationDTO().getBookerId(), requestFormDTO.getReservationDTO().getRoomId()));
        });
        return reservations;
    }

    @Override
    public RequestForm createRequestFormUpdateReservationOne(RequestFormDTO requestFormDTO) {
RequestForm requestForm = new RequestForm();
        requestForm.setTimeRequest(requestFormDTO.getTimeRequest());
        requestForm.setStatusRequestForm(StatusRequestForm.PENDING);
        requestForm.setTypeRequestForm(TypeRequestForm.UPDATE_RESERVATION);
        requestForm.setReservations(new ArrayList<>());
        requestFormDTO.getReservationIds().forEach(reservationId -> {
            Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
            if (reservation != null) {
                requestForm.getReservations().add(reservation);

            }
        });
        RequestReservation requestReservationOld = requestFormRepository.findRequestFormByReservationId(requestFormDTO.getReservationIds().get(0)).get(0).getRequestReservation();
        RequestReservation requestReservation = new RequestReservation();
        requestReservation.setBookerId(requestReservationOld.getBookerId());
        requestReservation.setServiceIds(requestFormDTO.getReservationDTO().getServiceIds());
        requestReservation.setEmployeeIds(new ArrayList<>(requestReservationOld.getEmployeeIds()));
        requestReservation.setNote(requestReservationOld.getNote());
        requestReservation.setFilePaths(new ArrayList<>(requestReservationOld.getFilePaths()));
        requestReservation.setTimeStart(requestReservationOld.getTimeStart());
        requestReservation.setTimeEnd(requestReservationOld.getTimeEnd());
        requestReservation.setRoomId(requestReservationOld.getRoomId());
        requestReservation.setFrequency(requestReservationOld.getFrequency());
        requestReservation.setTimeFinishFrequency(new ArrayList<>(requestReservationOld.getTimeFinishFrequency()));
        requestReservation.setDescription(requestReservationOld.getDescription());
        requestReservation.setTime(requestReservationOld.getTime());
        requestReservation.setTitle(requestReservationOld.getTitle());
        requestReservationRepository.save(requestReservation);
        requestForm.setRequestReservation(requestReservation);
        System.out.println(requestForm.getRequestFormId());
        System.out.println(requestForm.getRequestReservation().getRequestReservationId());
        return requestFormRepository.save(requestForm);
    }

    @Override
    public RequestForm createRequestFormUpdateReservationMany(Long requestFormId, Date dayFisnishFrequencyNew) {
        RequestForm requestForm = requestFormRepository.findById(requestFormId).orElse(null);
        RequestForm requestFormUpdate = new RequestForm();
        requestFormUpdate.setTimeRequest(new Date());
        assert requestForm != null;
        List<Reservation> oneReservationList = new ArrayList<>();
        oneReservationList.add(requestForm.getReservations().get(0));
        requestFormUpdate.setReservations(oneReservationList);

        requestFormUpdate.setStatusRequestForm(StatusRequestForm.PENDING);
        requestFormUpdate.setTypeRequestForm(TypeRequestForm.UPDATE_RESERVATION);

        ArrayList<Date> timeDateIn = new ArrayList<>();
        requestForm.getRequestReservation().getTimeFinishFrequency().forEach(date -> {
            if(!date.after(dayFisnishFrequencyNew)){
                timeDateIn.add(date);
            }
        });
        if (!timeDateIn.isEmpty()) {
            Date lastDate = timeDateIn.get(timeDateIn.size() - 1);

            // Thêm các ngày còn thiếu vào danh sách
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(lastDate);

            while (calendar.getTime().before(dayFisnishFrequencyNew) || calendar.getTime().equals(dayFisnishFrequencyNew)) {
                calendar.add(Calendar.DAY_OF_MONTH, 1);
                timeDateIn.add(calendar.getTime());
            }
        }
        RequestReservation requestReservationOld = requestForm.getRequestReservation();
        RequestReservation requestReservation = new RequestReservation();
        requestReservation.setBookerId(requestReservationOld.getBookerId());
        requestReservation.setServiceIds(requestReservationOld.getServiceIds());
        requestReservation.setEmployeeIds(new ArrayList<>(requestReservationOld.getEmployeeIds()));
        requestReservation.setNote(requestReservationOld.getNote());
        requestReservation.setFilePaths(new ArrayList<>(requestReservationOld.getFilePaths()));
        requestReservation.setTimeStart(requestReservationOld.getTimeStart());
        requestReservation.setTimeEnd(requestReservationOld.getTimeEnd());
        requestReservation.setRoomId(requestReservationOld.getRoomId());
        requestReservation.setFrequency(requestReservationOld.getFrequency());
        requestReservation.setTimeFinishFrequency(new ArrayList<>(timeDateIn));
        requestReservation.setDescription(requestReservationOld.getDescription());
        requestReservation.setTime(requestReservationOld.getTime());
        requestReservation.setTitle(requestReservationOld.getTitle());
        requestReservation.setServiceIds(new ArrayList<>(requestReservationOld.getServiceIds()));
        requestReservationRepository.save(requestReservation);
        requestFormUpdate.setRequestReservation(requestReservation);
        return requestFormRepository.save(requestFormUpdate);
    }

    @Override
    public List<RequestForm> cancelRequestForm(List<Long> requestFormIds) {
        requestFormIds.forEach(requestFormId -> {
            RequestForm requestForm = requestFormRepository.findById(requestFormId).orElse(null);
            if (requestForm != null) {
                requestForm.setStatusRequestForm(StatusRequestForm.CANCELLED);
                requestFormRepository.save(requestForm);
            }
        });
        return requestFormRepository.findAllById(requestFormIds);
    }
}
