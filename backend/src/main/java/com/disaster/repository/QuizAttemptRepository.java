package com.disaster.repository;

import com.disaster.model.QuizAttempt;
import com.disaster.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    List<QuizAttempt> findByUserOrderByAttemptedAtDesc(User user);

    @Query("SELECT COUNT(DISTINCT qa.user) FROM QuizAttempt qa")
    long countDistinctUsers();

    long countByUser(User user);
}
