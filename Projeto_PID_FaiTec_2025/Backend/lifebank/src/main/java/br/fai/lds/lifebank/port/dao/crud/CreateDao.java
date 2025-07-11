package br.fai.lds.lifebank.port.dao.crud;

public interface CreateDao<T> {

    int create(final T entity);

}
