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
                insertDonor(userId, entity.getBloodType(), entity.getGender());
            } else if (entity.getRole() == UserModel.UserRole.CLINIC) {
                insertClinic(userId, entity.getNameClinic(), entity.getCnpj(), entity.getStreet(), entity.getNumber(),
                        entity.getNeighborhood(), entity.getPostalCode(), entity.getMunicipalityId());
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
                "dl.municipality_id as dl_municipality_id, m.name as m_name, m.state as m_state, " +
                "d.id as donor_id, d.blood_type as donor_blood_type, c.name as clinic_name, c.cnpj as clinic_cnpj " +
                "FROM user_model u " +
                "LEFT JOIN donation_location dl ON u.donation_location_id = dl.id " +
                "LEFT JOIN municipality m ON dl.municipality_id = m.id " +
                "LEFT JOIN donor d ON u.id = d.user_id " +
                "LEFT JOIN clinic c ON u.id = c.user_id " +
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
                "dl.municipality_id as dl_municipality_id, m.name as m_name, m.state as m_state, " +
                "d.id as donor_id, d.blood_type as donor_blood_type, c.name as clinic_name, c.cnpj as clinic_cnpj " +
                "FROM user_model u " +
                "LEFT JOIN donation_location dl ON u.donation_location_id = dl.id " +
                "LEFT JOIN municipality m ON dl.municipality_id = m.id " +
                "LEFT JOIN donor d ON u.id = d.user_id " +
                "LEFT JOIN clinic c ON u.id = c.user_id";

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
                + "street = ?, number = ?, neighborhood = ?, postal_code = ?, donation_location_id = ? "
                + "WHERE id = ?";

        try {
            connection.setAutoCommit(false);

            PreparedStatement preparedStatement = connection.prepareStatement(sql);

            preparedStatement.setString(1, entity.getName());
            preparedStatement.setString(2, entity.getCpf());
            preparedStatement.setString(3, entity.getEmail());
            preparedStatement.setString(4, entity.getPhone());
            preparedStatement.setString(5, entity.getStreet());
            preparedStatement.setString(6, entity.getNumber());
            preparedStatement.setString(7, entity.getNeighborhood());
            preparedStatement.setString(8, entity.getPostalCode());

            // Atualizar donation_location_id apenas para ADMINISTRATOR
            if (entity.getRole() == UserModel.UserRole.ADMINISTRATOR) {
                preparedStatement.setInt(9, entity.getDonationLocationId());
            } else {
                preparedStatement.setNull(9, java.sql.Types.INTEGER);
            }

            preparedStatement.setInt(10, id);

            preparedStatement.executeUpdate();
            preparedStatement.close();

            // Atualizar tabelas específicas baseado no tipo de usuário
            if (entity.getRole() == UserModel.UserRole.USER && entity.getBloodType() != null) {
                updateDonor(id, entity.getBloodType());
            } else if (entity.getRole() == UserModel.UserRole.CLINIC) {
                updateClinic(id, entity.getNameClinic(), entity.getCnpj());
            }

            connection.commit();
        } catch (SQLException e) {
            try {
                connection.rollback();
            } catch (SQLException ex) {
                throw new RuntimeException(ex);
            }
            throw new RuntimeException(e);
        }
    }

    @Override
    public UserModel findByEmail(String email) {
        final String sql = "SELECT u.*, dl.id as dl_id, dl.name as dl_name, dl.street as dl_street, " +
                "dl.neighborhood as dl_neighborhood, dl.number as dl_number, dl.postal_code as dl_postal_code, " +
                "dl.municipality_id as dl_municipality_id, m.name as m_name, m.state as m_state, " +
                "d.id as donor_id, d.blood_type as donor_blood_type, c.name as clinic_name, c.cnpj as clinic_cnpj " +
                "FROM user_model u " +
                "LEFT JOIN donation_location dl ON u.donation_location_id = dl.id " +
                "LEFT JOIN municipality m ON dl.municipality_id = m.id " +
                "LEFT JOIN donor d ON u.id = d.user_id " +
                "LEFT JOIN clinic c ON u.id = c.user_id " +
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

    private void insertDonor(int userId, String bloodType, String gender) throws SQLException {
        String sql = "INSERT INTO donor (blood_type, gender, user_id) VALUES (?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, bloodType);
            stmt.setString(2, gender);
            stmt.setInt(3, userId);
            stmt.executeUpdate();
            logger.log(Level.INFO, "Doador criado com sucesso para o usuário ID: " + userId);
        }
    }

    private void insertClinic(int userId, String name, String cnpj, String street, String number, String neighborhood,
                              String postalCode, int municipalityId) throws SQLException {
        String sql = "INSERT INTO clinic (name, cnpj, street, number, neighborhood, postal_code, municipality_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, name);
            stmt.setString(2, cnpj);
            stmt.setString(3, street);
            stmt.setString(4, number);
            stmt.setString(5, neighborhood);
            stmt.setString(6, postalCode);
            stmt.setInt(7, municipalityId);
            stmt.setInt(8, userId);
            stmt.executeUpdate();
            logger.log(Level.INFO, "Clínica criada com sucesso para o usuário ID: " + userId);
        }
    }

    private void updateDonor(int userId, String bloodType) throws SQLException {
        String sql = "UPDATE donor SET blood_type = ? WHERE user_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, bloodType);
            stmt.setInt(2, userId);
            stmt.executeUpdate();
        }
    }

    private void updateClinic(int userId, String name, String cnpj) throws SQLException {
        String sql = "UPDATE clinic SET name = ?, cnpj = ? WHERE user_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, name);
            stmt.setString(2, cnpj);
            stmt.setInt(3, userId);
            stmt.executeUpdate();
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

        // Mapear informações específicas por tipo de usuário
        if (user.getRole() == UserModel.UserRole.USER && rs.getObject("donor_blood_type") != null) {
            user.setBloodType(rs.getString("donor_blood_type"));
            if (rs.getObject("donor_id") != null) {
                user.setDonorId(rs.getInt("donor_id"));
            }
            user.setApto(rs.getBoolean("apto"));
        } else if (user.getRole() == UserModel.UserRole.CLINIC && rs.getObject("clinic_name") != null) {
            user.setNameClinic(rs.getString("clinic_name"));
            user.setCnpj(rs.getString("clinic_cnpj"));
        }

        // Mapear DonationLocation completo se existir (apenas para queries que incluem essas colunas)
        try {
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
        } catch (SQLException e) {
            // Colunas de DonationLocation não existem nesta query, ignorar
        }

        return user;
    }

    @Override
    public List<UserModel> findByRole(String role) {
        final List<UserModel> users = new ArrayList<>();
        String sql;

        if ("USER".equals(role)) {
            sql = "SELECT u.*, d.blood_type as donor_blood_type, d.id as donor_id, d.gender, d.last_donation_date, " +
                    "CASE " +
                    "WHEN (d.gender = 'MASCULINO' AND (d.last_donation_date IS NULL OR d.last_donation_date <= CURRENT_DATE - INTERVAL '60 days')) " +
                    "OR (d.gender = 'FEMININO' AND (d.last_donation_date IS NULL OR d.last_donation_date <= CURRENT_DATE - INTERVAL '90 days')) " +
                    "THEN TRUE ELSE FALSE END AS apto " +
                    "FROM user_model u " +
                    "INNER JOIN donor d ON u.id = d.user_id " +
                    "WHERE u.role = ?";
        } else if ("CLINIC".equals(role)) {
            sql = "SELECT u.*, c.name as clinic_name, c.cnpj as clinic_cnpj, c.id as clinic_id " +
                    "FROM user_model u " +
                    "INNER JOIN clinic c ON u.id = c.user_id " +
                    "WHERE u.role = ?";
        } else {
            sql = "SELECT u.*, dl.id as dl_id, dl.name as dl_name, dl.street as dl_street, " +
                    "dl.neighborhood as dl_neighborhood, dl.number as dl_number, dl.postal_code as dl_postal_code, " +
                    "dl.municipality_id as dl_municipality_id, m.name as m_name, m.state as m_state " +
                    "FROM user_model u " +
                    "LEFT JOIN donation_location dl ON u.donation_location_id = dl.id " +
                    "LEFT JOIN municipality m ON dl.municipality_id = m.id " +
                    "WHERE u.role = ?";
        }

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, role);
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
}
