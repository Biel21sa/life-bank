package br.fai.lds.lifebank.domain.dto;

import java.util.List;

public class DonationEvolutionByBloodTypeDto {

    private String month;
    private List<DonationByBloodTypeDto> data;

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public List<DonationByBloodTypeDto> getData() {
        return data;
    }

    public void setData(List<DonationByBloodTypeDto> data) {
        this.data = data;
    }
}
