package com.disaster.dto;

/**
 * DTO classes for Auth API requests and responses.
 */
public class AuthDtos {

    // ── Login Request ──────────────────────────────────
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail()    { return email; }
        public String getPassword() { return password; }
        public void setEmail(String e)    { this.email = e; }
        public void setPassword(String p) { this.password = p; }
    }

    // ── Signup Request ─────────────────────────────────
    public static class SignupRequest {
        private String name;
        private String email;
        private String password;

        public String getName()     { return name; }
        public String getEmail()    { return email; }
        public String getPassword() { return password; }
        public void setName(String n)     { this.name = n; }
        public void setEmail(String e)    { this.email = e; }
        public void setPassword(String p) { this.password = p; }
    }

    // ── Auth Response (returned after login/signup) ───
    public static class AuthResponse {
        private String token;
        private Long id;
        private String name;
        private String email;
        private String role;

        public AuthResponse(String token, Long id, String name, String email, String role) {
            this.token = token;
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }

        public String getToken() { return token; }
        public Long getId()      { return id; }
        public String getName()  { return name; }
        public String getEmail() { return email; }
        public String getRole()  { return role; }
    }

    // ── Quiz Attempt Request ───────────────────────────
    public static class QuizAttemptRequest {
        private Long userId;
        private Long scenarioId;
        private int score;
        private int totalQuestions;

        public Long getUserId()         { return userId; }
        public Long getScenarioId()     { return scenarioId; }
        public int getScore()           { return score; }
        public int getTotalQuestions()  { return totalQuestions; }
        public void setUserId(Long id)          { this.userId = id; }
        public void setScenarioId(Long id)      { this.scenarioId = id; }
        public void setScore(int s)             { this.score = s; }
        public void setTotalQuestions(int t)    { this.totalQuestions = t; }
    }
}
