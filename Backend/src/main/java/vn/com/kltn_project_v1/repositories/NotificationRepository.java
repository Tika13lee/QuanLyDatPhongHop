package vn.com.kltn_project_v1.repositories;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.com.kltn_project_v1.model.Notification;

import java.util.List;

@Repository

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByEmployeeEmployeeIdOrderByCreatedAtDesc(Long employeeId);

    Long countByEmployeeEmployeeIdAndReadFalse(Long employeeId);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.read = true WHERE n.employee.employeeId = :userId AND n.read = false")
    int markAllAsReadByUser(@Param("userId") Long userId);
}