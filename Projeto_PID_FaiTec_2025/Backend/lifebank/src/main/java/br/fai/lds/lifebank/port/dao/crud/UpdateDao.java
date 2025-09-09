package br.fai.lds.lifebank.port.dao.crud;

public interface UpdateDao<T> {

    void update(final int id, final T entity);

}
