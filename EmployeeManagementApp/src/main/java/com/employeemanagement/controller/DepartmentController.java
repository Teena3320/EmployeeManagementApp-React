
package com.employeemanagement.controller;

import org.springframework.web.bind.annotation.*;

import com.employeemanagement.entity.Department;
import com.employeemanagement.service.DepartmentService;

import java.util.List;

@RestController
@RequestMapping("/departments")
public class DepartmentController {

    private final DepartmentService service;

    public DepartmentController(DepartmentService service) {
        this.service = service;
    }

    @PostMapping
    public Department create(@RequestBody Department department) {
        return service.save(department);
    }

    @GetMapping
    public List<Department> getAll() {
        return service.getAll();
    }
}