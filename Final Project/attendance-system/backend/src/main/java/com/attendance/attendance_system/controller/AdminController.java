package com.attendance.attendance_system.controller;

import com.attendance.attendance_system.dto.TokenResponse;
import com.attendance.attendance_system.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;

@CrossOrigin(
        origins = "http://localhost:5173",
        methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.OPTIONS},
        allowedHeaders = {"Content-Type", "X-User-Id", "Authorization"}
)
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AttendanceService attendanceService;
    private static final String ADMIN = "admin";

    @GetMapping("/sessions")
    public ResponseEntity<List<Map<String, Object>>> getActiveSessions() {
        List<Map<String, Object>> sessions = attendanceService.getActiveSessions();
        return ResponseEntity.ok(sessions);
    }

    @PostMapping("/generate-token")
    public ResponseEntity<TokenResponse> generateToken(@RequestParam String section, @RequestParam String sessionName) {
        String adminId = ADMIN;
        TokenResponse response = attendanceService.generateToken(adminId, section, sessionName);
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/generate-token", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return new ResponseEntity<>(HttpStatus.OK);
    }
}