package br.fai.lds.lifebank.domain;

public class ClinicModel {
    private int id;
    private String cnpj;
    private String name;
    private String address;
    private String neighborhood;
    private int number;

    public ClinicModel() {
    }

    public ClinicModel(int id, String cnpj, String name, String address, String neighborhood, int number) {
        this.id = id;
        this.cnpj = cnpj;
        this.name = name;
        this.address = address;
        this.neighborhood = neighborhood;
        this.number = number;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNeighborhood() {
        return neighborhood;
    }

    public void setNeighborhood(String neighborhood) {
        this.neighborhood = neighborhood;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }
}
