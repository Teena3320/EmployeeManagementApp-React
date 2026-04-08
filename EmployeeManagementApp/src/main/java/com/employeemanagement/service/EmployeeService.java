package com.employeemanagement.service;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import com.employeemanagement.entity.Employee;
import com.employeemanagement.repository.EmployeeRepository;

@Service
public class EmployeeService {

    private final EmployeeRepository repo;

    public EmployeeService(EmployeeRepository repo) {
        this.repo = repo;
    }

    public Employee save(Employee emp) {
        return repo.save(emp);
    }

    public List<Employee> getAll() {
        return repo.findAll();
    }

    public Employee getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public List<Employee> byDepartment(Long deptId) {
        return repo.findByDepartmentDeptId(deptId);
    }

    public List<Employee> byStatus(String status) {
        return repo.findByStatus(status);
    }

    public List<Employee> hiredAfter(LocalDate date) {
        return repo.findByHireDateAfter(date);
    }
}
