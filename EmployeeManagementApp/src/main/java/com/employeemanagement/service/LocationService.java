package com.employeemanagement.service;

import org.springframework.stereotype.Service;
import java.util.List;
import com.employeemanagement.entity.Location;
import com.employeemanagement.repository.LocationRepository;

@Service
public class LocationService {

    private final LocationRepository repo;

    public LocationService(LocationRepository repo) {
        this.repo = repo;
    }

    public Location save(Location location) {
        return repo.save(location);
    }

    public List<Location> getAll() {
        return repo.findAll();
    }

    public Location getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}