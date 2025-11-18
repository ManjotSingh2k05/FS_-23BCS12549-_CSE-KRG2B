package com.attendance.attendance_system.repository;

import com.attendance.attendance_system.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    List<User> findBySection(String section);

    List<User> findByAttendanceRecordsSessionId(String sessionId);

    Optional<User> findByIdAndAttendanceRecordsSessionId(String userId, String sessionId);

}
