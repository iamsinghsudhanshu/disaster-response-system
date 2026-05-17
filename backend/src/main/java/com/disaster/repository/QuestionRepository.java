package com.disaster.repository;

import com.disaster.model.Question;
import com.disaster.model.Scenario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByScenario(Scenario scenario);
    long countByScenario(Scenario scenario);
}
