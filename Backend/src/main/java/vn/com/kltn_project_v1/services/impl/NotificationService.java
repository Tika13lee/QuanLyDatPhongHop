package vn.com.kltn_project_v1.services.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import vn.com.kltn_project_v1.dtos.NotificationDTO;
import vn.com.kltn_project_v1.model.Employee;
import vn.com.kltn_project_v1.model.Notification;
import vn.com.kltn_project_v1.model.NotificationType;
import vn.com.kltn_project_v1.repositories.NotificationRepository;
import vn.com.kltn_project_v1.services.INotification;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService implements INotification {
    private final NotificationRepository repo;
    private final SimpMessagingTemplate messagingTemplate;
    private final ModelMapper modelMapper;
    @Override
    public void notifyUser(Employee employee, NotificationType type, String message, String targetType, Long targetId) {
        Notification n = new Notification();
        n.setEmployee(employee);
        n.setType(type);
        n.setMessage(message);
        n.setTargetType(targetType);
        n.setTargetId(targetId);
        repo.save(n);
        messagingTemplate.convertAndSend("/topic/notifications/" + employee.getEmployeeId(), modelMapper.map(n, NotificationDTO.class));
    }

    @Override
    public List<NotificationDTO> getUserNotifications(Long employeeId) {
        return repo.findByEmployeeEmployeeIdOrderByCreatedAtDesc(employeeId)
                .stream()
                .map(notification -> modelMapper.map(notification, NotificationDTO.class))
                .toList();
    }

    @Override
    public Long countUnreadNotifications(Long employeeId) {
        return repo.countByEmployeeEmployeeIdAndReadFalse(employeeId);
    }

    @Override
    public int markAllAsRead(Long employeeId) {
        return repo.markAllAsReadByUser(employeeId);
    }

}
