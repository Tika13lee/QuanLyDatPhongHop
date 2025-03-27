package vn.com.kltn_project_v1.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;
import vn.com.kltn_project_v1.model.Price;
import vn.com.kltn_project_v1.model.Room;
import vn.com.kltn_project_v1.model.StatusRoom;
import vn.com.kltn_project_v1.model.TypeRoom;

import java.util.List;
@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
        @Query("SELECT r FROM Room r WHERE r.location.building.branch.branchName=:branch")
        List<Room> findByBranch(String branch);
        @NonNull
        Page<Room>findAll(@Nullable Pageable pageable);
        @NonNull
        @Query("select r from Room r where (:branch is null or r.location.building.branch.branchName = :branch)  and ( :capacity=0 or r.capacity = :capacity) and ( :price=0 or r.priceRoom.value = :price )and( :statusRoom is null or r.statusRoom =:statusRoom)")
        Page<Room> findRooms(@Param("branch")String branch, @Param("capacity") int capacity,@Param("price") int price_value,@Param("statusRoom") StatusRoom statusRoom, Pageable pageable);
        @Query("SELECT r FROM Room r WHERE LOWER(r.roomName) LIKE LOWER(CONCAT('%', :roomName, '%'))")
        List<Room> searchRoomsByName(@Param("roomName") String roomName);
        List<Room> findRoomsByTypeRoom(TypeRoom typeRoom);
        @Query("select r from Room r where (:branch is null or r.location.building.branch.branchName = :branch)  and ( :capacity=0 or r.capacity >= :capacity) and (:price=0 or r.priceRoom.value <= :price)")
        List<Room> findRoomsForReservation(@Param("branch")String branch, @Param("capacity") int capacity,@Param("price") int price);
        @Query("select r from Room r where r.approver.employeeId = :approverId")
        List<Room> findRoomsByApproverId(@Param("approverId") Long approverId);
        @Query("select r from Room r where r.approver.employeeId is null")
        List<Room> findRoomsNotApprover();
}