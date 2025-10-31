package br.fai.lds.lifebank.implementation.service.donationlocation;

import br.fai.lds.lifebank.domain.DonationLocationModel;
import br.fai.lds.lifebank.port.dao.donationlocation.DonationLocationDao;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DonationLocationServiceImplTest {

    @Mock
    private DonationLocationDao donationLocationDao;

    @InjectMocks
    private DonationLocationServiceImpl donationLocationService;

    private DonationLocationModel validLocation;

    @BeforeEach
    void setUp() {
        validLocation = new DonationLocationModel();
        validLocation.setId(1);
        validLocation.setName("Hospital Central");
        validLocation.setStreet("Rua das Flores");
        validLocation.setNeighborhood("Centro");
        validLocation.setNumber(123);
    }

    @Test
    void create_ValidLocation_ReturnsId() {
        when(donationLocationDao.create(any(DonationLocationModel.class))).thenReturn(1);

        int result = donationLocationService.create(validLocation);

        assertEquals(1, result);
        verify(donationLocationDao).create(validLocation);
    }

    @Test
    void create_NullLocation_ReturnsInvalidResponse() {
        int result = donationLocationService.create(null);

        assertEquals(-1, result);
        verify(donationLocationDao, never()).create(any());
    }

    @Test
    void create_NullName_ReturnsInvalidResponse() {
        validLocation.setName(null);

        int result = donationLocationService.create(validLocation);

        assertEquals(-1, result);
        verify(donationLocationDao, never()).create(any());
    }

    @Test
    void create_NullStreet_ReturnsInvalidResponse() {
        validLocation.setStreet(null);

        int result = donationLocationService.create(validLocation);

        assertEquals(-1, result);
        verify(donationLocationDao, never()).create(any());
    }

    @Test
    void delete_ValidId_CallsDao() {
        donationLocationService.delete(1);

        verify(donationLocationDao).delete(1);
    }

    @Test
    void delete_NegativeId_DoesNotCallDao() {
        donationLocationService.delete(-1);

        verify(donationLocationDao, never()).delete(anyInt());
    }

    @Test
    void findByid_ValidId_ReturnsLocation() {
        when(donationLocationDao.findByid(1)).thenReturn(validLocation);

        DonationLocationModel result = donationLocationService.findByid(1);

        assertEquals(validLocation, result);
        verify(donationLocationDao).findByid(1);
    }

    @Test
    void findByid_NegativeId_ReturnsNull() {
        DonationLocationModel result = donationLocationService.findByid(-1);

        assertNull(result);
        verify(donationLocationDao, never()).findByid(anyInt());
    }

    @Test
    void findAll_ReturnsLocationList() {
        List<DonationLocationModel> locations = Arrays.asList(validLocation);
        when(donationLocationDao.findAll()).thenReturn(locations);

        List<DonationLocationModel> result = donationLocationService.findAll();

        assertEquals(locations, result);
        verify(donationLocationDao).findAll();
    }

    @Test
    void update_ValidIdAndLocation_CallsDao() {
        when(donationLocationDao.findByid(1)).thenReturn(validLocation);

        donationLocationService.update(1, validLocation);

        verify(donationLocationDao).update(1, validLocation);
    }

    @Test
    void update_MismatchedId_DoesNotCallDao() {
        validLocation.setId(2);

        donationLocationService.update(1, validLocation);

        verify(donationLocationDao, never()).update(anyInt(), any());
    }

    @Test
    void update_LocationNotFound_DoesNotCallDao() {
        when(donationLocationDao.findByid(1)).thenReturn(null);

        donationLocationService.update(1, validLocation);

        verify(donationLocationDao, never()).update(anyInt(), any());
    }
}