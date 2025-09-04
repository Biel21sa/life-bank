package br.fai.lds.lifebank.domain.dto;

import br.fai.lds.lifebank.domain.UserModel;
import lombok.Getter;
import lombok.Setter;

public class UpdateUserDto {

    private int id;
    private String name;
    private String cpf;
    private String email;
    private String phone;
    private String street;
    private String number;
    private String neighborhood;
    private String postalCode;


    public UserModel toUserModel() {
        UserModel entity = new UserModel();
        entity.setId(id);
        entity.setName(name);
        entity.setCpf(cpf);
        entity.setEmail(email);
        entity.setPhone(phone);
        entity.setStreet(street);
        entity.setNumber(number);
        entity.setNeighborhood(neighborhood);
        entity.setPostalCode(postalCode);
        return entity;
    }
}
