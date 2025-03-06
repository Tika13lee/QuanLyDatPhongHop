package vn.com.kltn_project_v1.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import vn.com.kltn_project_v1.model.Room;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
        @Query("SELECT r FROM Room r WHERE r.location.branch=:branch")
        List<Room> findByBranch(String branch);
        @NonNull
        Page<Room>findAll(@Nullable Pageable pageable);

}