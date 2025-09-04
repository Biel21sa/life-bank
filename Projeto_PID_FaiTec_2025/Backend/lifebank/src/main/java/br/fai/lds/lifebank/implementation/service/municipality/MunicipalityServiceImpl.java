package br.fai.lds.lifebank.implementation.service.municipality;

import br.fai.lds.lifebank.domain.MunicipalityModel;
import br.fai.lds.lifebank.port.dao.municipality.MunicipalityDao;
import br.fai.lds.lifebank.port.service.municipality.MunicipalityService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MunicipalityServiceImpl implements MunicipalityService {

    private final MunicipalityDao municipalityDao;

    public MunicipalityServiceImpl(MunicipalityDao municipalityDao) {
        this.municipalityDao = municipalityDao;
    }

    @Override
    public MunicipalityModel findByid(int id) {
        if (id < 0) {
            return null;
        }

        MunicipalityModel entity = municipalityDao.findByid(id);
        return entity;
    }

    @Override
    public List<MunicipalityModel> findAll() {
        final List<MunicipalityModel> entities = municipalityDao.findAll();
        return entities;
    }
}
