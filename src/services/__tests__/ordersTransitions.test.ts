import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockUpdateDoc, mockDoc } = vi.hoisted(() => ({
  mockUpdateDoc: vi.fn(),
  mockDoc: vi.fn(() => ({ id: 'order-123' })),
}));

vi.mock('../../config/firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: mockDoc,
  updateDoc: mockUpdateDoc,
  serverTimestamp: vi.fn(() => 'SERVER_TIMESTAMP'),
}));

import {
  ALLOWED_ORDER_TRANSITIONS,
  canTransitionOrderStatus,
  updateOrderStatus,
} from '../orders.service';

describe('Máquina de estados de órdenes (orders.service)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('permite pasar de pending a processing, completed o cancelled', () => {
    expect(ALLOWED_ORDER_TRANSITIONS.pending).toEqual([
      'processing',
      'completed',
      'cancelled',
    ]);
    expect(canTransitionOrderStatus('pending', 'processing')).toBe(true);
    expect(canTransitionOrderStatus('pending', 'completed')).toBe(true);
    expect(canTransitionOrderStatus('pending', 'cancelled')).toBe(true);
  });

  it('permite pasar de processing únicamente a completed (bloqueando retroceso a pending o cancelación tardía)', () => {
    expect(canTransitionOrderStatus('processing', 'completed')).toBe(true);
    expect(canTransitionOrderStatus('processing', 'pending')).toBe(false);
    expect(canTransitionOrderStatus('processing', 'cancelled')).toBe(false);
  });

  it('bloquea cualquier transición desde los estados finales completed y cancelled', () => {
    expect(ALLOWED_ORDER_TRANSITIONS.completed).toEqual([]);
    expect(ALLOWED_ORDER_TRANSITIONS.cancelled).toEqual([]);
    expect(canTransitionOrderStatus('completed', 'pending')).toBe(false);
    expect(canTransitionOrderStatus('completed', 'processing')).toBe(false);
    expect(canTransitionOrderStatus('cancelled', 'pending')).toBe(false);
  });

  it('updateOrderStatus rechaza transiciones inválidas sin invocar a Firestore', async () => {
    await expect(
      updateOrderStatus('order-123', 'pending', 'completed')
    ).rejects.toThrow(
      'Transición de estado no permitida (completed -> pending).'
    );

    expect(mockUpdateDoc).not.toHaveBeenCalled();
  });

  it('updateOrderStatus ejecuta updateDoc cuando la transición es válida', async () => {
    mockUpdateDoc.mockResolvedValueOnce(undefined);

    await updateOrderStatus('order-123', 'processing', 'pending');

    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
  });
});

