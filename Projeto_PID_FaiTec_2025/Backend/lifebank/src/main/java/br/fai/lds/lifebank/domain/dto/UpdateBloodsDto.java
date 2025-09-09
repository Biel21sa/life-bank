package br.fai.lds.lifebank.domain.dto;

import java.util.List;

public class UpdateBloodsDto {

    private List<Integer> bloodIds;
    private String reason;

    public List<Integer> getBloodIds() {
        return bloodIds;
    }

    public void setBloodIds(List<Integer> bloodIds) {
        this.bloodIds = bloodIds;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
