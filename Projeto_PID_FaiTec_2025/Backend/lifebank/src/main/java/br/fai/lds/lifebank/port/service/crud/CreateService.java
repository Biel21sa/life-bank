package br.fai.lds.lifebank.port.service.crud;

public interface CreateService<T> {

    int create(final T entity);

}
