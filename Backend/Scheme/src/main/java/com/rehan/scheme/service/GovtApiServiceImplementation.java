package com.rehan.scheme.service;

import com.rehan.scheme.entity.Scheme;
import com.rehan.scheme.repository.SchemeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@Service
public class GovtApiServiceImplementation implements GovtApiService {

    @Autowired
    private SchemeRepository schemeRepo;

    @Override
    public void fetchAndSaveSchemes() {

        RestTemplate restTemplate = new RestTemplate();
        ObjectMapper mapper = new ObjectMapper();

        String url = "https://api.data.gov.in/resource/1bc2866f-dddd-48b7-89ad-b5dc423d00eb?api-key=579b464db66ec23bdd000001fe3dbb5423e44bc249bf5bf15d61f6f5&format=json&limit=20"; // replace

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, String.class
            );

            String body = response.getBody();
            if (body == null) throw new RuntimeException("Empty response from govt API");

            JsonNode root = mapper.readTree(body);
            JsonNode records = root.get("records");

            if (records == null || !records.isArray()) {
                throw new RuntimeException("No records found in govt API response");
            }

            for (JsonNode node : records) {
                Scheme scheme = new Scheme();

                String name = node.has("name_of_scheme") ? node.get("name_of_scheme").asText() : "Unknown Scheme";
                scheme.setName(name);

                String benefits = node.has("funds_released_during_2020_21")
                        ? String.valueOf(node.get("funds_released_during_2020_21").asDouble())
                        : "N/A";
                scheme.setBenefits(benefits);

                scheme.setDescription("Govt scheme data");
                scheme.setCategory("General");
                scheme.setEligibility("All");
                scheme.setState("India");
                scheme.setMinistry("Govt");
                scheme.setLink("https://data.gov.in");
                scheme.setStatus("PENDING");

                schemeRepo.save(scheme);
            }

        } catch (Exception e) {
            throw new RuntimeException("Error fetching govt API: " + e.getMessage(), e);
        }
    }

    @Scheduled(cron = "0 0 10 * * ?") // everyday at 10 AM
    public void autoFetchSchemes() {
        fetchAndSaveSchemes();
    }
}
