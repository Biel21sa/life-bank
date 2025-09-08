package br.fai.lds.lifebank.domain;

import br.fai.lds.lifebank.domain.enuns.BloodType;

import java.time.LocalDate;

public class BloodModel {

    private int id;
    private String bloodType;
    private Double quantity;
    private LocalDate expirationDate;

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
}



