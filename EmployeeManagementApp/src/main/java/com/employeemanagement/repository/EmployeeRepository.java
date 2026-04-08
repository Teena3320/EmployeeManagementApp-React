package com.employeemanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.employeemanagement.entity.Employee;
import java.time.LocalDate;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByDepartmentDeptId(Long deptId);

    List<Employee> findByStatus(String status);

    List<Employee> findByHireDateAfter(LocalDate date);
}
