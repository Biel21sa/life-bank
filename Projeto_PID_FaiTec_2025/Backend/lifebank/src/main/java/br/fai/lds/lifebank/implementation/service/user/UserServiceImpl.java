package br.fai.lds.lifebank.implementation.service.user;

import br.fai.lds.lifebank.domain.UserModel;
import br.fai.lds.lifebank.port.dao.user.UserDao;
import br.fai.lds.lifebank.port.service.user.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class UserServiceImpl implements UserService {

    private final UserDao userDao;

    public UserServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public int create(UserModel entity) {
        int invalidResponse = -1;

        if (entity == null) {
            return invalidResponse;
        }

        if (entity.getFullname().isEmpty() || entity.getEmail().isEmpty() || isPassWordInvalid(entity.getPassword())) {
            return invalidResponse;
        }

        final int id = userDao.create(entity);
        return id;
    }

    private boolean isPassWordInvalid(final String password) {

        if (password.isEmpty()) {
            return true;
        }

        if (password.length() < 3) {
            return true;
        }

        return false;
    }

    @Override
    public void delete(int id) {
        if (id < 0) {
            return;
        }

        userDao.delete(id);
    }

    @Override
    public UserModel findByid(int id) {
        if (id < 0) {
            return null;
        }

        UserModel entity = userDao.findByid(id);
        return entity;
    }

    @Override
    public List<UserModel> findAll() {
        final List<UserModel> entities = userDao.findAll();
        return entities;
    }

    @Override
    public void update(int id, UserModel entity) {
        if (id != entity.getId()) {
            return;
        }

        UserModel userModel = findByid(id);
        if (userModel == null) {
            return;
        }

        userDao.update(id, entity);
    }

    @Override
    public UserModel findByEmail(String email) {
        if (email.isEmpty()) {
            return null;
        }

        UserModel entity = userDao.findByEmail(email);
        return entity;
    }

    @Override
    public boolean updatePassword(int id, String oldPassword, String newPassword) {
        if (id < 0) {
            return false;
        }

        UserModel entity = userDao.findByid(id);

        if (!Objects.equals(entity.getPassword(), oldPassword) || !isPassWordInvalid(newPassword)) {
            return false;
        }

        userDao.updatePassword(id, newPassword);
        return true;
    }
}
