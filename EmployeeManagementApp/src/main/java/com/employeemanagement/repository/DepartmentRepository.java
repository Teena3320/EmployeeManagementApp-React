package com.employeemanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.employeemanagement.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
}