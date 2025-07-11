package br.fai.lds.lifebank.port.dao.user;

public interface UpdatePasswordDao {

    boolean updatePassword(final int id, final String newPassword);

}
