package vn.com.kltn_project_v1.services;

import vn.com.kltn_project_v1.dtos.RoomDTO;
import vn.com.kltn_project_v1.exceptions.DataNotFoundException;
import vn.com.kltn_project_v1.model.Location;
import vn.com.kltn_project_v1.model.Room;

import java.util.List;

public interface IRoom {
    public Room createRoom(RoomDTO room) throws DataNotFoundException;
    public List<Room> getRoomsByBranch( Long locationId) throws DataNotFoundException;
    public boolean changeStatusRoom(Long roomId, String status) throws DataNotFoundException;
    public List<RoomDTO> getAllRooms(int page, int size, String sortBy) throws DataNotFoundException;
}
