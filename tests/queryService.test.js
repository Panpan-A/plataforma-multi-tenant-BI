const queryService = require('../services/queryService');
const queryModel = require('../models/queryModel');
const { ForbiddenError, ValidationError, NotFoundError } = require('../utils/errors');

jest.mock('../models/queryModel');

describe('QueryService Unit Tests', () => {
  const mockPool = { query: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateSQL', () => {
    test('should pass for valid SELECT query', () => {
      expect(() => queryService.validateSQL('SELECT * FROM clientes')).not.toThrow();
    });

    test('should throw ForbiddenError on forbidden keywords', () => {
      const dangerousQueries = [
        'DROP TABLE usuarios',
        'DELETE FROM empresas',
        'UPDATE usuarios SET rol = "admin"',
        'TRUNCATE TABLE logs',
        'ALTER TABLE empresas ADD COLUMN test'
      ];

      dangerousQueries.forEach(sql => {
        expect(() => queryService.validateSQL(sql)).toThrow(ForbiddenError);
      });
    });

    test('should throw ValidationError on multiple statements', () => {
      expect(() => queryService.validateSQL('SELECT * FROM a; DROP TABLE b'))
        .toThrow(ValidationError);
    });

    test('should throw ValidationError on comments', () => {
      expect(() => queryService.validateSQL('SELECT * FROM a -- some comment'))
        .toThrow(ValidationError);
      expect(() => queryService.validateSQL('SELECT * FROM a /* block comment */'))
        .toThrow(ValidationError);
    });

    test('should be case-insensitive for keywords', () => {
      expect(() => queryService.validateSQL('drop table test')).toThrow(ForbiddenError);
    });
  });

  test('processQuery should execute query and return results', async () => {
    const mockQueryConfig = {
      id: 1,
      nombre: 'Test Query',
      query: 'SELECT * FROM test WHERE id = ?',
      tipo: 'reporte'
    };
    const mockResults = [{ id: 1, data: 'result' }];

    queryModel.getQueryById.mockResolvedValue(mockQueryConfig);
    queryModel.executeDynamicQuery.mockResolvedValue(mockResults);

    const result = await queryService.processQuery(mockPool, 1, { f1: 10 });

    expect(result.resultados).toEqual(mockResults);
    expect(result.config.nombre).toBe('Test Query');
    expect(queryModel.executeDynamicQuery).toHaveBeenCalledWith(mockPool, mockQueryConfig.query, [10]);
  });

  test('processQuery should throw NotFoundError if query does not exist', async () => {
    queryModel.getQueryById.mockResolvedValue(null);

    await expect(queryService.processQuery(mockPool, 999, {}))
      .rejects.toThrow(NotFoundError);
  });

  test('processQuery should throw ForbiddenError on malicious SQL', async () => {
    const mockMaliciousQuery = {
      id: 1,
      query: 'DROP TABLE usuarios',
      nombre: 'Malicious'
    };
    queryModel.getQueryById.mockResolvedValue(mockMaliciousQuery);

    await expect(queryService.processQuery(mockPool, 1, {}))
      .rejects.toThrow(ForbiddenError);
  });

  test('formatForCharts should format data correctly for bar chart', () => {
    const mockResults = [
      { etiqueta: 'A', valor: 10 },
      { etiqueta: 'B', valor: 20 }
    ];

    const chartData = queryService.formatForCharts(mockResults, 'bar');

    expect(chartData.type).toBe('bar');
    expect(chartData.data.labels).toEqual(['A', 'B']);
    expect(chartData.data.datasets[0].data).toEqual([10, 20]);
  });
});
