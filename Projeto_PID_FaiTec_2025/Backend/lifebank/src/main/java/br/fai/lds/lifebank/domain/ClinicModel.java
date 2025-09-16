package br.fai.lds.lifebank.domain;

public class ClinicModel {
    private int id;
    private String cnpj;
    private String name;
    private String street;
    private String neighborhood;
    private String number;
    private String postalCode;
    private int municipalityId;
    private int userId;

    public ClinicModel() {
    }

    public ClinicModel(int id, String cnpj, String name, String address, String neighborhood, String number) {
        this.id = id;
        this.cnpj = cnpj;
        this.name = name;
        this.street = address;
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

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getNeighborhood() {
        return neighborhood;
    }

    public void setNeighborhood(String neighborhood) {
        this.neighborhood = neighborhood;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public int getMunicipalityId() {
        return municipalityId;
    }

    public void setMunicipalityId(int municipalityId) {
        this.municipalityId = municipalityId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
}
