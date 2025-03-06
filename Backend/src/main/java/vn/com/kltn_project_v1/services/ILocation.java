package vn.com.kltn_project_v1.services;

import vn.com.kltn_project_v1.model.Location;

import java.util.List;

public interface ILocation {
    public List<Location> getAllLocation();
    public Location findLocation(String branch, String building, String floor, String number);
}
