package br.fai.lds.lifebank.domain;

public class UserModel {

    private int id;
    private String email;
    private String password;
    private String fullname;
    private UserRole role;

    public enum UserRole {
        Administrator,
        User
    }

    public UserModel() {
    }

    public UserModel(int id, String email, String password, String fullname, UserRole role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullname = fullname;
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

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
