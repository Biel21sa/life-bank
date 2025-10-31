package br.fai.lds.lifebank.implementation.service.user;

import br.fai.lds.lifebank.domain.UserModel;
import br.fai.lds.lifebank.port.dao.user.UserDao;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserDao userDao;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private UserModel validUser;

    @BeforeEach
    void setUp() {
        validUser = new UserModel();
        validUser.setId(1);
        validUser.setName("João Silva");
        validUser.setEmail("joao@email.com");
        validUser.setPassword("senha123");
        validUser.setRole(UserModel.UserRole.USER);
    }

    @Test
    void create_ValidUser_ReturnsId() {
        when(userDao.create(any(UserModel.class))).thenReturn(1);

        int result = userService.create(validUser);

        assertEquals(1, result);
        verify(userDao).create(validUser);
    }

    @Test
    void create_NullUser_ReturnsInvalidResponse() {
        int result = userService.create(null);

        assertEquals(-1, result);
        verify(userDao, never()).create(any());
    }

    @Test
    void create_EmptyName_ReturnsInvalidResponse() {
        validUser.setName("");

        int result = userService.create(validUser);

        assertEquals(-1, result);
        verify(userDao, never()).create(any());
    }

    @Test
    void create_EmptyEmail_ReturnsInvalidResponse() {
        validUser.setEmail("");

        int result = userService.create(validUser);

        assertEquals(-1, result);
        verify(userDao, never()).create(any());
    }

    @Test
    void create_InvalidPassword_ReturnsInvalidResponse() {
        validUser.setPassword("a");

        int result = userService.create(validUser);

        assertEquals(-1, result);
        verify(userDao, never()).create(any());
    }

    @Test
    void delete_ValidId_CallsDao() {
        userService.delete(1);

        verify(userDao).delete(1);
    }

    @Test
    void delete_NegativeId_DoesNotCallDao() {
        userService.delete(-1);

        verify(userDao, never()).delete(anyInt());
    }

    @Test
    void findByid_ValidId_ReturnsUser() {
        when(userDao.findByid(1)).thenReturn(validUser);

        UserModel result = userService.findByid(1);

        assertEquals(validUser, result);
        verify(userDao).findByid(1);
    }

    @Test
    void findByid_NegativeId_ReturnsNull() {
        UserModel result = userService.findByid(-1);

        assertNull(result);
        verify(userDao, never()).findByid(anyInt());
    }

    @Test
    void findAll_ReturnsUserList() {
        List<UserModel> users = Arrays.asList(validUser);
        when(userDao.findAll()).thenReturn(users);

        List<UserModel> result = userService.findAll();

        assertEquals(users, result);
        verify(userDao).findAll();
    }

    @Test
    void update_ValidIdAndUser_CallsDao() {
        when(userDao.findByid(1)).thenReturn(validUser);

        userService.update(1, validUser);

        verify(userDao).update(1, validUser);
    }

    @Test
    void update_MismatchedId_DoesNotCallDao() {
        validUser.setId(2);

        userService.update(1, validUser);

        verify(userDao, never()).update(anyInt(), any());
    }

    @Test
    void update_UserNotFound_DoesNotCallDao() {
        when(userDao.findByid(1)).thenReturn(null);

        userService.update(1, validUser);

        verify(userDao, never()).update(anyInt(), any());
    }

    @Test
    void findByEmail_ValidEmail_ReturnsUser() {
        when(userDao.findByEmail("joao@email.com")).thenReturn(validUser);

        UserModel result = userService.findByEmail("joao@email.com");

        assertEquals(validUser, result);
        verify(userDao).findByEmail("joao@email.com");
    }

    @Test
    void findByEmail_EmptyEmail_ReturnsNull() {
        UserModel result = userService.findByEmail("");

        assertNull(result);
        verify(userDao, never()).findByEmail(anyString());
    }

    @Test
    void updatePassword_ValidData_ReturnsTrue() {
        when(userDao.findByid(1)).thenReturn(validUser);
        when(passwordEncoder.matches("senhaAntiga", validUser.getPassword())).thenReturn(true);

        boolean result = userService.updatePassword(1, "senhaAntiga", "novaSenha123");

        assertTrue(result);
        verify(userDao).updatePassword(1, "novaSenha123");
    }

    @Test
    void updatePassword_NegativeId_ReturnsFalse() {
        boolean result = userService.updatePassword(-1, "senhaAntiga", "novaSenha123");

        assertFalse(result);
        verify(userDao, never()).updatePassword(anyInt(), anyString());
    }

    @Test
    void updatePassword_WrongOldPassword_ReturnsFalse() {
        when(userDao.findByid(1)).thenReturn(validUser);
        when(passwordEncoder.matches("senhaErrada", validUser.getPassword())).thenReturn(false);

        boolean result = userService.updatePassword(1, "senhaErrada", "novaSenha123");

        assertFalse(result);
        verify(userDao, never()).updatePassword(anyInt(), anyString());
    }

    @Test
    void updatePassword_InvalidNewPassword_ReturnsFalse() {
        when(userDao.findByid(1)).thenReturn(validUser);
        when(passwordEncoder.matches("senhaAntiga", validUser.getPassword())).thenReturn(true);

        boolean result = userService.updatePassword(1, "senhaAntiga", "a");

        assertFalse(result);
        verify(userDao, never()).updatePassword(anyInt(), anyString());
    }

    @Test
    void findByRole_ValidRole_ReturnsUsers() {
        List<UserModel> users = Arrays.asList(validUser);
        when(userDao.findByRole("USER")).thenReturn(users);

        List<UserModel> result = userService.findByRole("USER");

        assertEquals(users, result);
        verify(userDao).findByRole("USER");
    }

    @Test
    void findByRole_NullRole_ReturnsEmptyList() {
        List<UserModel> result = userService.findByRole(null);

        assertTrue(result.isEmpty());
        verify(userDao, never()).findByRole(anyString());
    }
}