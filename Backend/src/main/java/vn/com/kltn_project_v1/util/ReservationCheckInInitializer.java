package vn.com.kltn_project_v1.util;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import vn.com.kltn_project_v1.model.NotificationType;
import vn.com.kltn_project_v1.model.Reservation;
import vn.com.kltn_project_v1.model.StatusReservation;
import vn.com.kltn_project_v1.repositories.ReservationRepository;
import vn.com.kltn_project_v1.services.INotification;
import vn.com.kltn_project_v1.services.IReservation;
import vn.com.kltn_project_v1.services.impl.NotificationService;
import vn.com.kltn_project_v1.services.impl.ReservationService;

import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class ReservationCheckInInitializer implements ApplicationRunner {
    private final ReservationRepository reservationRepository;
    private final INotification notificationService;
    @Scheduled(cron = "0 */10 7-23 * * *") // Chạy mỗi 0 và 10 phút từ 7h đến 23h
    public void checkMissCheckIn(){
        System.out.println("🔍 Kiểm tra các lịch đặt phòng...");
        Date dateNow = new Date();
        List<Reservation> reservations = reservationRepository.findReservationsInDay(dateNow);
        reservations.forEach(reservation -> {
            if (reservation.getTimeEnd().before(dateNow)&&reservation.getStatusReservation().equals(StatusReservation.WAITING)){
                reservation.setStatusReservation(StatusReservation.NOT_CHECKED_IN);
                reservationRepository.save(reservation);
                reservation.getAttendants().forEach(attendant -> {
                    notificationService.notifyUser(
                            attendant,
                            NotificationType.FORGOT_CHECKIN,
                            "Bạn đã không check in cho lịch đặt phòng: " + reservation.getTitle(),
                            "reservation",
                            reservation.getReservationId()
                    );
                });
            }
            long diffInMillis = reservation.getTimeStart().getTime() - dateNow.getTime();
            long diffInMinutes = TimeUnit.MILLISECONDS.toMinutes(diffInMillis);

            if (diffInMinutes == 10 && reservation.getStatusReservation().equals(StatusReservation.WAITING)) {
                reservation.getAttendants().forEach(attendant -> {
                    notificationService.notifyUser(
                            attendant,
                            NotificationType.CHECKIN_REMINDER,
                            "Bạn chuẩn bị có lịch đặt phòng: " + reservation.getTitle() + " trong 10 phút nữa.",
                            "reservation",
                            reservation.getReservationId()
                    );
                });
            }
        });
    }


    @Override
    public void run(ApplicationArguments args) throws Exception {
        checkMissCheckIn();
    }
}
