package com.disaster.service;

import com.disaster.dto.AuthDtos.QuizAttemptRequest;
import com.disaster.model.QuizAttempt;
import com.disaster.model.Scenario;
import com.disaster.model.User;
import com.disaster.repository.QuizAttemptRepository;
import com.disaster.repository.ScenarioRepository;
import com.disaster.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizAttemptService {

    @Autowired
    private QuizAttemptRepository attemptRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScenarioRepository scenarioRepository;

    // ── Save a completed quiz attempt ──────────────────

    public QuizAttempt saveAttempt(QuizAttemptRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Scenario scenario = scenarioRepository.findById(request.getScenarioId())
                .orElseThrow(() -> new RuntimeException("Scenario not found"));

        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(user);
        attempt.setScenario(scenario);
        attempt.setScore(request.getScore());
        attempt.setTotalQuestions(request.getTotalQuestions());

        return attemptRepository.save(attempt);
    }

    // ── Get all attempts for a user ────────────────────

    public List<QuizAttempt> getUserAttempts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return attemptRepository.findByUserOrderByAttemptedAtDesc(user);
    }
}
