package br.fai.lds.lifebank.configuration;

import br.fai.lds.lifebank.implementation.dao.fake.BloodFakeDaoImpl;
import br.fai.lds.lifebank.implementation.dao.fake.DonationFakeDaoImpl;
import br.fai.lds.lifebank.implementation.dao.fake.DonorFakeDaoImpl;
import br.fai.lds.lifebank.implementation.dao.fake.UserFakeDaoImpl;
import br.fai.lds.lifebank.port.dao.blood.BloodDao;
import br.fai.lds.lifebank.port.dao.donation.DonationDao;
import br.fai.lds.lifebank.port.dao.donor.DonorDao;
import br.fai.lds.lifebank.port.dao.user.UserDao;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.Arrays;

@Configuration
public class AppConfiguration {

    private final Environment environment;

    public AppConfiguration(Environment environment) {
        this.environment = environment;

        System.out.println("---------");
        System.out.println(Arrays.toString(environment.getActiveProfiles()));
        System.out.println("---------");
    }

    @Bean
    public UserDao getUserFakeDao() {
        return new UserFakeDaoImpl();
    }

    @Bean
    public BloodDao getBloodFakeDao() {
        return new BloodFakeDaoImpl();
    }

    @Bean
    public DonationDao getDonationFakeDao() {
        return new DonationFakeDaoImpl();
    }

    @Bean
    public DonorDao getDonorFakeDao() {
        return new DonorFakeDaoImpl();
    }
}
