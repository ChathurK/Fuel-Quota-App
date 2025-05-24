package com.example.fuelQuotaManagementSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponse {
    private Long id;
    private String registrationNumber;
    private String vehicleType;
    private String fuelType;
    private Double engineCapacity;
    private String make;
    private String model;
    private Integer year;
    private String status;
}
