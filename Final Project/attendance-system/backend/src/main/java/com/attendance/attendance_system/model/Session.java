package com.attendance.attendance_system.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "sessions")
public class Session {
    @Id
    private String id;
    private String sessionToken;
    private String sessionName;
    private String section;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private boolean active;
}
