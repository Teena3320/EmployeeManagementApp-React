package com.employeemanagement.controller;
import org.springframework.web.bind.annotation.*;

import com.employeemanagement.entity.Location;
import com.employeemanagement.service.LocationService;

import java.util.List;
@RestController
@RequestMapping("/locations")
public class LocationController {

    private final LocationService service;

    public LocationController(LocationService service) {
        this.service = service;
    }

    @PostMapping
    public Location create(@RequestBody Location location) {
        return service.save(location);
    }

    @GetMapping
    public List<Location> getAll() {
        return service.getAll();
    }
}