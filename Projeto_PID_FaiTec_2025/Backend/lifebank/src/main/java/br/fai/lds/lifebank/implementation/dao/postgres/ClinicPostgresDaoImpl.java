package br.fai.lds.lifebank.implementation.dao.postgres;

import br.fai.lds.lifebank.domain.ClinicModel;
import br.fai.lds.lifebank.port.dao.clinic.ClinicDao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

public class ClinicPostgresDaoImpl implements ClinicDao {

    private static final Logger logger = Logger.getLogger(ClinicPostgresDaoImpl.class.getName());

    private final Connection connection;

    public ClinicPostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public ClinicModel findByCnpj(String cnpj) {
        final String sql = "SELECT * FROM clinic WHERE cnpj = ?";

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setString(1, cnpj);
            ResultSet rs = ps.executeQuery();

            ClinicModel clinic = null;
            if (rs.next()) {
                clinic = mapResultSetToClinicModel(rs);
            }

            rs.close();
            ps.close();
            return clinic;
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar clínica pelo CNPJ: " + cnpj, e);
        }
    }

    @Override
    public int create(ClinicModel entity) {
        final String sql = "INSERT INTO clinic (name, cnpj, street, number, neighborhood, postal_code, municipality_id, user_id) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id";

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setString(1, entity.getName());
            ps.setString(2, entity.getCnpj());
            ps.setString(3, entity.getStreet());
            ps.setString(4, entity.getNumber());
            ps.setString(5, entity.getNeighborhood());
            ps.setString(6, entity.getPostalCode());
            ps.setInt(7, entity.getMunicipalityId());
            ps.setInt(8, entity.getUserId());

            ResultSet rs = ps.executeQuery();
            int generatedId = 0;
            if (rs.next()) {
                generatedId = rs.getInt("id");
            }

            rs.close();
            ps.close();
            return generatedId;
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao criar clínica", e);
        }
    }

    @Override
    public void delete(int id) {
        final String sql = "DELETE FROM clinic WHERE id = ?";

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setInt(1, id);

            int rows = ps.executeUpdate();
            ps.close();

            if (rows == 0) {
                throw new RuntimeException("Nenhuma clínica encontrada para deletar com ID: " + id);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao deletar clínica com ID: " + id, e);
        }
    }

    @Override
    public ClinicModel findByid(int id) {
        final String sql = "SELECT * FROM clinic WHERE id = ?";

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();

            ClinicModel clinic = null;
            if (rs.next()) {
                clinic = mapResultSetToClinicModel(rs);
            }

            rs.close();
            ps.close();
            return clinic;
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar clínica com ID: " + id, e);
        }
    }

    @Override
    public List<ClinicModel> findAll() {
        final List<ClinicModel> clinics = new ArrayList<>();
        final String sql = "SELECT * FROM clinic";

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                ClinicModel clinic = mapResultSetToClinicModel(rs);
                clinics.add(clinic);
            }

            rs.close();
            ps.close();
            return clinics;
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar todas as clínicas", e);
        }
    }

    @Override
    public void update(int id, ClinicModel entity) {
        final String sql = "UPDATE clinic SET name = ?, cnpj = ?, street = ?, number = ?, neighborhood = ?, postal_code = ?, municipality_id = ?, user_id = ? " +
                "WHERE id = ?";

        try {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setString(1, entity.getName());
            ps.setString(2, entity.getCnpj());
            ps.setString(3, entity.getStreet());
            ps.setString(4, entity.getNumber());
            ps.setString(5, entity.getNeighborhood());
            ps.setString(6, entity.getPostalCode());
            ps.setInt(7, entity.getMunicipalityId());
            ps.setInt(8, entity.getUserId());
            ps.setInt(9, id);

            int rows = ps.executeUpdate();
            ps.close();

            if (rows == 0) {
                throw new RuntimeException("Nenhuma clínica encontrada para atualizar com ID: " + id);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao atualizar clínica com ID: " + id, e);
        }
    }

    private ClinicModel mapResultSetToClinicModel(ResultSet rs) throws SQLException {
        ClinicModel clinic = new ClinicModel();

        clinic.setId(rs.getInt("id"));
        clinic.setName(rs.getString("name"));
        clinic.setCnpj(rs.getString("cnpj"));
        clinic.setStreet(rs.getString("street"));
        clinic.setNumber(rs.getString("number"));
        clinic.setNeighborhood(rs.getString("neighborhood"));
        clinic.setPostalCode(rs.getString("postal_code"));
        clinic.setMunicipalityId(rs.getInt("municipality_id"));
        clinic.setUserId(rs.getInt("user_id"));

        return clinic;
    }

}
