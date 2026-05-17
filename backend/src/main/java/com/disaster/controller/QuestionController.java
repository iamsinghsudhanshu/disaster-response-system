package com.disaster.controller;

import com.disaster.model.Question;
import com.disaster.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for quiz questions.
 * GET endpoints are public; POST/PUT/DELETE require ADMIN role (enforced in SecurityConfig).
 */
@RestController
@RequestMapping("/api")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    // GET /api/scenarios/{scenarioId}/questions  — fetch questions for a scenario
    @GetMapping("/scenarios/{scenarioId}/questions")
    public ResponseEntity<List<Question>> getByScenario(@PathVariable Long scenarioId) {
        try {
            return ResponseEntity.ok(questionService.getQuestionsByScenarioId(scenarioId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/questions  — all questions (admin)
    @GetMapping("/questions")
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    // POST /api/questions  — add a question (ADMIN)
    @PostMapping("/questions")
    public ResponseEntity<?> addQuestion(@RequestBody Map<String, Object> body) {
        try {
            Question saved = questionService.addQuestion(body);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/questions/{id}  — update a question (ADMIN)
    @PutMapping("/questions/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id,
                                             @RequestBody Map<String, Object> body) {
        try {
            Question updated = questionService.updateQuestion(id, body);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /api/questions/{id}  — delete a question (ADMIN)
    @DeleteMapping("/questions/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        try {
            questionService.deleteQuestion(id);
            return ResponseEntity.ok(Map.of("message", "Question deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
