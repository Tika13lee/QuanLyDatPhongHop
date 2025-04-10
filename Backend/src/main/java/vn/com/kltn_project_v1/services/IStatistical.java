package vn.com.kltn_project_v1.services;

import vn.com.kltn_project_v1.dtos.statistical.DataStatisticalDTO;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface IStatistical {
    Map<String,Integer> getStatisticalService(Date startDate, Date endDate);

    List<DataStatisticalDTO> getBranchData(Date startDate, Date endDate);

    List<DataStatisticalDTO> statisticalDaily(Date startDate, Date endDate);

    List<DataStatisticalDTO> statisticalRoom(Date startDate, Date endDate);
}
