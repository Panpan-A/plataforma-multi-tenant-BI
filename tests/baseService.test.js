const { processCRUD } = require('../services/baseService');
const baseModel = require('../models/baseModel');
const { ValidationError, NotFoundError } = require('../utils/errors');

jest.mock('../models/baseModel');

describe('BaseService Unit Tests', () => {
  const mockPool = { query: jest.fn() };
  const table = 'test_table';
  const requiredFields = ['name', 'code'];
  const service = processCRUD(table, requiredFields);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAll should return all active records', async () => {
    const mockData = [{ id: 1, name: 'Item 1' }];
    baseModel.findAll.mockResolvedValue(mockData);

    const result = await service.getAll(mockPool);

    expect(result).toEqual(mockData);
    expect(baseModel.findAll).toHaveBeenCalledWith(mockPool, table);
  });

  test('create should throw ValidationError if required fields are missing', async () => {
    const incompleteData = { name: 'Only name' };

    await expect(service.create(mockPool, incompleteData))
      .rejects.toThrow(ValidationError);
  });

  test('create should call model with active=1 by default', async () => {
    const validData = { name: 'Test', code: 'T01' };
    baseModel.create.mockResolvedValue(1);

    const result = await service.create(mockPool, validData);

    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('activo', 1);
    expect(baseModel.create).toHaveBeenCalledWith(mockPool, table, expect.objectContaining({ activo: 1 }));
  });

  test('getById should throw NotFoundError if item not found', async () => {
    baseModel.findById.mockResolvedValue(null);

    await expect(service.getById(mockPool, 999))
      .rejects.toThrow(NotFoundError);
  });
});
