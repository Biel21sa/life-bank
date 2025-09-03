package br.fai.lds.lifebank.domain;

public class DonationLocationModel {
    private int id;
    private String name;
    private String street;
    private String neighborhood;
    private int number;
    private String postalCode;
    private int municipality_id;

    public DonationLocationModel() {
    }

    public DonationLocationModel(int id, String name, String address, String neighborhood, int number) {
        this.id = id;
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

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public int getMunicipality_id() {
        return municipality_id;
    }

    public void setMunicipality_id(int municipality_id) {
        this.municipality_id = municipality_id;
    }
}

