package br.fai.lds.lifebank.domain;

import java.time.LocalDate;

public class BenefitModel {
    private int id;
    private String description;
    private Double value;
    private LocalDate validity;
    private int clinicId;

    public BenefitModel() {
    }

    public BenefitModel(int id, String description, Double value, LocalDate validity, int clinicId) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.validity = validity;
        this.clinicId = clinicId;
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

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public LocalDate getValidity() {
        return validity;
    }

    public void setValidity(LocalDate validity) {
        this.validity = validity;
    }

    public int getClinicId() {
        return clinicId;
    }

    public void setClinicId(int clinicId) {
        this.clinicId = clinicId;
    }
}

