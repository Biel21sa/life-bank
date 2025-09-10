package br.fai.lds.lifebank.domain.dto;

public class DonationByBloodTypeDto {

    private String bloodType;
    private Double totalLiters;

    public DonationByBloodTypeDto() {
    }

    public DonationByBloodTypeDto(String bloodType, Double totalLiters) {
        this.bloodType = bloodType;
        this.totalLiters = totalLiters;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public Double getTotalLiters() {
        return totalLiters;
    }

    public void setTotalLiters(Double totalLiters) {
        this.totalLiters = totalLiters;
    }
}
