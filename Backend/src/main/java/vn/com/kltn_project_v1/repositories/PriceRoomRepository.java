package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.com.kltn_project_v1.model.PriceRoom;
@Repository
public interface PriceRoomRepository extends JpaRepository<PriceRoom, Long> {
    PriceRoom findPriceRoomByRoom_RoomIdAndPrice_PriceId(long roomId, long priceId);

}