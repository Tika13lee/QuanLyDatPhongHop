package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.com.kltn_project_v1.model.Service;

public interface ServiceRepository extends JpaRepository<Service, Long> {
}