package vn.com.kltn_project_v1.services.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.com.kltn_project_v1.dtos.DepartmentDTO;
import vn.com.kltn_project_v1.model.Department;
import vn.com.kltn_project_v1.repositories.DepartmentRepository;
import vn.com.kltn_project_v1.repositories.LocationRepository;
import vn.com.kltn_project_v1.services.IDepartment;

import java.util.List;
@Service
public class DepartmentService implements IDepartment {
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Override
    public Department createDepartment(DepartmentDTO departmentDTO) {
        Department department = new Department();
        department.setDepName(departmentDTO.getDepName());
        department.setLocation(locationRepository.findById(departmentDTO.getLocationId()).orElse(null));
        return departmentRepository.save(department);
    }

    @Override
    public Department updateDepartment(DepartmentDTO departmentDTO) {
        Department department = modelMapper.map(departmentDTO, Department.class);
        department.setLocation(locationRepository.findById(departmentDTO.getLocationId()).orElse(null));
        return departmentRepository.save(department);
    }

    @Override
    public void deleteDepartment(Long departmentId) {
        departmentRepository.deleteById(departmentId);
    }

    @Override
    public List<Department> getAllDepartment() {
        return departmentRepository.findAll();
    }
}
