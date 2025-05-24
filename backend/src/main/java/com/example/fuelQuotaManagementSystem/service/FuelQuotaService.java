package com.example.fuelQuotaManagementSystem.service;

import com.example.fuelQuotaManagementSystem.entity.FuelQuota;
import com.example.fuelQuotaManagementSystem.entity.Vehicle;
import com.example.fuelQuotaManagementSystem.repository.FuelQuotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.Optional;

@Service
public class FuelQuotaService {

    @Autowired
    private FuelQuotaRepository fuelQuotaRepository;

    // Default monthly quota allocations (in liters)
    private static final double PETROL_CAR_QUOTA = 60.0;           // 60L per month for cars
    private static final double PETROL_MOTORCYCLE_QUOTA = 20.0;    // 20L per month for motorcycles
    private static final double PETROL_THREE_WHEELER_QUOTA = 40.0; // 40L per month for three wheelers
    private static final double DIESEL_CAR_QUOTA = 80.0;           // 80L per month for diesel cars
    private static final double DIESEL_COMMERCIAL_QUOTA = 200.0;   // 200L per month for buses/lorries

    /**
     * Get current active fuel quota for a vehicle
     * If no active quota exists or current quota is expired, create a new one
     */
    public FuelQuota getCurrentQuota(Vehicle vehicle, String fuelType) {
        // Get current month boundaries
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endOfMonth = now.with(TemporalAdjusters.lastDayOfMonth());

        long startTimestamp = startOfMonth.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
        long endTimestamp = endOfMonth.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

        // Try to find existing quota for current month
        Optional<FuelQuota> existingQuota = fuelQuotaRepository
                .findByVehicleAndFuelTypeAndEndDateGreaterThanEqual(vehicle, fuelType, System.currentTimeMillis());

        if (existingQuota.isPresent()) {
            FuelQuota quota = existingQuota.get();

            // Check if this quota is for current month
            if (quota.getStartDate() >= startTimestamp && quota.getStartDate() <= endTimestamp) {
                return quota;
            }

            // If quota exists but for different month, it's expired, create new one
        }

        // Create new quota for current month
        return createNewMonthlyQuota(vehicle, fuelType, startTimestamp, endTimestamp);
    }

    /**
     * Create a new monthly fuel quota for a vehicle
     */
    private FuelQuota createNewMonthlyQuota(Vehicle vehicle, String fuelType, long startDate, long endDate) {
        FuelQuota quota = new FuelQuota();
        quota.setVehicle(vehicle);
        quota.setFuelType(fuelType);
        quota.setAllocationPeriod("MONTHLY");
        quota.setStartDate(startDate);
        quota.setEndDate(endDate);

        // Calculate allocated quota based on vehicle type and fuel type
        double allocatedQuota = calculateQuotaAllocation(vehicle.getVehicleType(), fuelType, vehicle.getEngineCapacity());
        quota.setAllocatedQuota(allocatedQuota);
        quota.setRemainingQuota(allocatedQuota); // Initially, remaining = allocated

        return fuelQuotaRepository.save(quota);
    }

    /**
     * Calculate quota allocation based on vehicle type and fuel type
     */
    private double calculateQuotaAllocation(String vehicleType, String fuelType, Double engineCapacity) {
        if ("Petrol".equalsIgnoreCase(fuelType)) {
            switch (vehicleType.toLowerCase()) {
                case "car":
                    // Additional quota for larger engines
                    if (engineCapacity != null && engineCapacity > 1800) {
                        return PETROL_CAR_QUOTA + 20.0; // 80L for cars > 1800cc
                    }
                    return PETROL_CAR_QUOTA;

                case "motorcycle":
                    return PETROL_MOTORCYCLE_QUOTA;

                case "three wheeler":
                    return PETROL_THREE_WHEELER_QUOTA;

                default:
                    return PETROL_CAR_QUOTA; // Default to car quota
            }
        } else if ("Diesel".equalsIgnoreCase(fuelType)) {
            switch (vehicleType.toLowerCase()) {
                case "car":
                    return DIESEL_CAR_QUOTA;

                case "bus":
                case "lorry":
                    return DIESEL_COMMERCIAL_QUOTA;

                default:
                    return DIESEL_CAR_QUOTA; // Default to car quota
            }
        }

        return PETROL_CAR_QUOTA; // Default fallback
    }

