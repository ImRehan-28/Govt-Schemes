package com.rehan.scheme.dto;

import lombok.Data;

@Data
public class SchemeRequestDto {

    private String name;
    private String description;
    private String category;
    private String eligibility;
    private String benefits;
    private String state;
    private String ministry;
    private String link;

}
