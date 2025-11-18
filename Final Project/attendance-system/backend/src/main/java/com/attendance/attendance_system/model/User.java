package com.attendance.attendance_system.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String section;

    private List<AttendanceRecord> attendanceRecords = new ArrayList<>();

    public void addAttendanceSession(String sessionId, String sessionName, boolean present, LocalDateTime joinTime) {
        if (attendanceRecords == null) {
            attendanceRecords = new ArrayList<>();
        }
        attendanceRecords.add(new AttendanceRecord(sessionId, sessionName, present, joinTime));
    }

    public boolean markPresent(String token) {
        if (attendanceRecords == null) return false;

        for (AttendanceRecord record : attendanceRecords) {
            if (record.getSessionId().equals(token)) {
                record.setPresent(true);
                record.setJoinTime(LocalDateTime.now());
                return true;
            }
        }
        return false;
    }

    @Data
    public static class AttendanceRecord {
        private String sessionId;
        private String sessionName;
        private boolean present;
        private LocalDateTime joinTime;

        public AttendanceRecord(String sessionId, String sessionName, boolean present, LocalDateTime joinTime) {
            this.sessionId = sessionId;
            this.sessionName = sessionName;
            this.present = present;
            this.joinTime = joinTime;
        }
    }
}