    /**
     * Deduct fuel from quota when fuel is pumped
     */
    public boolean deductFuel(Vehicle vehicle, String fuelType, double amountLiters) {
        FuelQuota quota = getCurrentQuota(vehicle, fuelType);

        if (quota.getRemainingQuota() >= amountLiters) {
            quota.setRemainingQuota(quota.getRemainingQuota() - amountLiters);
            fuelQuotaRepository.save(quota);
            return true;
        }

        return false; // Insufficient quota
    }

    /**
     * Check if vehicle has sufficient quota for requested amount
     */
    public boolean hasSufficientQuota(Vehicle vehicle, String fuelType, double requestedAmount) {
        FuelQuota quota = getCurrentQuota(vehicle, fuelType);
        return quota.getRemainingQuota() >= requestedAmount;
    }

    /**
     * Get remaining quota for a vehicle
     */
    public double getRemainingQuota(Vehicle vehicle, String fuelType) {
        FuelQuota quota = getCurrentQuota(vehicle, fuelType);
        return quota.getRemainingQuota();
    }

    /**
     * Get quota information with details
     */
    public FuelQuotaInfo getQuotaInfo(Vehicle vehicle, String fuelType) {
        FuelQuota quota = getCurrentQuota(vehicle, fuelType);

        return new FuelQuotaInfo(
                quota.getId(),
                quota.getAllocatedQuota(),
                quota.getRemainingQuota(),
                quota.getAllocatedQuota() - quota.getRemainingQuota(), // used quota
                quota.getStartDate(),
                quota.getEndDate(),
                isQuotaExpiringSoon(quota),
                getQuotaUsagePercentage(quota)
        );
    }

    /**
     * Check if quota is expiring soon (within 3 days)
     */
    private boolean isQuotaExpiringSoon(FuelQuota quota) {
        long threeDaysInMillis = 3 * 24 * 60 * 60 * 1000L;
        long currentTime = System.currentTimeMillis();
        return (quota.getEndDate() - currentTime) <= threeDaysInMillis;
    }

    /**
     * Calculate quota usage percentage
     */
    private double getQuotaUsagePercentage(FuelQuota quota) {
        if (quota.getAllocatedQuota() == 0) return 0;
        double usedQuota = quota.getAllocatedQuota() - quota.getRemainingQuota();
        return (usedQuota / quota.getAllocatedQuota()) * 100;
    }

    /**
     * Reset quota for testing purposes (Admin only)
     */
    public FuelQuota resetQuota(Vehicle vehicle, String fuelType) {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endOfMonth = now.with(TemporalAdjusters.lastDayOfMonth());

        long startTimestamp = startOfMonth.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
        long endTimestamp = endOfMonth.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

        return createNewMonthlyQuota(vehicle, fuelType, startTimestamp, endTimestamp);
    }

    /**
     * Check if it's a new month and create new quotas if needed
     * This should be called by a scheduled job
     */
    public void processMonthlyQuotaRenewal() {
        // This method would be called by a scheduled task
        // to automatically create new quotas at the start of each month
        // Implementation would fetch all vehicles and create new quotas

        LocalDate now = LocalDate.now();
        if (now.getDayOfMonth() == 1) {
            // First day of month - renewal logic here
            System.out.println("Processing monthly quota renewal for: " + now.getMonth() + " " + now.getYear());
        }
    }

    // Inner class for quota information response
    public static class FuelQuotaInfo {
        private Long quotaId;
        private double allocatedQuota;
        private double remainingQuota;
        private double usedQuota;
        private long startDate;
        private long endDate;
        private boolean expiringSoon;
        private double usagePercentage;

        public FuelQuotaInfo(Long quotaId, double allocatedQuota, double remainingQuota,
                             double usedQuota, long startDate, long endDate,
                             boolean expiringSoon, double usagePercentage) {
            this.quotaId = quotaId;
            this.allocatedQuota = allocatedQuota;
            this.remainingQuota = remainingQuota;
            this.usedQuota = usedQuota;
            this.startDate = startDate;
            this.endDate = endDate;
            this.expiringSoon = expiringSoon;
            this.usagePercentage = usagePercentage;
        }

        // Getters
        public Long getQuotaId() { return quotaId; }
        public double getAllocatedQuota() { return allocatedQuota; }
        public double getRemainingQuota() { return remainingQuota; }
        public double getUsedQuota() { return usedQuota; }
        public long getStartDate() { return startDate; }
        public long getEndDate() { return endDate; }
        public boolean isExpiringSoon() { return expiringSoon; }
        public double getUsagePercentage() { return usagePercentage; }
    }
}