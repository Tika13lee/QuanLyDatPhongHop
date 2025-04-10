package vn.com.kltn_project_v1.services;

import vn.com.kltn_project_v1.dtos.statistical.DataStatisticalDTO;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface IStatistical {
    List<DataStatisticalDTO> getStatisticalService(Date startDate, Date endDate);

    List<DataStatisticalDTO> getBranchData(Date startDate, Date endDate);

    List<DataStatisticalDTO> statisticalDaily(Date startDate, Date endDate);


    List<DataStatisticalDTO> statisticalRoom(Date startDate, Date endDate, Long branchId);

    List<Map<String, Object>> statisticalChart24h(Date dayStart, Date dayEnd);
}
