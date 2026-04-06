package com.rehan.scheme.dto;

import lombok.Data;

@Data
public class SchemeResponseDto {
    private Long id;
    private String name;
    private String description;
    private String category;
    private String eligibility;
    private String benefits;
    private String state;
    private String ministry;
    private String link;
    private String status;
}