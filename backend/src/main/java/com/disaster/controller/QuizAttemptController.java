package com.disaster.controller;

import com.disaster.dto.AuthDtos.QuizAttemptRequest;
import com.disaster.model.QuizAttempt;
import com.disaster.service.QuizAttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Handles saving quiz results and returning user history for the dashboard.
 */
@RestController
@RequestMapping("/api/attempts")
public class QuizAttemptController {

    @Autowired
    private QuizAttemptService quizAttemptService;

    // POST /api/attempts  — save a completed quiz
    @PostMapping
    public ResponseEntity<?> saveAttempt(@RequestBody QuizAttemptRequest request) {
        try {
            QuizAttempt saved = quizAttemptService.saveAttempt(request);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/attempts/user/{userId}  — get quiz history for dashboard
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<QuizAttempt>> getUserAttempts(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(quizAttemptService.getUserAttempts(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
