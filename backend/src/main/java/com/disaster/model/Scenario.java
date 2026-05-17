package com.disaster.model;

import jakarta.persistence.*;

/**
 * Disaster scenario (e.g. Flood, Earthquake).
 */
@Entity
@Table(name = "scenarios")
public class Scenario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String icon;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String color;

    // ── Getters ───────────────────────────────────────

    public Long getId()           { return id; }
    public String getName()       { return name; }
    public String getIcon()       { return icon; }
    public String getDescription(){ return description; }
    public String getColor()      { return color; }

    // ── Setters ───────────────────────────────────────

    public void setId(Long id)               { this.id = id; }
    public void setName(String name)         { this.name = name; }
    public void setIcon(String icon)         { this.icon = icon; }
    public void setDescription(String desc)  { this.description = desc; }
    public void setColor(String color)       { this.color = color; }
}
