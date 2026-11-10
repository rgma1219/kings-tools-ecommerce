import { act, renderHook, waitFor } from '@testing-library/react';
import type { User } from 'firebase/auth';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { UserProfile } from '../../../types';

const {
  mockSubscribeToAuthChanges,
  mockGetOrCreateUserProfile,
  mockLoginWithEmail,
  mockRegisterWithEmail,
  mockLoginWithGoogle,
  mockLogoutUser,
} = vi.hoisted(() => ({
  mockSubscribeToAuthChanges: vi.fn(),
  mockGetOrCreateUserProfile: vi.fn(),
  mockLoginWithEmail: vi.fn(),
  mockRegisterWithEmail: vi.fn(),
  mockLoginWithGoogle: vi.fn(),
  mockLogoutUser: vi.fn(),
}));

vi.mock('../../../services/auth.service', () => ({
  subscribeToAuthChanges: mockSubscribeToAuthChanges,
  getOrCreateUserProfile: mockGetOrCreateUserProfile,
  loginWithEmail: mockLoginWithEmail,
  registerWithEmail: mockRegisterWithEmail,
  loginWithGoogle: mockLoginWithGoogle,
  logoutUser: mockLogoutUser,
}));

import { AuthProvider } from '../AuthProvider';
import { useAuth } from '../useAuth';

const mockCustomerProfile: UserProfile = {
  uid: 'uid-customer-1',
  email: 'cliente@kingstools.com',
  displayName: 'Cliente Prueba',
  role: 'customer',
  createdAt: new Date('2026-01-10T10:00:00.000Z'),
};

const mockAdminProfile: UserProfile = {
  uid: 'uid-admin-1',
  email: 'admin@kingstools.com',
  displayName: 'Admin Kings Tools',
  role: 'admin',
  createdAt: new Date('2026-01-10T10:00:00.000Z'),
};

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('useAuth hook & AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSubscribeToAuthChanges.mockImplementation(
      (callback: (user: User | null) => void) => {
        callback(null);
        return vi.fn();
      }
    );
  });

  it('lanza un error descriptivo si se invoca fuera de AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth debe usarse dentro de un <AuthProvider>'
    );
  });

  it('sincroniza el perfil desde Firestore al detectar sesión activa y expone isAdmin=false para clientes', async () => {
    mockGetOrCreateUserProfile.mockResolvedValueOnce(mockCustomerProfile);
    mockSubscribeToAuthChanges.mockImplementation(
      (callback: (user: User | null) => void) => {
        void callback({ uid: mockCustomerProfile.uid } as User);
        return vi.fn();
      }
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockCustomerProfile);
    expect(result.current.isAdmin).toBe(false);
  });

  it('permite iniciar sesión como administrador (isAdmin=true) y cerrar sesión limpiando el estado', async () => {
    mockLoginWithEmail.mockResolvedValueOnce(mockAdminProfile);
    mockLogoutUser.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('admin@kingstools.com', '123456');
    });

    expect(result.current.user).toEqual(mockAdminProfile);
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.error).toBeNull();

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAdmin).toBe(false);
  });

  it('captura y expone el mensaje de error cuando falla el inicio de sesión', async () => {
    mockLoginWithEmail.mockRejectedValueOnce(
      new Error('El correo o la contraseña son incorrectos.')
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await expect(
        result.current.login('cliente@kingstools.com', 'clave-erronea')
      ).rejects.toThrow('El correo o la contraseña son incorrectos.');
    });

    expect(result.current.error).toBe(
      'El correo o la contraseña son incorrectos.'
    );
    expect(result.current.user).toBeNull();
  });
});

