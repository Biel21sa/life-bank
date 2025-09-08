package br.fai.lds.lifebank.domain;

import br.fai.lds.lifebank.domain.enuns.BloodType;

import java.time.LocalDate;

public class DonationModel {
    private int id;
    private Double quantity;
    private String bloodType;
    private LocalDate collectionDate;
    private LocalDate expirationDate;
    private int donorId;
    private int donationLocationId;
    private int bloodId;
    private DonorModel donor;
    private BloodModel blood;
    private DonationLocationModel donationLocation;

    public DonationModel() {
    }

    public DonationModel(int id, Double quantity, String bloodType, LocalDate collectionDate, LocalDate expirationDate, int donorId, int donationLocationId) {
        this.id = id;
        this.quantity = quantity;
        this.collectionDate = collectionDate;
        this.expirationDate = expirationDate;
        this.donorId = donorId;
        this.donationLocationId = donationLocationId;
        this.bloodType = bloodType;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public LocalDate getCollectionDate() {
        return collectionDate;
    }

    public void setCollectionDate(LocalDate collectionDate) {
        this.collectionDate = collectionDate;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
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

    public int getBloodId() {
        return bloodId;
    }

    public void setBloodId(int bloodId) {
        this.bloodId = bloodId;
    }

    public DonorModel getDonor() {
        return donor;
    }

    public void setDonor(DonorModel donor) {
        this.donor = donor;
    }

    public BloodModel getBlood() {
        return blood;
    }

    public void setBlood(BloodModel blood) {
        this.blood = blood;
    }

    public DonationLocationModel getDonationLocation() {
        return donationLocation;
    }

    public void setDonationLocation(DonationLocationModel donationLocation) {
        this.donationLocation = donationLocation;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }
}
