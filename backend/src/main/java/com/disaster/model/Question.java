package com.disaster.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

/**
 * Quiz question linked to a Scenario.
 * 'options' is stored as a JSON string (array) in MySQL TEXT column.
 */
@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String question;

    // Stored as JSON array string: ["opt1","opt2","opt3","opt4"]
    @Column(columnDefinition = "TEXT", nullable = false)
    private String options;

    @Column(nullable = false)
    private String correctAnswer;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "scenario_id", nullable = false)
    @JsonIgnoreProperties("questions")
    private Scenario scenario;

    // ── Getters ───────────────────────────────────────

    public Long getId()            { return id; }
    public String getQuestion()    { return question; }
    public String getOptions()     { return options; }
    public String getCorrectAnswer(){ return correctAnswer; }
    public String getExplanation() { return explanation; }
    public Scenario getScenario()  { return scenario; }

    // ── Setters ───────────────────────────────────────

    public void setId(Long id)                   { this.id = id; }
    public void setQuestion(String q)            { this.question = q; }
    public void setOptions(String opts)          { this.options = opts; }
    public void setCorrectAnswer(String ans)     { this.correctAnswer = ans; }
    public void setExplanation(String exp)       { this.explanation = exp; }
    public void setScenario(Scenario scenario)   { this.scenario = scenario; }
}
