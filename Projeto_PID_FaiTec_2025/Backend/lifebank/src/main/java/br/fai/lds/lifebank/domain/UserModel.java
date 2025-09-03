package br.fai.lds.lifebank.domain;

public class UserModel {

    private int id;
    private String email;
    private String password;
    private String name;
    private UserRole role;

    public enum UserRole {
        ADMINISTRATOR,
        CLINIC,
        USER,
        SYSTEM
    }

    public UserModel() {
    }

    public UserModel(int id, String email, String password, String name, UserRole role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
}
