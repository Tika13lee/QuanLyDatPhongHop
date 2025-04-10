package vn.com.kltn_project_v1.services;

import vn.com.kltn_project_v1.dtos.NotificationDTO;
import vn.com.kltn_project_v1.model.Employee;
import vn.com.kltn_project_v1.model.NotificationType;
import vn.com.kltn_project_v1.model.RequestForm;

import java.util.List;

public interface INotification {
    public void notifyUser(Employee employee, NotificationType type, String message, String targetType, Long targetId);
    public List<NotificationDTO> getUserNotifications(Long employeeId);
    public Long countUnreadNotifications(Long employeeId);

    void approveNotification(RequestForm requestForm, Employee approver);

    public int markAllAsRead(Long employeeId);
}
