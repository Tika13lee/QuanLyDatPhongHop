package vn.com.kltn_project_v1.services.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;

import vn.com.kltn_project_v1.dtos.Overview.ReservationViewDTO;
import vn.com.kltn_project_v1.dtos.ReservationDTO;
import vn.com.kltn_project_v1.entityRespones.RoomRespone;
import vn.com.kltn_project_v1.model.*;
import vn.com.kltn_project_v1.repositories.EmployeeRepository;
import vn.com.kltn_project_v1.repositories.ReservationRepository;
import vn.com.kltn_project_v1.repositories.RoomRepository;
import vn.com.kltn_project_v1.repositories.ServiceRepository;
import vn.com.kltn_project_v1.services.IReservation;

import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
@RequiredArgsConstructor
@org.springframework.stereotype.Service
public class ReservationService implements IReservation {
    private final ReservationRepository reservationRepository;
    private final ModelMapper modelMapper;
    private final RoomRepository roomRepository;
    private final ServiceRepository serviceRepository;
    private final EmployeeRepository employeeRepository;
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
    public List<ReservationViewDTO> getAllReservationPending(Long approverId) {
        List<Reservation> reservations = reservationRepository.findReservationsByStatusReservationPending(approverId);
        return convertApprovalReservation(reservations);
    }

    @Override
    public List<ReservationViewDTO> getAllReservationNoPending(Long ApproverId) {
        List<Reservation> reservations = reservationRepository.findReservationsByStatusReservationNoPending(ApproverId);
        return convertApprovalReservation(reservations);
    }

    @Override
    public List<ReservationViewDTO> getAllReservationNoApproved(Long ApproverId) {
        return convertApprovalReservation(reservationRepository.findReservationsByStatusReservationNoApproved(ApproverId));
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

    @Override
    public List<Reservation> createReservation(ReservationDTO reservationDTO) {
        List<Reservation> reservations = new ArrayList<>();
        if (!reservationDTO.getFrequency().equals(Frequency.ONE_TIME)) {
            Date timeStart = reservationDTO.getTimeStart();
            Date timeEnd = reservationDTO.getTimeEnd();
            int dayStart = timeStart.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().getDayOfMonth();
            int dayFinish = reservationDTO.getTimeFinishFrequency().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().getDayOfMonth();
            int monthStart = timeStart.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().getMonthValue();
            int monthFinish = reservationDTO.getTimeFinishFrequency().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().getMonthValue();

            if (reservationDTO.getFrequency().equals(Frequency.DAILY)) {
                while (monthStart <=monthFinish && dayStart <= dayFinish) {

                    Reservation reservation = convertReservationToCreate(reservationDTO);
                    reservation.setTimeStart(timeStart);
                    reservation.setTimeEnd(timeEnd);
                    reservationRepository.save(reservation);
                    reservations.add(reservation);
                    timeStart = new Date(timeStart.getTime() + 86400000);
                    timeEnd = new Date(timeEnd.getTime() + 86400000);
                    dayStart = timeStart.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().getDayOfMonth();
                    monthStart = timeStart.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().getMonthValue();
                }
            } else {
                while (monthStart <=monthFinish && dayStart <= dayFinish) {
                    Reservation reservation = convertReservationToCreate(reservationDTO);
                    reservation.setTimeStart(timeStart);
                    reservation.setTimeEnd(timeEnd);
                    reservationRepository.save(reservation);
                    reservations.add(reservation);
                    timeStart = new Date(timeStart.getTime() + 604800000);
                    timeEnd = new Date(timeEnd.getTime() + 604800000);
                    dayStart = timeStart.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().getDayOfMonth();
                    monthStart = timeStart.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().getMonthValue();
                }
            }
            return reservations;
        }else {
            Reservation reservation = convertReservationToCreate(reservationDTO);
            reservationRepository.save(reservation);

            return List.of(reservation);
        }

    }

    @Override
    public List<Reservation> getAllReservationByBooker(String phone, Date dayStart, Date dayEnd) {
        if (dayStart.getTime()>new Date().getTime()){
            dayStart=null;
        }
        return reservationRepository.findReservationsByBookerPhoneAndTime(phone,dayStart,dayEnd);
    }

    @Override
    public List<Reservation> approveReservation(List<Long> reservationIds) {
        List<Reservation> reservations = new ArrayList<>();
        reservationIds.forEach(r->{
            Reservation reservation = reservationRepository.findById(r).orElse(null);
            if (reservation != null) {
                reservation.setTimeApprove(new Date());
                reservation.setStatusReservation(StatusReservation.WAITING_PAYMENT);
                reservations.add(reservationRepository.save(reservation));
            }
        });
        return reservations;
    }

    @Override
    public List<Reservation> disApproveReservation(List<Long> reservationIds) {
        List<Reservation> reservations = new ArrayList<>();
        reservationIds.forEach(r->{
            Reservation reservation = reservationRepository.findById(r).orElse(null);
            if (reservation != null) {
                reservation.setTimeApprove(new Date());
                reservation.setStatusReservation(StatusReservation.NO_APPROVED);
                reservations.add(reservationRepository.save(reservation));
            }
        });
        return reservations;
    }

    @Override
    public List<ReservationViewDTO> getReservationsByStatusReservationAndBookerPhoneAndTimeAndApproverAndTitle(StatusReservation statusReservation, String phone, Date dayStart, Date dayEnd, String approverName, String title) {
        return convertApprovalReservation(reservationRepository.findReservationsByStatusReservationAndBookerPhoneAndTimeAndApproverAndTitle(statusReservation, phone, dayStart, dayEnd, approverName, title));
    }

    @Override
    public List<ReservationViewDTO> getReservationsByBookerPhone(String phone, StatusReservation statusReservation) {
        return convertApprovalReservation(reservationRepository.findReservationsByBookerPhoneAndStatusReservation(phone, statusReservation));
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
            reservationViewDTO.setTimeApprove(r.getTimeApprove());
            reservationViewDTOS.add(reservationViewDTO);
        });
        return reservationViewDTOS;
    }
    private int totalMoney(List<Long> serviceIds, Long roomId, Date timeStart, Date timeEnd) {
        int total = 0;
        for(Long serviceId : serviceIds){
            total += serviceRepository.findById(serviceId).get().getPrice().getValue();
        }
        Room room = roomRepository.findById(roomId).orElse(null);
        int diffInMinutes = (int)(timeEnd.getTime() - timeStart.getTime()) / (60 * 1000);
        assert room != null;
        total += room.getPrice().getValue() * diffInMinutes;
        return total;
    }
}
