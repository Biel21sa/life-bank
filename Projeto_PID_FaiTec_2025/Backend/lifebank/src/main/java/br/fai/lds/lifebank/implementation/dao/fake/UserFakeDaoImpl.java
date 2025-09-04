package br.fai.lds.lifebank.implementation.dao.fake;

import br.fai.lds.lifebank.domain.UserModel;
import br.fai.lds.lifebank.port.dao.user.UserDao;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class UserFakeDaoImpl implements UserDao {

    private static List<UserModel> entities = new ArrayList<>();
    private static int ID = 0;

    public UserFakeDaoImpl() {



    }

    private int getNextId() {
        ID += 1;
        return ID;
    }

    @Override
    public int create(UserModel entity) {
        final int id = getNextId();
        entity.setId(id);
        entities.add(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        int itemIndex = -1;

        for (int i = 0; i < entities.size(); i++) {

            UserModel entity = entities.get(i);
            if (entity.getId() == id) {
                itemIndex = i;
                break;
            }
        }

        if (itemIndex == -1) {
            return;
        }
        UserModel removeEntity = entities.remove(itemIndex);
        System.out.println("A entidade: " + removeEntity.getName() + " foi removida com sucesso");

    }

    @Override
    public UserModel findByid(int id) {
        for (UserModel entity : entities) {
            if (entity.getId() == id) {
                return entity;
            }
        }
        return null;
    }

    @Override
    public List<UserModel> findAll() {
        return entities;
    }

    @Override
    public void update(int id, UserModel entity) {
        for (UserModel data : entities) {
            if (data.getId() == id) {
                data.setName(entity.getName());
                break;
            }
        }
    }

    @Override
    public UserModel findByEmail(String email) {
        for (UserModel entity : entities) {
            if (Objects.equals(entity.getEmail(), email)) {
                return entity;
            }
        }
        return null;
    }

    @Override
    public boolean updatePassword(int id, String newPassword) {
        for (UserModel entity : entities) {
            if (entity.getId() == id) {
                entity.setPassword(newPassword);
                return true;
            }
        }

        return false;
    }
}
