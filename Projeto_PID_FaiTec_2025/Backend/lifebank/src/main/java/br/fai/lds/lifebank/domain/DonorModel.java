package br.fai.lds.lifebank.domain;

import br.fai.lds.lifebank.domain.enuns.BloodType;

public class DonorModel {
    private int id;
    private String cpf;
    private BloodType bloodType;
    private boolean apto;

    public DonorModel() {
    }

    public DonorModel(int id, String cpf, BloodType bloodType, boolean apto) {
        this.id = id;
        this.cpf = cpf;
        this.bloodType = bloodType;
        this.apto = apto;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public BloodType getBloodType() {
        return bloodType;
    }

    public void setBloodType(BloodType bloodType) {
        this.bloodType = bloodType;
    }

    public boolean isApto() {
        return apto;
    }

    public void setApto(boolean apto) {
        this.apto = apto;
    }
}

