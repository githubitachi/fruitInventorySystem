using Oracle.ManagedDataAccess.Client;
using FruitInventoryAPI.Models;
using System.Data;

namespace FruitInventoryAPI.Data
{
    public class FruitRepository
    {
        private readonly string _connectionString;

        public FruitRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("OracleConnection")!;
        }

        public async Task<List<Fruit>> GetAllFruitsAsync()
        {
            var fruits = new List<Fruit>();

            using var connection = new OracleConnection(_connectionString);
            await connection.OpenAsync();

            try
            {
                // STEP 1: Debug - Check current user and available packages
                using var debugCommand = new OracleCommand(@"
                    SELECT 
                        USER as CURRENT_USER,
                        (SELECT COUNT(*) FROM user_objects WHERE object_name = 'FRUITINVENTORYPKG' AND object_type = 'PACKAGE') as PACKAGE_EXISTS,
                        (SELECT COUNT(*) FROM user_objects WHERE object_name = 'FRUITINVENTORYPKG' AND object_type = 'PACKAGE BODY') as PACKAGE_BODY_EXISTS
                    FROM DUAL", connection);

                using var debugReader = await debugCommand.ExecuteReaderAsync();
                if (await debugReader.ReadAsync())
                {
                    Console.WriteLine($"Current User: {debugReader.GetString("CURRENT_USER")}");
                    Console.WriteLine($"Package Exists: {debugReader.GetInt32("PACKAGE_EXISTS")}");
                    Console.WriteLine($"Package Body Exists: {debugReader.GetInt32("PACKAGE_BODY_EXISTS")}");
                }

                // STEP 2: Try the package call
                using var command = new OracleCommand("BEGIN FruitInventoryPkg.GetInventoryView(:cursor); END;", connection);
                command.Parameters.Add("cursor", OracleDbType.RefCursor).Direction = ParameterDirection.Output;

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    fruits.Add(new Fruit
                    {
                        FruitID = reader.GetInt32("FRUITID"),
                        Name = reader.GetString("NAME"),
                        Type = reader.GetString("TYPE"),
                        Price = reader.GetDecimal("PRICE"),
                        Stock = reader.GetInt32("STOCK")
                    });
                }
            }
            catch (OracleException ex)
            {
                Console.WriteLine($"Oracle Error: {ex.Message}");

                // FALLBACK: Use direct SQL query instead of package
                Console.WriteLine("Falling back to direct SQL query...");

                using var fallbackCommand = new OracleCommand(@"
                    SELECT f.FruitID, f.Name, f.Type, f.Price, NVL(i.Stock, 0) as Stock
                    FROM Fruits f
                    LEFT JOIN Inventory i ON f.FruitID = i.FruitID
                    ORDER BY f.Name", connection);

                using var fallbackReader = await fallbackCommand.ExecuteReaderAsync();
                while (await fallbackReader.ReadAsync())
                {
                    fruits.Add(new Fruit
                    {
                        FruitID = fallbackReader.GetInt32("FRUITID"),
                        Name = fallbackReader.GetString("NAME"),
                        Type = fallbackReader.GetString("TYPE"),
                        Price = fallbackReader.GetDecimal("PRICE"),
                        Stock = fallbackReader.GetInt32("STOCK")
                    });
                }
            }

            return fruits;
        }

        public async Task AddFruitAsync(FruitRequest request)
        {
            using var connection = new OracleConnection(_connectionString);
            await connection.OpenAsync();

            try
            {
                using var command = new OracleCommand("BEGIN FruitInventoryPkg.InsertFruit(:name, :type, :price, :stock); END;", connection);
                command.Parameters.Add("name", OracleDbType.Varchar2).Value = request.Name;
                command.Parameters.Add("type", OracleDbType.Varchar2).Value = request.Type;
                command.Parameters.Add("price", OracleDbType.Decimal).Value = request.Price;
                command.Parameters.Add("stock", OracleDbType.Int32).Value = request.Stock;

                await command.ExecuteNonQueryAsync();
            }
            catch (OracleException ex)
            {
                Console.WriteLine($"Oracle Error in AddFruit: {ex.Message}");

                // FALLBACK: Use direct SQL inserts
                using var transaction = connection.BeginTransaction();
                try
                {
                    // Insert fruit
                    using var fruitCommand = new OracleCommand(@"
                        INSERT INTO Fruits (FruitID, Name, Type, Price)
                        VALUES (Fruits_SEQ.NEXTVAL, :name, :type, :price)", connection);

                    fruitCommand.Parameters.Add("name", OracleDbType.Varchar2).Value = request.Name;
                    fruitCommand.Parameters.Add("type", OracleDbType.Varchar2).Value = request.Type;
                    fruitCommand.Parameters.Add("price", OracleDbType.Decimal).Value = request.Price;
                    fruitCommand.Transaction = transaction;

                    await fruitCommand.ExecuteNonQueryAsync();

                    // Get the inserted FruitID
                    using var idCommand = new OracleCommand("SELECT Fruits_SEQ.CURRVAL FROM DUAL", connection);
                    idCommand.Transaction = transaction;
                    var fruitId = Convert.ToInt32(await idCommand.ExecuteScalarAsync());

                    // Insert inventory
                    using var inventoryCommand = new OracleCommand(@"
                        INSERT INTO Inventory (InventoryID, FruitID, Stock)
                        VALUES (Inventory_SEQ.NEXTVAL, :fruitId, :stock)", connection);

                    inventoryCommand.Parameters.Add("fruitId", OracleDbType.Int32).Value = fruitId;
                    inventoryCommand.Parameters.Add("stock", OracleDbType.Int32).Value = request.Stock;
                    inventoryCommand.Transaction = transaction;

                    await inventoryCommand.ExecuteNonQueryAsync();

                    // Insert transaction record
                    using var transCommand = new OracleCommand(@"
                        INSERT INTO Transactions (TransactionID, FruitID, TransactionType, Quantity)
                        VALUES (Transactions_SEQ.NEXTVAL, :fruitId, 'ADD', :quantity)", connection);

                    transCommand.Parameters.Add("fruitId", OracleDbType.Int32).Value = fruitId;
                    transCommand.Parameters.Add("quantity", OracleDbType.Int32).Value = request.Stock;
                    transCommand.Transaction = transaction;

                    await transCommand.ExecuteNonQueryAsync();

                    transaction.Commit();
                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }

        public async Task UpdateFruitAsync(int id, FruitRequest request)
        {
            using var connection = new OracleConnection(_connectionString);
            await connection.OpenAsync();

            try
            {
                using var command = new OracleCommand("BEGIN FruitInventoryPkg.UpdateFruit(:id, :name, :type, :price, :stock); END;", connection);
                command.Parameters.Add("id", OracleDbType.Int32).Value = id;
                command.Parameters.Add("name", OracleDbType.Varchar2).Value = request.Name;
                command.Parameters.Add("type", OracleDbType.Varchar2).Value = request.Type;
                command.Parameters.Add("price", OracleDbType.Decimal).Value = request.Price;
                command.Parameters.Add("stock", OracleDbType.Int32).Value = request.Stock;

                await command.ExecuteNonQueryAsync();
            }
            catch (OracleException ex)
            {
                Console.WriteLine($"Oracle Error in UpdateFruit: {ex.Message}");

                // FALLBACK: Use direct SQL updates
                using var transaction = connection.BeginTransaction();
                try
                {
                    // Update fruit
                    using var fruitCommand = new OracleCommand(@"
                        UPDATE Fruits 
                        SET Name = :name, Type = :type, Price = :price
                        WHERE FruitID = :id", connection);

                    fruitCommand.Parameters.Add("name", OracleDbType.Varchar2).Value = request.Name;
                    fruitCommand.Parameters.Add("type", OracleDbType.Varchar2).Value = request.Type;
                    fruitCommand.Parameters.Add("price", OracleDbType.Decimal).Value = request.Price;
                    fruitCommand.Parameters.Add("id", OracleDbType.Int32).Value = id;
                    fruitCommand.Transaction = transaction;

                    await fruitCommand.ExecuteNonQueryAsync();

                    // Update inventory
                    using var inventoryCommand = new OracleCommand(@"
                        UPDATE Inventory 
                        SET Stock = :stock, LastUpdated = SYSDATE
                        WHERE FruitID = :id", connection);

                    inventoryCommand.Parameters.Add("stock", OracleDbType.Int32).Value = request.Stock;
                    inventoryCommand.Parameters.Add("id", OracleDbType.Int32).Value = id;
                    inventoryCommand.Transaction = transaction;

                    await inventoryCommand.ExecuteNonQueryAsync();

                    // Insert transaction record
                    using var transCommand = new OracleCommand(@"
                        INSERT INTO Transactions (TransactionID, FruitID, TransactionType, Quantity)
                        VALUES (Transactions_SEQ.NEXTVAL, :id, 'UPDATE', :quantity)", connection);

                    transCommand.Parameters.Add("id", OracleDbType.Int32).Value = id;
                    transCommand.Parameters.Add("quantity", OracleDbType.Int32).Value = request.Stock;
                    transCommand.Transaction = transaction;

                    await transCommand.ExecuteNonQueryAsync();

                    transaction.Commit();
                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }
    }
}