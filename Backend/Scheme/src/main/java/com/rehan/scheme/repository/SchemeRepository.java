package com.rehan.scheme.repository;

import com.rehan.scheme.entity.Scheme;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchemeRepository extends JpaRepository<Scheme, Long> {

    List<Scheme> findByCategory(String category);

    List<Scheme> findByState(String state);

    List<Scheme> findByCategoryAndState(String category, String state);

    List<Scheme> findByStatus(String status);
    Page<Scheme> findByStatus(String status, Pageable pageable);

    List<Scheme> findByNameContainingIgnoreCaseAndStatus(String name, String status);
}
