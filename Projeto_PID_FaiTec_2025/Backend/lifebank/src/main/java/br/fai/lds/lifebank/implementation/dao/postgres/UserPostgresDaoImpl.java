package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.DonationLocationModel;
import br.fai.lds.lifebank.domain.MunicipalityModel;
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

        String sql = "INSERT INTO user_model(password, name, email, role, cpf, phone, street, number, neighborhood, postal_code, donation_location_id) ";
        sql += "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

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
            preparedStatement.setString(5, entity.getCpf());
            preparedStatement.setString(6, entity.getPhone());
            preparedStatement.setString(7, entity.getStreet());
            preparedStatement.setString(8, entity.getNumber());
            preparedStatement.setString(9, entity.getNeighborhood());
            preparedStatement.setString(10, entity.getPostalCode());

            // Se for ADMINISTRATOR, usar o ID do local; senão, passar NULL
            if (entity.getRole() == UserModel.UserRole.ADMINISTRATOR) {
                preparedStatement.setInt(11, entity.getDonationLocationId());
            } else {
                preparedStatement.setNull(11, java.sql.Types.INTEGER);
            }

            preparedStatement.execute();

            resultSet = preparedStatement.getGeneratedKeys();
            int userId = 0;
            if (resultSet.next()) {
                userId = resultSet.getInt(1);
            }

            logger.log(Level.INFO, "Usuário adicionado com sucesso. ID: " + userId);

            if (entity.getRole() == UserModel.UserRole.USER) {
                insertDonor(userId, entity.getBloodType());
            } else if (entity.getRole() == UserModel.UserRole.CLINIC) {
                insertClinic(userId, entity.getNameClinic(), entity.getCnpj(), entity.getStreet(), entity.getNumber(), entity.getNeighborhood(), entity.getPostalCode(), entity.getDonationLocationId());
            }

            connection.commit();

            resultSet.close();
            preparedStatement.close();

            return userId;
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
        final String sql = "SELECT u.*, dl.id as dl_id, dl.name as dl_name, dl.street as dl_street, " +
                          "dl.neighborhood as dl_neighborhood, dl.number as dl_number, dl.postal_code as dl_postal_code, " +
                          "dl.municipality_id as dl_municipality_id, m.name as m_name, m.state as m_state " +
                          "FROM user_model u " +
                          "LEFT JOIN donation_location dl ON u.donation_location_id = dl.id " +
                          "LEFT JOIN municipality m ON dl.municipality_id = m.id " +
                          "WHERE u.id = ?";

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
        final String sql = "SELECT u.*, dl.id as dl_id, dl.name as dl_name, dl.street as dl_street, " +
                          "dl.neighborhood as dl_neighborhood, dl.number as dl_number, dl.postal_code as dl_postal_code, " +
                          "dl.municipality_id as dl_municipality_id, m.name as m_name, m.state as m_state " +
                          "FROM user_model u " +
                          "LEFT JOIN donation_location dl ON u.donation_location_id = dl.id " +
                          "LEFT JOIN municipality m ON dl.municipality_id = m.id";

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
        final String sql = "SELECT u.*, dl.id as dl_id, dl.name as dl_name, dl.street as dl_street, " +
                          "dl.neighborhood as dl_neighborhood, dl.number as dl_number, dl.postal_code as dl_postal_code, " +
                          "dl.municipality_id as dl_municipality_id, m.name as m_name, m.state as m_state " +
                          "FROM user_model u " +
                          "LEFT JOIN donation_location dl ON u.donation_location_id = dl.id " +
                          "LEFT JOIN municipality m ON dl.municipality_id = m.id " +
                          "WHERE u.email = ?";

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

    private void insertDonor(int userId, String bloodType) throws SQLException {
        String sql = "INSERT INTO donor (blood_type, eligible, user_id) VALUES (?, true, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, bloodType);
            stmt.setInt(2, userId);
            stmt.executeUpdate();
            logger.log(Level.INFO, "Doador criado com sucesso para o usuário ID: " + userId);
        }
    }

    private void insertClinic(int userId, String name, String cnpj, String street, String number, String neighborhood, String postalCode, int municipalityId) throws SQLException {
        String sql = "INSERT INTO clinic (name, cnpj, street, number, neighborhood, postal_code, municipality_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, name);
            stmt.setString(2, cnpj);
            stmt.setString(3, street);
            stmt.setString(4, number);
            stmt.setString(5, neighborhood);
            stmt.setString(6, postalCode);
            stmt.setInt(7, municipalityId);
            stmt.executeUpdate();
            logger.log(Level.INFO, "Clínica criada com sucesso para o usuário ID: " + userId);
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

        // Mapear DonationLocation completo se existir
        if (rs.getObject("dl_id") != null) {
            DonationLocationModel donationLocation = new DonationLocationModel();
            donationLocation.setId(rs.getInt("dl_id"));
            donationLocation.setName(rs.getString("dl_name"));
            donationLocation.setStreet(rs.getString("dl_street"));
            donationLocation.setNeighborhood(rs.getString("dl_neighborhood"));
            donationLocation.setNumber(rs.getInt("dl_number"));
            donationLocation.setPostalCode(rs.getString("dl_postal_code"));
            donationLocation.setMunicipalityId(rs.getInt("dl_municipality_id"));

            // Mapear Municipality se existir
            if (rs.getObject("m_name") != null) {
                MunicipalityModel municipality = new MunicipalityModel();
                municipality.setId(rs.getInt("dl_municipality_id"));
                municipality.setName(rs.getString("m_name"));
                municipality.setState(rs.getString("m_state"));
                donationLocation.setMunicipality(municipality);
            }

            user.setDonationLocation(donationLocation);
        }

        return user;
    }
}
