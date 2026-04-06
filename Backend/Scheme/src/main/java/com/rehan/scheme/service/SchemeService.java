package com.rehan.scheme.service;

import com.rehan.scheme.dto.SchemeRequestDto;
import com.rehan.scheme.dto.SchemeResponseDto;
import com.rehan.scheme.entity.Scheme;

import java.util.List;

public interface SchemeService {
    SchemeResponseDto saveScheme(SchemeRequestDto dto);
    List<SchemeResponseDto> getFilteredSchemes(String category, String state);
    SchemeResponseDto getSchemeById(Long id);
    List<SchemeResponseDto> getEligibleSchemes(
            String category,
            String state,
            Integer age,
            Double income,
            String gender
    );
    void approveScheme(Long id);
    void rejectScheme(Long id);
    List<SchemeResponseDto> getSchemesWithPagination(int page, int size);
    List<SchemeResponseDto> searchSchemes(String keyword);
    List<SchemeResponseDto> getAllSchemesForAdmin();
}
