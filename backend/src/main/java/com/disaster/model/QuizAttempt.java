package com.disaster.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Records a user's completed quiz attempt for analytics/dashboard.
 */
@Entity
@Table(name = "quiz_attempts")
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "scenario_id", nullable = false)
    private Scenario scenario;

    private int score;
    private int totalQuestions;
    private LocalDateTime attemptedAt;

    @PrePersist
    protected void onCreate() {
        attemptedAt = LocalDateTime.now();
    }

    // ── Getters ───────────────────────────────────────

    public Long getId()                  { return id; }
    public User getUser()                { return user; }
    public Scenario getScenario()        { return scenario; }
    public int getScore()                { return score; }
    public int getTotalQuestions()       { return totalQuestions; }
    public LocalDateTime getAttemptedAt(){ return attemptedAt; }

    // ── Setters ───────────────────────────────────────

    public void setId(Long id)                      { this.id = id; }
    public void setUser(User user)                  { this.user = user; }
    public void setScenario(Scenario scenario)      { this.scenario = scenario; }
    public void setScore(int score)                 { this.score = score; }
    public void setTotalQuestions(int total)        { this.totalQuestions = total; }
    public void setAttemptedAt(LocalDateTime time)  { this.attemptedAt = time; }
}
