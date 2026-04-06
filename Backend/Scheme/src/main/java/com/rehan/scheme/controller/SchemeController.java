package com.rehan.scheme.controller;

import com.rehan.scheme.config.JwtUtil;
import com.rehan.scheme.dto.SchemeRequestDto;
import com.rehan.scheme.dto.SchemeResponseDto;
import com.rehan.scheme.entity.Scheme;
import com.rehan.scheme.repository.SchemeRepository;
import com.rehan.scheme.service.GovtApiService;
import com.rehan.scheme.service.SchemeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schemes")
public class SchemeController {

    @Autowired
    private SchemeService schemeService;

    @Autowired
    SchemeRepository   schemeRepo;

    @Autowired
    private GovtApiService govtApiService;

    @Autowired
    private JwtUtil jwtUtil;

    private void checkAdmin(String header) {
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Unauthorized");
        }

        String token = header.substring(7);
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid token");
        }
    }

    @PostMapping
    public SchemeResponseDto createScheme(
            @RequestHeader("Authorization") String header,
            @RequestBody SchemeRequestDto dto) {

        checkAdmin(header);
        return schemeService.saveScheme(dto);
    }

    @GetMapping("/{id}")
    public SchemeResponseDto getSchemeById(@PathVariable Long id) {
        return schemeService.getSchemeById(id);
    }

    @GetMapping
    public List<SchemeResponseDto> getAllSchemes(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String state) {

        return schemeService.getFilteredSchemes(category, state);
    }

    @GetMapping("/page")
    public List<SchemeResponseDto> getSchemesWithPagination(
            @RequestParam int page,
            @RequestParam int size) {

        return schemeService.getSchemesWithPagination(page, size);
    }

    @GetMapping("/eligibility")
    public List<SchemeResponseDto> getEligibleSchemes(
            @RequestParam String category,
            @RequestParam String state,
            @RequestParam(required = false) Integer age,
            @RequestParam(required = false) Double income,
            @RequestParam(required = false) String gender) {

        return schemeService.getEligibleSchemes(category, state, age, income, gender);
    }

    @PutMapping("/{id}/approve")
    public String approveScheme(
            @RequestHeader("Authorization") String header,
            @PathVariable Long id) {

        schemeService.approveScheme(id);
        return "Approved";
    }

    @PutMapping("/{id}/reject")
    public String rejectScheme(
            @RequestHeader("Authorization") String header,
            @PathVariable Long id) {

        schemeService.rejectScheme(id);
        return "Rejected";
    }

    @GetMapping("/search")
    public List<SchemeResponseDto> searchSchemes(@RequestParam String keyword) {
        return schemeService.searchSchemes(keyword);
    }

    @GetMapping("/admin/all")
    public List<SchemeResponseDto> getAllSchemesAdmin(
            @RequestHeader("Authorization") String header) {
        checkAdmin(header);
        return schemeService.getAllSchemesForAdmin();
    }

    @PostMapping("/fetch-govt")
    public String fetchGovtSchemes(
            @RequestHeader("Authorization") String header) {

        checkAdmin(header);

        govtApiService.fetchAndSaveSchemes();

        return "Govt schemes fetched and saved (PENDING)";
    }


}