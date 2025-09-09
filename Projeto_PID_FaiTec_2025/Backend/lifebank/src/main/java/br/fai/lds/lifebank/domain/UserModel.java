package br.fai.lds.lifebank.domain;

import java.time.LocalDate;

public class UserModel {

    private int id;
    private String name;
    private UserRole role;
    private String cpf;
    private String email;
    private String phone;
    private String password;
    private String street;
    private String number;
    private String neighborhood;
    private String postalCode;

    // Campos opcionais
    private int municipalityId;
    private MunicipalityModel municipality;
    private DonationLocationModel donationLocation;
    private int donationLocationId;
    private int donorId;
    private DonorModel donor;
    private String bloodType;
    private String nameClinic;
    private String cnpj;
    private boolean apto;
    private LocalDate lastDonationDate;
    private String gender;

    public enum UserRole {
        ADMINISTRATOR,
        CLINIC,
        USER,
        SYSTEM
    }

    public UserModel() {}

    public UserModel(int id, String name, UserRole role, String cpf, String email, String phone, String password,
                     String street, String number, String neighborhood, String postalCode) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.cpf = cpf;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.street = street;
        this.number = number;
        this.neighborhood = neighborhood;
        this.postalCode = postalCode;
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

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getNeighborhood() {
        return neighborhood;
    }

    public void setNeighborhood(String neighborhood) {
        this.neighborhood = neighborhood;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public int getDonationLocationId() {
        return donationLocationId;
    }

    public void setDonationLocationId(int donationLocationId) {
        this.donationLocationId = donationLocationId;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public String getNameClinic() {
        return nameClinic;
    }

    public void setNameClinic(String nameClinic) {
        this.nameClinic = nameClinic;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public DonationLocationModel getDonationLocation() {
        return donationLocation;
    }

    public void setDonationLocation(DonationLocationModel donationLocation) {
        this.donationLocation = donationLocation;
    }

    public int getMunicipalityId() {
        return municipalityId;
    }

    public void setMunicipalityId(int municipalityId) {
        this.municipalityId = municipalityId;
    }

    public MunicipalityModel getMunicipality() {
        return municipality;
    }

    public void setMunicipality(MunicipalityModel municipality) {
        this.municipality = municipality;
    }

    public int getDonorId() {
        return donorId;
    }

    public void setDonorId(int donorId) {
        this.donorId = donorId;
    }

    public DonorModel getDonor() {
        return donor;
    }

    public void setDonor(DonorModel donor) {
        this.donor = donor;
    }

    public boolean isApto() {
        return apto;
    }

    public void setApto(boolean apto) {
        this.apto = apto;
    }

    public LocalDate getLastDonationDate() {
        return lastDonationDate;
    }

    public void setLastDonationDate(LocalDate lastDonationDate) {
        this.lastDonationDate = lastDonationDate;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }
}
