package vn.com.kltn_project_v1.dtos;

import lombok.*;
import vn.com.kltn_project_v1.model.NotificationType;

import java.time.LocalDateTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class NotificationDTO {
    private Long id;
    private NotificationType type;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;
    private Long targetId;
    private String targetType;
}
