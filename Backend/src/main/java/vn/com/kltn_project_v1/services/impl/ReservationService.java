package vn.com.kltn_project_v1.services.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;

import vn.com.kltn_project_v1.dtos.Overview.ReservationViewDTO;
import vn.com.kltn_project_v1.dtos.ReservationDTO;
import vn.com.kltn_project_v1.model.*;
import vn.com.kltn_project_v1.repositories.*;
import vn.com.kltn_project_v1.services.IReservation;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@org.springframework.stereotype.Service
public class ReservationService implements IReservation {
    private final ReservationRepository reservationRepository;
    private final ModelMapper modelMapper;
    private final RoomRepository roomRepository;
    private final ServiceRepository serviceRepository;
    private final EmployeeRepository employeeRepository;
    private final NotificationService notificationService;
    private final RequestFormRepository requestFormRepository;
    private final PriceRepository priceRepository;
    private final PriceRoomRepository priceRoomRepository;
    private final PriceServiceRepository priceServiceRepository;
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
            reservationViewDTO.setFrequency(r.getFrequency());
            reservationViewDTO.setNote(r.getNote());
            reservationViewDTOS.add(reservationViewDTO);
        });
        return reservationViewDTOS;
    }


    @Override
    public Reservation getReservationById(Long reservationId) {
        return reservationRepository.findById(reservationId).orElse(null);
    }

    @Override
    public List<Reservation> createReservation(ReservationDTO reservationDTO) {
        List<Reservation> reservations = new ArrayList<>();
        if (!reservationDTO.getFrequency().equals(Frequency.ONE_TIME)) {
            for (Date date : reservationDTO.getTimeFinishFrequency()) {
                LocalDate day = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                LocalTime hourStart = reservationDTO.getTimeStart().toInstant().atZone(ZoneId.systemDefault()).toLocalTime();
                LocalTime hourEnd = reservationDTO.getTimeEnd().toInstant().atZone(ZoneId.systemDefault()).toLocalTime();
                LocalDateTime timeStart = LocalDateTime.of(day, hourStart);
                LocalDateTime timeEnd = LocalDateTime.of(day, hourEnd);
                Date dateEnd = Date.from(timeEnd.atZone(ZoneId.systemDefault()).toInstant());
                Date dateStart = Date.from(timeStart.atZone(ZoneId.systemDefault()).toInstant());
                Reservation reservation = convertReservationToCreate(reservationDTO);
                reservation.setTimeStart(dateStart);
                reservation.setTimeEnd(dateEnd);
                reservations.add(reservation);
                reservationRepository.save(reservation);
            }
            return reservations;
        }else {
            Reservation reservation = convertReservationToCreate(reservationDTO);
            reservationRepository.save(reservation);

            return new ArrayList<>(List.of(reservation));
        }

    }

    @Override
    public List<Reservation> getAllReservationByBooker(String phone, Date dayStart, Date dayEnd) {
        return reservationRepository.findReservationsByBookerPhoneAndTime(phone,dayStart,dayEnd);
    }


    @Override
    public List<ReservationViewDTO> getReservationsByStatusReservationAndBookerPhoneAndTimeAndApproverAndTitle(StatusReservation statusReservation, String phone, Date dayStart, Date dayEnd, String approverName, String title) {
        return convertApprovalReservation(reservationRepository.findReservationsByStatusReservationAndBookerPhoneAndTimeAndApproverAndTitle(statusReservation, phone, dayStart, dayEnd, approverName, title));
    }

    @Override
    public List<ReservationViewDTO> getReservationsByBookerPhone(String phone, StatusReservation statusReservation) {
        return convertApprovalReservation(reservationRepository.findReservationsByBookerPhoneAndStatusReservation(phone, statusReservation));
    }

    @Override
    public Map<String,Object> checkDataCheckIn(Long roomId, Long employeeId) {

        Date TimeCheckin = new Date();
        String mesResult = "";
        Map<String,Object> response = new ConcurrentHashMap<>();
        List<Reservation> reservationsInDay = reservationRepository.findReservationCheckInByDay(employeeId, TimeCheckin);
        if(reservationsInDay.isEmpty()){
            mesResult = "Không có lịch hẹn đặt phòng trong ngày";
            response.put("message", mesResult);
            return response;
        }else {
            List<Reservation> reservationsOutTime = reservationRepository.findReservationCheckInOutTime(employeeId, TimeCheckin);
            System.out.println(reservationsOutTime.size());
            System.out.println(reservationsInDay.size());
            if (reservationsInDay.size()==reservationsOutTime.size()) {
                mesResult = "Hết lịch trong ngày";
                response.put("message", mesResult);
                return response;
            }else {
                List<Reservation> reservationCheckin = reservationRepository.findReservationCheckInInTime(employeeId,TimeCheckin);
                SimpleDateFormat formatter = new SimpleDateFormat("HH'h'mm");
                String formattedTime = formatter.format(reservationCheckin.get(0).getTimeStart());
                if(reservationCheckin.get(0).getRoom().getRoomId() != roomId) {
                    mesResult= "Lịch gần nhất của bạn không phải phòng này" ;
                    response.put("message",mesResult);
                }else {
                    System.out.println(reservationCheckin.get(0).getTimeStart());
                    System.out.println(TimeCheckin);
                     if(!reservationCheckin.get(0).getTimeStart().before(TimeCheckin)){
                        mesResult = "Chưa đến giờ checkin, " + "lịch của bạn vào lúc " + formattedTime;
                         response.put("message", mesResult);
                    }else {
                        mesResult = "Checkin thành công";
                         reservationCheckin.get(0).setStatusReservation(StatusReservation.CHECKED_IN);
                         reservationCheckin.get(0).setTimeCheckIn(TimeCheckin);
                        reservationRepository.save(reservationCheckin.get(0));
                        response.put("message", mesResult);
                        response.put("reservation", reservationCheckin.get(0));
                    }
                }
            }
        }
        return response;
    }

    @Override
    public Reservation updateReservation(ReservationDTO reservationDTO) {
        Reservation reservation = reservationRepository.findById(reservationDTO.getReservationId()).orElse(null);
        if(!reservationDTO.getEmployeeIds().isEmpty()) {
            List<Employee> employees = new ArrayList<>();
            reservationDTO.getEmployeeIds().forEach(e -> employees.add(employeeRepository.findById(e).orElse(null)));
            assert reservation != null;
            reservation.setAttendants(employees);
            reservation.setFilePaths(reservationDTO.getFilePaths());
            reservation.setNote(reservationDTO.getNote());
        }
        assert reservation != null;
        return reservationRepository.save(reservation);
    }

    @Override
    public void inviteMembersNotification(Reservation reservation, List<Employee> employees) {
        for (Employee employee : employees) {
            if (employee.getEmployeeId()==(reservation.getBooker().getEmployeeId())) {
                continue;
            }
            notificationService.notifyUser(
                    employee,
                    NotificationType.INVITE_TO_RESERVATION,
                    "Bạn được mời tham gia cuộc họp: " + reservation.getTitle(),
                    "reservation",
                    reservation.getReservationId()
            );
        }
    }
    @Override
    public void bookerReservationNotification(Reservation reservation, Employee employee) {
            notificationService.notifyUser(
                    employee,
                    NotificationType.RESERVATION_REQUEST,
                    "Bạn đã đặt lịch họp: " + reservation.getTitle() + " vào lúc " + reservation.getTimeStart() + " thành công",
                    "reservation",
                    reservation.getReservationId()
            );

    }

    @Override
    public void updateReservationNotification(Reservation reservation, List<Employee> employees) {
        for (Employee employee : employees) {
            notificationService.notifyUser(
                    employee,
                    NotificationType.RESERVATION_UPDATED,
                    "Lịch họp đã được cập nhật: " + reservation.getTitle(),
                    "reservation",
                    reservation.getReservationId()
            );
        }
    }

    @Override
    public List<Reservation> cancelReservation(List<Long> reservationIds) {
        List<Reservation> reservations = new ArrayList<>();
        reservationIds.forEach(reservationId -> {
            Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
            if (reservation != null) {
                reservation.setStatusReservation(StatusReservation.CANCELED);
                reservation.setTimeCancel(new Date());
                reservationRepository.save(reservation);
                reservations.add(reservation);
                if(reservation.getAttendants() != null) {
                    for (Employee employee : reservation.getAttendants()) {
                        notificationService.notifyUser(
                                employee,
                                NotificationType.RESERVATION_CANCELLED,
                                "Cuộc họp đã bị hủy: " + reservation.getTitle(),
                                "reservation",
                                reservation.getReservationId()
                        );
                    }
                }
            }
        });
        return reservations;
    }

    @Override
    public List<Reservation> cancelReservationFrequency(List<Long> requestFormIds) {
        List<Reservation> reservations = new ArrayList<>();
        requestFormIds.forEach(requestFormId -> {
            RequestForm requestForm = requestFormRepository.findById(requestFormId).orElse(null);
            if (requestForm != null) {
                requestFormRepository.save(requestForm);
                if(requestForm.getReservations() != null) {
                    for (Reservation reservation : requestForm.getReservations()) {
                        reservation.setStatusReservation(StatusReservation.CANCELED);
                        reservationRepository.save(reservation);
                        reservations.add(reservation);
                        if(reservation.getAttendants() != null) {
                            for (Employee employee : reservation.getAttendants()) {
                                notificationService.notifyUser(
                                        employee,
                                        NotificationType.RESERVATION_CANCELLED,
                                        "Cuộc họp đã bị hủy: " + reservation.getTitle(),
                                        "reservation",
                                        reservation.getReservationId()
                                );
                            }
                        }
                    }
                }
            }
        });
        return reservations;
    }


    private Reservation convertReservationToCreate(ReservationDTO reservationDTO) {
        Reservation reservation = new Reservation();
        reservation.setDescription(reservationDTO.getDescription());
        reservation.setFilePaths(reservationDTO.getFilePaths());
        reservation.setFrequency(reservationDTO.getFrequency());
        reservation.setNote(reservation.getNote());
        reservation.setTime(reservationDTO.getTime());
        reservation.setTimeStart(reservationDTO.getTimeStart());
        reservation.setTimeEnd(reservationDTO.getTimeEnd());
        reservation.setTitle(reservationDTO.getTitle());
        reservation.setTotal(totalMoney(reservationDTO.getServiceIds(), reservationDTO.getRoomId(), reservationDTO.getTimeStart(), reservationDTO.getTimeEnd()));
        reservation.setStatusReservation(StatusReservation.PENDING);
        reservation.setBooker(employeeRepository.findById(reservationDTO.getBookerId()).orElse(null));
        reservation.setRoom(roomRepository.findById(reservationDTO.getRoomId()).orElse(null));
        List<Service> services = new ArrayList<>();
        reservationDTO.getServiceIds().forEach(s -> services.add(serviceRepository.findById(s).orElse(null)));
        reservation.setServices(services);

        List<Employee> employees = new ArrayList<>();
        reservationDTO.getEmployeeIds().forEach(e -> employees.add(employeeRepository.findById(e).orElse(null)));
        reservation.setAttendants(employees);
        return reservationRepository.save(reservation);
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
            reservationViewDTO.setFrequency(r.getFrequency());
            reservationViewDTO.setNote(r.getNote());
            reservationViewDTO.setStatusReservation(r.getStatusReservation());
            reservationViewDTOS.add(reservationViewDTO);
        });
        return reservationViewDTOS;
    }
    private int totalMoney(List<Long> serviceIds, Long roomId, Date timeStart, Date timeEnd) {
        Price price = priceRepository.findActivePrice(timeStart);
        if(price == null) {
            return 0;
        }
        if(price.getPriceRoom() == null || price.getPriceService() == null) {
            return 0;
        }
        int priceRoom = priceRoomRepository.findPriceRoomByRoom_RoomIdAndPrice_PriceId(roomId, price.getPriceId()).getValue();

        int total = 0;
        for(Long serviceId : serviceIds){
            total += priceServiceRepository.findPriceServiceByService_ServiceIdAndPrice_PriceId(serviceId, price.getPriceId()).getValue();
        }
        int diffInMinutes = (int)(timeEnd.getTime() - timeStart.getTime()) / (60 * 1000);
        System.out.println("diffInMinutes: " + diffInMinutes);
        System.out.println("priceRoom: " + priceRoom);

        total += priceRoom * diffInMinutes/10;
        return total;
    }
}
