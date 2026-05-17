package com.disaster.controller;

import com.disaster.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Admin-only endpoints for dashboard statistics.
 * Protected by ROLE_ADMIN in SecurityConfig.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private ScenarioRepository scenarioRepository;
    @Autowired private QuestionRepository questionRepository;
    @Autowired private QuizAttemptRepository attemptRepository;

    // GET /api/admin/stats — dashboard KPIs
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        long totalUsers     = userRepository.countByRole("USER");
        long totalScenarios = scenarioRepository.count();
        long totalQuestions = questionRepository.count();
        long totalAttempts  = attemptRepository.count();

        return ResponseEntity.ok(Map.of(
            "totalUsers",     totalUsers,
            "totalScenarios", totalScenarios,
            "totalQuestions", totalQuestions,
            "totalAttempts",  totalAttempts
        ));
    }

    // GET /api/admin/users — list all users
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
