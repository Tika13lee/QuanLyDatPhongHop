package vn.com.kltn_project_v1.services;

import vn.com.kltn_project_v1.dtos.Overview.RoomViewDTO;
import vn.com.kltn_project_v1.dtos.RoomDTO;
import vn.com.kltn_project_v1.entityRespones.RoomRespone;
import vn.com.kltn_project_v1.exceptions.DataNotFoundException;
import vn.com.kltn_project_v1.model.Location;
import vn.com.kltn_project_v1.model.Room;
import vn.com.kltn_project_v1.model.StatusRoom;
import vn.com.kltn_project_v1.model.TypeRoom;

import java.util.Date;
import java.util.List;

public interface IRoom {
    public Room createRoom(RoomDTO room) throws DataNotFoundException;
    public List<Room> getRoomsByBranch( Long locationId) throws DataNotFoundException;
    public boolean changeStatusRoom(Long roomId, String status) throws DataNotFoundException;
    public RoomRespone getAllRooms(int page, int size, String sortBy) throws DataNotFoundException;
    public RoomRespone searchRooms(String branch, int capacity, int price, StatusRoom statusRoom, int page, int size, String sortBy) throws DataNotFoundException;
    public Room addApproverToRoom(Long roomId, String phoneApprover) throws DataNotFoundException;
    public List<RoomDTO> searchRoomByName(String roomName);
    public RoomDTO getRoomById(Long roomId) throws DataNotFoundException;
    public List<RoomViewDTO> getRoomOverView(String branch, Date dayStart, Date dayEnd) throws DataNotFoundException;
    public List<Room> getRoomByEmployee(String phone) throws DataNotFoundException;
    public List<Room> searchRoomByAttribute(String branch, int capacity, Date timeStart, Date timeEnd, int price) throws DataNotFoundException;
}

