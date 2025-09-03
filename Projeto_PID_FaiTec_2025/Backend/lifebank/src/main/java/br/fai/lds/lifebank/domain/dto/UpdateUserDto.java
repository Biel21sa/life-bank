package br.fai.lds.lifebank.domain.dto;

import br.fai.lds.lifebank.domain.UserModel;
import lombok.Getter;
import lombok.Setter;

public class UpdateUserDto {

    private int id;
    private String fullName;

    public UserModel toUserModel() {
        UserModel entity = new UserModel();
        entity.setId(id);
        entity.setName(fullName);
        return entity;
    }
}
