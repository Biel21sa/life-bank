package br.fai.lds.lifebank.port.service.crud;

public interface UpdateService<T> {

    void update(final int id, final T entity);

}
