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

        UserModel entity1 = new UserModel(getNextId(), "gabriel@gmail.com", "12125", "Gabriel", UserModel.UserRole.Administrator);

        UserModel entity2 = new UserModel();
        entity2.setId(getNextId());
        entity2.setEmail("luciano@email.com");
        entity2.setPassword("48884");
        entity2.setFullname("Luciano");
        entity2.setRole(UserModel.UserRole.User);

        UserModel entity3 = new UserModel(getNextId(), "carlos@gmail.com", "9854", "Carlos", UserModel.UserRole.User);

        UserModel entity4 = new UserModel(getNextId(), "ricardo@gmail.com", "8745", "Ricardo", UserModel.UserRole.User);

        entities.add(entity1);
        entities.add(entity2);
        entities.add(entity3);
        entities.add(entity4);

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
        System.out.println("A entidade: " + removeEntity.getFullname() + " foi removida com sucesso");

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
                data.setFullname(entity.getFullname());
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
