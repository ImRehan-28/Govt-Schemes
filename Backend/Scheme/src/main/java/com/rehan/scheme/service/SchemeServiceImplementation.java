package com.rehan.scheme.service;

import com.rehan.scheme.dto.SchemeRequestDto;
import com.rehan.scheme.dto.SchemeResponseDto;
import com.rehan.scheme.entity.Scheme;
import com.rehan.scheme.exception.ResourceNotFoundException;
import com.rehan.scheme.repository.SchemeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchemeServiceImplementation implements SchemeService {

    @Autowired
    private SchemeRepository schemeRepo;

    private SchemeResponseDto toDto(Scheme scheme) {
        SchemeResponseDto dto = new SchemeResponseDto();
        dto.setId(scheme.getId());
        dto.setName(scheme.getName());
        dto.setDescription(scheme.getDescription());
        dto.setCategory(scheme.getCategory());
        dto.setEligibility(scheme.getEligibility());
        dto.setBenefits(scheme.getBenefits());
        dto.setState(scheme.getState());
        dto.setMinistry(scheme.getMinistry());
        dto.setLink(scheme.getLink());
        dto.setStatus(scheme.getStatus());
        return dto;
    }

    @Override
    public SchemeResponseDto saveScheme(SchemeRequestDto dto) {
        Scheme scheme = new Scheme();
        scheme.setName(dto.getName());
        scheme.setDescription(dto.getDescription());
        scheme.setCategory(dto.getCategory());
        scheme.setEligibility(dto.getEligibility());
        scheme.setBenefits(dto.getBenefits());
        scheme.setState(dto.getState());
        scheme.setMinistry(dto.getMinistry());
        scheme.setLink(dto.getLink());
        scheme.setStatus("PENDING");
        return toDto(schemeRepo.save(scheme));
    }

    @Override
    public List<SchemeResponseDto> getFilteredSchemes(String category, String state) {

        List<Scheme> schemes;

        if (category != null && state != null)
            schemes = schemeRepo.findByCategoryAndState(category, state);
        else if (category != null)
            schemes = schemeRepo.findByCategory(category);
        else if (state != null)
            schemes = schemeRepo.findByState(state);
        else
            schemes = schemeRepo.findAll();

        return schemes.stream()
                .filter(s -> "APPROVED".equalsIgnoreCase(s.getStatus()))
                .map(this::toDto).toList();
    }

    @Override
    public SchemeResponseDto getSchemeById(Long id) {
        Scheme scheme = schemeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found"));
        if (!"APPROVED".equalsIgnoreCase(scheme.getStatus())) {
            throw new RuntimeException("Scheme not approved yet");
        }
        return toDto(scheme);
    }

    @Override
    public List<SchemeResponseDto> getEligibleSchemes(
            String category,
            String state,
            Integer age,
            Double income,
            String gender) {

        List<Scheme> schemes = schemeRepo.findByCategoryAndState(category, state);

        return schemes.stream()
                .filter(s -> "APPROVED".equalsIgnoreCase(s.getStatus()))
                .filter(scheme -> {
                    boolean categoryMatch = scheme.getEligibility() != null &&
                            scheme.getEligibility().equalsIgnoreCase(category);
                    boolean ageMatch = (age == null) ||
                            (scheme.getMinAge() == null || age >= scheme.getMinAge()) &&
                            (scheme.getMaxAge() == null || age <= scheme.getMaxAge());
                    boolean incomeMatch = (income == null) ||
                            (scheme.getMaxIncome() == null || income <= scheme.getMaxIncome());
                    boolean genderMatch = (gender == null) || scheme.getGender() == null ||
                            scheme.getGender().equalsIgnoreCase("All") ||
                            scheme.getGender().equalsIgnoreCase(gender);
                    return categoryMatch && ageMatch && incomeMatch && genderMatch;
                })
                .map(this::toDto).toList();
    }

    @Override
    public void approveScheme(Long id) {
        Scheme scheme = schemeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found"));

        scheme.setStatus("APPROVED");
        schemeRepo.save(scheme);
    }

    @Override
    public void rejectScheme(Long id) {
        Scheme scheme = schemeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found"));

        scheme.setStatus("REJECTED");
        schemeRepo.save(scheme);
    }

    @Override
    public List<SchemeResponseDto> getSchemesWithPagination(int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());

        Page<Scheme> schemePage = schemeRepo.findByStatus("APPROVED", pageable);

        return schemePage.getContent().stream().map(this::toDto).toList();
    }

    @Override
    public List<SchemeResponseDto> searchSchemes(String keyword) {
        return schemeRepo.findByNameContainingIgnoreCaseAndStatus(keyword, "APPROVED")
                .stream().map(this::toDto).toList();
    }

    @Override
    public List<SchemeResponseDto> getAllSchemesForAdmin() {
        return schemeRepo.findAll().stream().map(this::toDto).toList();
    }
}