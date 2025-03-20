package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.com.kltn_project_v1.model.RequestForm;

public interface RequestFormRepository extends JpaRepository<RequestForm, Long> {
}