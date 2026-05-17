package com.disaster.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.disaster.model.Question;
import com.disaster.model.Scenario;
import com.disaster.repository.QuestionRepository;
import com.disaster.repository.ScenarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Business logic for quiz questions with full CRUD operations.
 */
@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ScenarioRepository scenarioRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // ── Get all questions for a scenario ──────────────

    public List<Question> getQuestionsByScenarioId(Long scenarioId) {
        Scenario scenario = scenarioRepository.findById(scenarioId)
                .orElseThrow(() -> new RuntimeException("Scenario not found: " + scenarioId));
        return questionRepository.findByScenario(scenario);
    }

    // ── Get all questions ─────────────────────────────

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    // ── Add question ──────────────────────────────────

    public Question addQuestion(Map<String, Object> body) {
        Long scenarioId = Long.valueOf(body.get("scenarioId").toString());

        Scenario scenario = scenarioRepository.findById(scenarioId)
                .orElseThrow(() -> new RuntimeException("Scenario not found: " + scenarioId));

        Question q = new Question();
        q.setQuestion((String) body.get("question"));
        q.setCorrectAnswer((String) body.get("correctAnswer"));
        q.setExplanation((String) body.get("explanation"));
        q.setScenario(scenario);

        // Convert options array to JSON string for storage
        Object rawOptions = body.get("options");
        try {
            if (rawOptions instanceof List) {
                q.setOptions(objectMapper.writeValueAsString(rawOptions));
            } else {
                q.setOptions(rawOptions.toString());
            }
        } catch (Exception e) {
            q.setOptions(rawOptions.toString());
        }

        return questionRepository.save(q);
    }

    // ── Update question ───────────────────────────────

    public Question updateQuestion(Long id, Map<String, Object> body) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found: " + id));

        if (body.containsKey("question"))
            q.setQuestion((String) body.get("question"));
        if (body.containsKey("correctAnswer"))
            q.setCorrectAnswer((String) body.get("correctAnswer"));
        if (body.containsKey("explanation"))
            q.setExplanation((String) body.get("explanation"));
        if (body.containsKey("scenarioId")) {
            Long scenarioId = Long.valueOf(body.get("scenarioId").toString());
            Scenario scenario = scenarioRepository.findById(scenarioId)
                    .orElseThrow(() -> new RuntimeException("Scenario not found"));
            q.setScenario(scenario);
        }
        if (body.containsKey("options")) {
            try {
                Object rawOptions = body.get("options");
                if (rawOptions instanceof List) {
                    q.setOptions(objectMapper.writeValueAsString(rawOptions));
                } else {
                    q.setOptions(rawOptions.toString());
                }
            } catch (Exception e) {
                q.setOptions(body.get("options").toString());
            }
        }

        return questionRepository.save(q);
    }

    // ── Delete question ───────────────────────────────

    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new RuntimeException("Question not found: " + id);
        }
        questionRepository.deleteById(id);
    }
}
