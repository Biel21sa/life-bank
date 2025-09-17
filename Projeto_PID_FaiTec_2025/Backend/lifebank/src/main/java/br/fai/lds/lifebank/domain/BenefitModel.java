package br.fai.lds.lifebank.domain;

import java.time.LocalDate;

public class BenefitModel {
    private int id;
    private String description;
    private Double amount;
    private LocalDate expirationDate;
    private boolean used;
    private int donationId;
    private int donorId;
    private DonationModel donation;
    private DonorModel donor;

    public BenefitModel() {
    }

    public BenefitModel(int id, String description, Double amount, LocalDate expirationDate, int donationId, int donorId) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.expirationDate = expirationDate;
        this.donationId = donationId;
        this.donorId = donorId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public int getDonationId() {
        return donationId;
    }

    public void setDonationId(int donationId) {
        this.donationId = donationId;
    }

    public int getDonorId() {
        return donorId;
    }

    public void setDonorId(int donorId) {
        this.donorId = donorId;
    }

    public DonationModel getDonation() {
        return donation;
    }

    public void setDonation(DonationModel donation) {
        this.donation = donation;
    }

    public DonorModel getDonor() {
        return donor;
    }

    public void setDonor(DonorModel donor) {
        this.donor = donor;
    }

    public boolean isUsed() {
        return used;
    }

    public void setUsed(boolean used) {
        this.used = used;
    }
}

