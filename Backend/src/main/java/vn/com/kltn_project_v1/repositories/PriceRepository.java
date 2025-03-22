package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.com.kltn_project_v1.model.Price;
import vn.com.kltn_project_v1.model.Type;

import java.util.Optional;
@Repository
public interface PriceRepository extends JpaRepository<Price, Long> {

}