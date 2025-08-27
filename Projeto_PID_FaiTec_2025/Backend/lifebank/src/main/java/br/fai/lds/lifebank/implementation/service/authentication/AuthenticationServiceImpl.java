package br.fai.lds.lifebank.implementation.service.authentication;

import br.fai.lds.lifebank.domain.UserModel;
import br.fai.lds.lifebank.port.dao.user.UserDao;
import br.fai.lds.lifebank.port.service.authentication.AuthenticationService;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserDao userDao;

    public AuthenticationServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public UserModel authenticate(String email, String password) {
        if(email == null || email.isEmpty()
                || password == null || password.isEmpty())
        {
            return null;
        }

        UserModel user = userDao.findByEmail(email);
        if(user == null) {
            return null;
        }

        if(user.getPassword().equals(password)) {
            return user;
        }

        return null;
    }
}
