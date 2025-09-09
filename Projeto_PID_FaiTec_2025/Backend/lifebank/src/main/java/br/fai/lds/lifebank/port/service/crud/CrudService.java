package br.fai.lds.lifebank.port.service.crud;

public interface CrudService<T> extends
        CreateService<T>,
        DeleteService,
        UpdateService<T>,
        ReadService<T> {

}
