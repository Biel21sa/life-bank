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

        String sql = "INSERT INTO user_model(password, name, email, role) ";
        sql += " VALUES (?, ?, ?, ?)";

        PreparedStatement preparedStatement;
        ResultSet resultSet;

        try {
            connection.setAutoCommit(false);
            logger.log(Level.CONFIG, "Auto commit off.");

            preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);

            preparedStatement.setString(1, entity.getPassword());
            preparedStatement.setString(2, entity.getName());
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
        final String sql = "SELECT * FROM user_model WHERE id = ?;";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
                UserModel user = mapResultSetToUserModel(resultSet);

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
        final String sql = "SELECT * FROM user_model;";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                UserModel user = mapResultSetToUserModel(resultSet);
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
        String sql = "UPDATE user_model SET "
                + "name = ?, cpf = ?, email = ?, phone = ?, "
                + "street = ?, number = ?, neighborhood = ?, postal_code = ?, "
                + "WHERE id = ?;";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);

            preparedStatement.setString(1, entity.getName());
            preparedStatement.setString(2, entity.getCpf());
            preparedStatement.setString(3, entity.getEmail());
            preparedStatement.setString(4, entity.getPhone());
            preparedStatement.setString(5, entity.getStreet());
            preparedStatement.setString(6, entity.getNumber());
            preparedStatement.setString(7, entity.getNeighborhood());
            preparedStatement.setString(8, entity.getPostalCode());
            preparedStatement.setInt(9, id);

            preparedStatement.executeUpdate();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public UserModel findByEmail(String email) {
        final String sql = "SELECT * FROM user_model WHERE email = ?;";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, email);
            ResultSet resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
                UserModel user = mapResultSetToUserModel(resultSet);

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

    private UserModel mapResultSetToUserModel(ResultSet rs) throws SQLException {
        UserModel user = new UserModel();

        user.setId(rs.getInt("id"));
        user.setName(rs.getString("name"));
        user.setRole(UserModel.UserRole.valueOf(rs.getString("role")));
        user.setCpf(rs.getString("cpf"));
        user.setEmail(rs.getString("email"));
        user.setPhone(rs.getString("phone"));
        user.setPassword(rs.getString("password"));
        user.setStreet(rs.getString("street"));
        user.setNumber(rs.getString("number"));
        user.setNeighborhood(rs.getString("neighborhood"));
        user.setPostalCode(rs.getString("postal_code"));
        user.setDonationLocationId(rs.getInt("donation_location_id"));
        user.setBloodType(rs.getString("blood_type"));
        user.setNameClinic(rs.getString("nameClinic"));
        user.setCnpj(rs.getString("cnpj"));

        return user;
    }
}
