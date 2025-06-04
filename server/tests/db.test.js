import db from '../db/knex.js';

describe('Database connection', () => {
  it('should connect to the database and execute a simple query', async () => {
    const result = await db.raw('SELECT 1+1 AS result');
    expect(result).toBeDefined();
  });
});