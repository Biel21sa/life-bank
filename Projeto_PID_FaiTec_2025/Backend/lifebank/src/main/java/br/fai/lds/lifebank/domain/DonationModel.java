package br.fai.lds.lifebank.domain;

import br.fai.lds.lifebank.domain.enuns.BloodType;

import java.time.LocalDate;

public class DonationModel {
    private int id;
    private BloodType bloodType;
    private int quantity;
    private LocalDate collectionDate;
    private LocalDate validityDate;
    private String donorCpf;
    private int locationId;

    public DonationModel() {
    }

    public DonationModel(int id, BloodType bloodType, int quantity, LocalDate collectionDate, LocalDate validityDate, String donorCpf, int locationId) {
        this.id = id;
        this.bloodType = bloodType;
        this.quantity = quantity;
        this.collectionDate = collectionDate;
        this.validityDate = validityDate;
        this.donorCpf = donorCpf;
        this.locationId = locationId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public BloodType getBloodType() {
        return bloodType;
    }

    public void setBloodType(BloodType bloodType) {
        this.bloodType = bloodType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public LocalDate getCollectionDate() {
        return collectionDate;
    }

    public void setCollectionDate(LocalDate collectionDate) {
        this.collectionDate = collectionDate;
    }

    public LocalDate getValidityDate() {
        return validityDate;
    }

    public void setValidityDate(LocalDate validityDate) {
        this.validityDate = validityDate;
    }

    public String getDonorCpf() {
        return donorCpf;
    }

    public void setDonorCpf(String donorCpf) {
        this.donorCpf = donorCpf;
    }

    public int getLocationId() {
        return locationId;
    }

    public void setLocationId(int locationId) {
        this.locationId = locationId;
    }
}
