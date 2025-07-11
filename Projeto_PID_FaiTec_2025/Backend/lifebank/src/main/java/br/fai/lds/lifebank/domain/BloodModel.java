package br.fai.lds.lifebank.domain;

import br.fai.lds.lifebank.domain.enuns.BloodType;

import java.time.LocalDate;

public class BloodModel {

    private int id;
    private BloodType bloodType;
    private int quantity;
    private LocalDate collectionDate;
    private LocalDate validity;
    private int minimumLevel;
    private int maximumLevel;

    public BloodModel() {
    }

    public BloodModel(int id, BloodType bloodType, int quantity, LocalDate collectionDate, LocalDate validity,
                      int minimumLevel, int maximumLevel) {
        this.id = id;
        this.bloodType = bloodType;
        this.quantity = quantity;
        this.collectionDate = collectionDate;
        this.validity = validity;
        this.minimumLevel = minimumLevel;
        this.maximumLevel = maximumLevel;
    }

    public int getId() {
        return id;
    }

    public BloodType getBloodType() {
        return bloodType;
    }

    public int getQuantity() {
        return quantity;
    }

    public LocalDate getCollectionDate() {
        return collectionDate;
    }

    public LocalDate getValidity() {
        return validity;
    }

    public int getMinimumLevel() {
        return minimumLevel;
    }

    public int getMaximumLevel() {
        return maximumLevel;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setBloodType(BloodType bloodType) {
        this.bloodType = bloodType;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setCollectionDate(LocalDate collectionDate) {
        this.collectionDate = collectionDate;
    }

    public void setValidity(LocalDate validity) {
        this.validity = validity;
    }

    public void setMinimumLevel(int minimumLevel) {
        this.minimumLevel = minimumLevel;
    }

    public void setMaximumLevel(int maximumLevel) {
        this.maximumLevel = maximumLevel;
    }
}



