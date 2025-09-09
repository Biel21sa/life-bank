package br.fai.lds.lifebank.configuration;

import br.fai.lds.lifebank.implementation.dao.postgres.*;
import br.fai.lds.lifebank.port.dao.benefit.BenefitDao;
import br.fai.lds.lifebank.port.dao.blood.BloodDao;
import br.fai.lds.lifebank.port.dao.bloodstock.BloodStockDao;
import br.fai.lds.lifebank.port.dao.clinic.ClinicDao;
import br.fai.lds.lifebank.port.dao.donation.DonationDao;
import br.fai.lds.lifebank.port.dao.donationlocation.DonationLocationDao;
import br.fai.lds.lifebank.port.dao.donor.DonorDao;
import br.fai.lds.lifebank.port.dao.municipality.MunicipalityDao;
import br.fai.lds.lifebank.port.dao.user.UserDao;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.sql.Connection;

@Configuration
public class AppConfiguration {

    private final Environment environment;

    public AppConfiguration(Environment environment) {
        this.environment = environment;
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }

    @Bean
    public UserDao getUserFakeDao(final Connection connection) {
        // return new UserFakeDaoImpl();
        return new UserPostgresDaoImpl(connection);
    }

    @Bean
    public BloodDao getBloodFakeDao(final Connection connection) {
        //return new BloodFakeDaoImpl();
        return new BloodPostgresDaoImpl(connection);
    }

    @Bean
    public DonationDao getDonationFakeDao(final Connection connection) {
        //return new DonationFakeDaoImpl();
        return new DonationPostgresDaoImpl(connection);
    }

    @Bean
    public DonorDao getDonorFakeDao(final Connection connection) {
        //return new DonorFakeDaoImpl();
        return new DonorPostgresDaoImpl(connection);
    }

    @Bean
    public BenefitDao getBenefitDao(final Connection connection) {
        //return new BenefitFakeDaoImpl();
        return new BenefitPostgresDaoImpl(connection);
    }

    @Bean
    public ClinicDao getClinicDao(final Connection connection) {
        //return new ClinicFakeDaoImpl();
        return new ClinicPostgresDaoImpl(connection);
    }

    @Bean
    public DonationLocationDao getDonationLocationDao(final Connection connection) {
        //return new DonationLocationFakeDaoImpl();
        return new DonationLocationPostgresDaoImpl(connection);
    }

    @Bean
    public MunicipalityDao getMunicipalityDao(final Connection connection) {
        return new MunicipalityPostgresDaoImpl(connection);
    }

    @Bean
    public BloodStockDao getBloodStockDao(final Connection connection) {
        return new BloodStockPostgresDaoImpl(connection);
    }
}
