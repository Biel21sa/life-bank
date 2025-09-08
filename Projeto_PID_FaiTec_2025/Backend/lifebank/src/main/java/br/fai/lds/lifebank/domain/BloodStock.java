package br.fai.lds.lifebank.domain;

import br.fai.lds.lifebank.domain.enuns.BloodType;

public class BloodStock {

    private int id;
    private String bloodType;
    private Double minimumStock;
    private Double maximumStock;
    private Double currentStock;
    private DonationLocationModel donationLocation;
    private int donationLocationId;

    public BloodStock(int id, String bloodType, Double minimumStock, Double maximumStock, Double currentStock, DonationLocationModel donationLocation, int donationLocationId) {
        this.id = id;
        this.bloodType = bloodType;
        this.minimumStock = minimumStock;
        this.maximumStock = maximumStock;
        this.currentStock = currentStock;
        this.donationLocation = donationLocation;
        this.donationLocationId = donationLocationId;
    }

    public BloodStock() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public Double getMinimumStock() {
        return minimumStock;
    }

    public void setMinimumStock(Double minimumStock) {
        this.minimumStock = minimumStock;
    }

    public Double getMaximumStock() {
        return maximumStock;
    }

    public void setMaximumStock(Double maximumStock) {
        this.maximumStock = maximumStock;
    }

    public Double getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Double currentStock) {
        this.currentStock = currentStock;
    }

    public DonationLocationModel getDonationLocation() {
        return donationLocation;
    }

    public void setDonationLocation(DonationLocationModel donationLocation) {
        this.donationLocation = donationLocation;
    }

    public int getDonationLocationId() {
        return donationLocationId;
    }

    public void setDonationLocationId(int donationLocationId) {
        this.donationLocationId = donationLocationId;
    }
}
