package com.disaster.config;

import com.disaster.model.User;
import com.disaster.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * FIX: Runs once on every startup.
 *
 * WHY THIS IS NEEDED:
 * data.sql uses "INSERT IGNORE" which silently skips re-inserting
 * the admin if the row already exists — even if the stored hash is
 * corrupt. This class bypasses SQL entirely and uses Spring's own
 * PasswordEncoder to hash at runtime, guaranteeing the correct hash
 * is always stored.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail    = "admin@disaster.com";
        String adminPassword = "admin123";

        Optional<User> existing = userRepository.findByEmail(adminEmail);

        if (existing.isEmpty()) {
            // Admin row does not exist — create it fresh
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("[DisasterReady] Admin created: " + adminEmail);
        } else {
            // Admin row exists — always overwrite the hash with a freshly encoded one.
            // This fixes any stale/corrupt hash that survived from data.sql.
            User admin = existing.get();
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("[DisasterReady] Admin password re-hashed: " + adminEmail);
        }
    }
}
