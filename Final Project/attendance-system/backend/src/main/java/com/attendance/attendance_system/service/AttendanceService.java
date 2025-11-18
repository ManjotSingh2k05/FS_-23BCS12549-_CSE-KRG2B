package com.attendance.attendance_system.service;

import com.attendance.attendance_system.dto.AttendanceResponse;
import com.attendance.attendance_system.dto.CheckInRecord;
import com.attendance.attendance_system.dto.TokenResponse;
import com.attendance.attendance_system.model.Session;
import com.attendance.attendance_system.model.User;
import com.attendance.attendance_system.repository.SessionRepository;
import com.attendance.attendance_system.repository.UserRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final MongoTemplate mongoTemplate;

    // --- ADMIN METHODS ---
    public TokenResponse generateToken(String adminId, String section, String sessionName) {
        int durationMinutes = 5;
        String token = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();

        Session session = Session.builder()
                .sessionToken(token)
                .sessionName(sessionName)
                .section(section)
                .createdBy(adminId)
                .createdAt(now)
                .expiresAt(now.plusMinutes(durationMinutes))
                .active(true)
                .build();

        sessionRepository.save(session);


        Query conditionalPushQuery = new Query(
                Criteria.where("section").is(section)
                        .and("attendanceRecords.sessionId").ne(token)
        );
        Update pushUpdate = new Update().push("attendanceRecords",
                new User.AttendanceRecord(token, sessionName, false, null));

        mongoTemplate.updateMulti(conditionalPushQuery, pushUpdate, User.class);

        return new TokenResponse(token, durationMinutes);
    }


    // --- USER METHODS ---
    public List<Map<String, Object>> getActiveSessions() {
        return sessionRepository.findAll().stream()
                .map(session -> {
                    Map<String, Object> sessionMap = new HashMap<>();
                    sessionMap.put("sessionId", session.getId());
                    sessionMap.put("sessionName", session.getSessionName());
                    sessionMap.put("section", session.getSection());
                    sessionMap.put("createdBy", session.getCreatedBy());
                    sessionMap.put("createdAt", session.getCreatedAt());
                    sessionMap.put("expiresAt", session.getExpiresAt());
                    sessionMap.put("active", session.isActive());
                    return sessionMap;
                })
                .toList();
    }

    public AttendanceResponse checkIn(String token, String userId) {
        Optional<Session> sessionOpt = sessionRepository.findBySessionToken(token);
        if (sessionOpt.isEmpty()) {
            return new AttendanceResponse("Invalid or unknown session token.", HttpStatus.NOT_FOUND);
        }

        Session session = sessionOpt.get();

        if (!session.isActive() || LocalDateTime.now().isAfter(session.getExpiresAt())) {
            return new AttendanceResponse("Session has expired.", HttpStatus.FORBIDDEN);
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return new AttendanceResponse("User not found.", HttpStatus.NOT_FOUND);
        }
        User user = userOpt.get();


        Optional<User.AttendanceRecord> recordOpt = user.getAttendanceRecords().stream()
                .filter(r -> r.getSessionId().equals(token))
                .findFirst();

        if (recordOpt.isEmpty()) {
            return new AttendanceResponse("No attendance record found for this session.", HttpStatus.NOT_FOUND);
        }

        User.AttendanceRecord record = recordOpt.get();

        if (record.isPresent()) {
            return new AttendanceResponse("You have already checked in.", HttpStatus.CONFLICT);
        }
        LocalDateTime joinTime = LocalDateTime.now();

        Query query = new Query(Criteria.where("_id").is(userId)
                .and("attendanceRecords.sessionId").is(token));

        Update update = new Update()
                .set("attendanceRecords.$.present", true)
                .set("attendanceRecords.$.joinTime", joinTime);

        var result = mongoTemplate.updateFirst(query, update, User.class);

        if (result.getModifiedCount() > 0) {
            return new AttendanceResponse("Attendance recorded successfully for " + session.getSessionName(), HttpStatus.OK);
        } else {
            return new AttendanceResponse("Could not update attendance record. Try again.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // --- ADMIN HELPER METHOD ---
    public List<CheckInRecord> getCheckInRecords(String sessionToken) {
        List<User> students = userRepository.findByAttendanceRecordsSessionId(sessionToken);

        return students.stream()
                .flatMap(user -> user.getAttendanceRecords().stream()
                        .filter(r -> r.getSessionId().equals(sessionToken) && r.isPresent())
                        .map(r -> new CheckInRecord(user.getId(), r.getJoinTime())))
                .collect(Collectors.toList());
    }
}
