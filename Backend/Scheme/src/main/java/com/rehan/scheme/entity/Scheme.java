package com.rehan.scheme.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description ;
    private String category;
    private String eligibility;
    private String benefits;
    private String state;
    private String ministry;
    private String link;
    private Integer minAge;
    private Integer maxAge;
    private Double maxIncome;
    private String gender; // Male / Female / All
    private String status;
}
