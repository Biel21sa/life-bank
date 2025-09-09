package br.fai.lds.lifebank.domain;

import br.fai.lds.lifebank.domain.enuns.BloodType;

import java.time.LocalDate;

public class BloodModel {

    private int id;
    private String bloodType;
    private Double quantity;
    private LocalDate expirationDate;
    private String reason;
    private Boolean used;
    private int donorId;
    private int donationLocationId;
    private DonorModel donor;
    private DonationLocationModel donationLocation;

    public BloodModel() {
    }

    public BloodModel(int id, String bloodType, Double quantity, LocalDate expirationDate) {
        this.id = id;
        this.bloodType = bloodType;
        this.quantity = quantity;
        this.expirationDate = expirationDate;
    }

    public int getId() {
        return id;
    }

    public String getBloodType() {
        return bloodType;
    }

    public Double getQuantity() {
        return quantity;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Boolean getUsed() {
        return used;
    }

    public void setUsed(Boolean used) {
        this.used = used;
    }

    public int getDonorId() {
        return donorId;
    }

    public void setDonorId(int donorId) {
        this.donorId = donorId;
    }

    public int getDonationLocationId() {
        return donationLocationId;
    }

    public void setDonationLocationId(int donationLocationId) {
        this.donationLocationId = donationLocationId;
    }

    public DonorModel getDonor() {
        return donor;
    }

    public void setDonor(DonorModel donor) {
        this.donor = donor;
    }

    public DonationLocationModel getDonationLocation() {
        return donationLocation;
    }

    public void setDonationLocation(DonationLocationModel donationLocation) {
        this.donationLocation = donationLocation;
    }
}



