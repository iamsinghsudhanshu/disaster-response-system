package com.disaster.service;

import com.disaster.model.Scenario;
import com.disaster.repository.ScenarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ScenarioService {

    @Autowired
    private ScenarioRepository scenarioRepository;

    public List<Scenario> getAllScenarios() {
        return scenarioRepository.findAll();
    }

    public Optional<Scenario> getScenarioById(Long id) {
        return scenarioRepository.findById(id);
    }

    public Scenario addScenario(Scenario scenario) {
        return scenarioRepository.save(scenario);
    }

    public Scenario updateScenario(Long id, Scenario updated) {
        Scenario existing = scenarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scenario not found: " + id));
        existing.setName(updated.getName());
        existing.setIcon(updated.getIcon());
        existing.setDescription(updated.getDescription());
        existing.setColor(updated.getColor());
        return scenarioRepository.save(existing);
    }

    public void deleteScenario(Long id) {
        scenarioRepository.deleteById(id);
    }
}
