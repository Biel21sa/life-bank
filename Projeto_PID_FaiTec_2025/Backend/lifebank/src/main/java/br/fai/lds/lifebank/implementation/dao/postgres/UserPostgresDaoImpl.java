package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.UserModel;
import br.fai.lds.lifebank.port.dao.user.UserDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class UserPostgresDaoImpl implements UserDao {

    private static final Logger logger = Logger.getLogger(UserPostgresDaoImpl.class.getName());

    private final Connection connection;

    public UserPostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(UserModel entity) {
        logger.log(Level.INFO, "Inserindo usuário no banco de dados.");

        String sql = "INSERT INTO user_model(password, fullname, email, role) ";
        sql += " VALUES (?, ?, ?, ?)";

        PreparedStatement preparedStatement;
        ResultSet resultSet;

        try {
            connection.setAutoCommit(false);
            logger.log(Level.CONFIG, "Auto commit off.");

            preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);

            preparedStatement.setString(1, entity.getPassword());
            preparedStatement.setString(2, entity.getFullname());
            preparedStatement.setString(3, entity.getEmail());
            preparedStatement.setString(4, entity.getRole().name());

            preparedStatement.execute();

            resultSet = preparedStatement.getGeneratedKeys();
            int id = 0;
            if (resultSet.next()) {
                id = resultSet.getInt(1);
            }

            connection.commit();

            resultSet.close();
            preparedStatement.close();

            logger.log(Level.INFO, "Usuário adicionado com sucesso.");

            return id;
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Problema ao adicionar o usuário no banco de dados. Realizando RollBack.");

            try {
                connection.rollback();
            } catch (SQLException ex) {
                throw new RuntimeException(ex);
            }

            throw new RuntimeException(e);
        }
    }

    @Override
    public void delete(int id) {
        logger.log(Level.INFO, "Preparando para remover o usuário.");
        final String sql = "DELETE FROM user_model WHERE id = ? ; ";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            preparedStatement.execute();
            preparedStatement.close();
            logger.log(Level.INFO, "Usuário removido com sucesso.");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public UserModel findByid(int id) {
        final String sql = "SELECT * FROM user_model WHERE id = ? ;";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery(sql);
            if (resultSet.next()) {
                final int entityId = resultSet.getInt("id");
                final String fullname = resultSet.getString("fullname");
                final String email = resultSet.getString("email");
                final String password = resultSet.getString("password");
                final String auxRole = resultSet.getString("role");
                final UserModel.UserRole role = UserModel.UserRole.valueOf(auxRole);
                final UserModel user = new UserModel();
                user.setId(entityId);
                user.setFullname(fullname);
                user.setEmail(email);
                user.setPassword(password);
                user.setRole(role);

                preparedStatement.close();
                resultSet.close();

                return user;
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @Override
    public List<UserModel> findAll() {
        final List<UserModel> users = new ArrayList<>();

        final String sql = "SELECT * FROM user_model; ";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                int entityId = resultSet.getInt("id");
                String fullname = resultSet.getString("fullname");
                String email = resultSet.getString("email");
                String password = resultSet.getString("password");
                String auxRole = resultSet.getString("role");
                UserModel.UserRole role = UserModel.UserRole.valueOf(auxRole);

                UserModel user = new UserModel();
                user.setId(entityId);
                user.setFullname(fullname);
                user.setEmail(email);
                user.setPassword(password);
                user.setRole(role);

                users.add(user);
            }
            resultSet.close();
            preparedStatement.close();
            return users;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void update(int id, UserModel entity) {
        String sql = "UPDATE user_model SET fullname = ? ; ";
        sql += "WHERE id = ? ; ";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);

            preparedStatement.setString(1, entity.getFullname());
            preparedStatement.setInt(2, entity.getId());
            preparedStatement.execute();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public UserModel findByEmail(String email) {
        final String sql = "SELECT * FROM user_model WHERE email = ? ; ";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, email);
            ResultSet resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
                final int entityId = resultSet.getInt("id");
                final String fullname = resultSet.getString("fullname");
                final String entityEmail = resultSet.getString("email");
                final String password = resultSet.getString("password");
                final String auxRole = resultSet.getString("role");
                final UserModel.UserRole role = UserModel.UserRole.valueOf(auxRole);

                final UserModel user = new UserModel();
                user.setId(entityId);
                user.setFullname(fullname);
                user.setEmail(entityEmail);
                user.setPassword(password);
                user.setRole(role);

                preparedStatement.close();
                resultSet.close();

                return user;
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @Override
    public boolean updatePassword(int id, String newPassword) {
        String sql = "UPDATE user_model SET password = ? ; ";
        sql += "WHERE id = ? ; ";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);

            preparedStatement.setString(1, newPassword);
            preparedStatement.setInt(2, id);

            preparedStatement.execute();
            preparedStatement.close();
            return true;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
