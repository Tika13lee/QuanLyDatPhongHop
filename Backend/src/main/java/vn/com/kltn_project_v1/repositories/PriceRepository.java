package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.com.kltn_project_v1.model.Price;
import vn.com.kltn_project_v1.model.Type;

import java.util.Optional;

public interface PriceRepository extends JpaRepository<Price, Long> {

}