package br.fai.lds.lifebank.port.service.user;

public interface UpdatePasswordService {

    boolean updatePassword(final int id, final String oldPassword, final String newPassword);

}
