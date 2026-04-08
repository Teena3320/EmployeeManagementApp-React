package com.employeemanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.employeemanagement.entity.Location;

public interface LocationRepository extends JpaRepository<Location, Long> {
}