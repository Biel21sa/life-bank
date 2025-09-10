package br.fai.lds.lifebank.domain.dto;

public class DonationEvolutionDto {

    private String month;
    private Double totalLiters;

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Double getTotalLiters() {
        return totalLiters;
    }

    public void setTotalLiters(Double totalLiters) {
        this.totalLiters = totalLiters;
    }
}
