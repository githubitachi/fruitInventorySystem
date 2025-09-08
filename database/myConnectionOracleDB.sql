-- Create Fruits table
CREATE TABLE Fruits (
    FruitID NUMBER PRIMARY KEY,
    Name VARCHAR2(100) NOT NULL,
    Type VARCHAR2(50) NOT NULL,
    Price NUMBER(10,2) NOT NULL
);

-- Create Inventory table
CREATE TABLE Inventory (
    InventoryID NUMBER PRIMARY KEY,
    FruitID NUMBER NOT NULL,
    Stock NUMBER NOT NULL,
    LastUpdated DATE DEFAULT SYSDATE,
    CONSTRAINT FK_Inventory_Fruit FOREIGN KEY (FruitID) REFERENCES Fruits(FruitID)
);

-- Create Transactions table
CREATE TABLE Transactions (
    TransactionID NUMBER PRIMARY KEY,
    FruitID NUMBER NOT NULL,
    TransactionType VARCHAR2(20) NOT NULL, -- 'ADD' or 'UPDATE'
    Quantity NUMBER NOT NULL,
    TransactionDate DATE DEFAULT SYSDATE,
    CONSTRAINT FK_Transaction_Fruit FOREIGN KEY (FruitID) REFERENCES Fruits(FruitID)
);

-- Create sequences for auto-increment
CREATE SEQUENCE Fruits_SEQ START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE Inventory_SEQ START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE Transactions_SEQ START WITH 1 INCREMENT BY 1;

-- Insert sample fruits
BEGIN
    FruitInventoryPkg.InsertFruit('Apple', 'Fruit', 100.00, 50);
    FruitInventoryPkg.InsertFruit('Banana', 'Fruit', 50.00, 30);
    FruitInventoryPkg.InsertFruit('Mango', 'Fruit', 120.00, 20);
END;
/

-- Check if package exists
SELECT OBJECT_NAME, OBJECT_TYPE, STATUS 
FROM USER_OBJECTS 
WHERE OBJECT_NAME = 'FRUITINVENTORYPKG';


-- Test the package procedure directly
DECLARE
    v_cursor SYS_REFCURSOR;
BEGIN
    FruitInventoryPkg.GetInventoryView(v_cursor);
END;
/

SELECT * FROM Fruits;

SELECT * FROM Inventory;

DECLARE
    v_cursor SYS_REFCURSOR;
    v_id NUMBER;
    v_name VARCHAR2(100);
    v_type VARCHAR2(50);
    v_price NUMBER;
    v_stock NUMBER;
BEGIN
    FruitInventoryPkg.GetInventoryView(v_cursor);
    LOOP
        FETCH v_cursor INTO v_id, v_name, v_type, v_price, v_stock;
        EXIT WHEN v_cursor%NOTFOUND;
        DBMS_OUTPUT.PUT_LINE(v_id || ' - ' || v_name || ' - ' || v_stock);
    END LOOP;
    CLOSE v_cursor;
END;
/

DECLARE
    v_cursor SYS_REFCURSOR;
BEGIN
    FruitInventoryPkg.GetInventoryView(v_cursor);
    -- This should show you the exact column structure
END;
/

SELECT OBJECT_NAME, PROCEDURE_NAME 
FROM USER_PROCEDURES 
WHERE OBJECT_NAME = 'FRUITINVENTORYPKG';

-- Check if package exists
SELECT object_name, object_type, status 
FROM user_objects 
WHERE object_name = 'FRUITINVENTORYPKG';

DROP PACKAGE FRUITINVENTORYPKG;

CREATE OR REPLACE PACKAGE FruitInventoryPkg AS
    -- Procedures for Fruits
    PROCEDURE GetAllFruits(p_cursor OUT SYS_REFCURSOR);
    PROCEDURE InsertFruit(p_name VARCHAR2, p_type VARCHAR2, p_price NUMBER, p_stock NUMBER);
    PROCEDURE UpdateFruit(p_id NUMBER, p_name VARCHAR2, p_type VARCHAR2, p_price NUMBER, p_stock NUMBER);
    
    -- Procedures for Inventory
    PROCEDURE GetInventoryView(p_cursor OUT SYS_REFCURSOR);
END FruitInventoryPkg;
/

CREATE OR REPLACE PACKAGE BODY FruitInventoryPkg AS
    
    PROCEDURE GetAllFruits(p_cursor OUT SYS_REFCURSOR) AS
    BEGIN
        OPEN p_cursor FOR
        SELECT f.FruitID, f.Name, f.Type, f.Price, NVL(i.Stock, 0) as Stock
        FROM Fruits f
        LEFT JOIN Inventory i ON f.FruitID = i.FruitID;
    END GetAllFruits;
    
    PROCEDURE InsertFruit(p_name VARCHAR2, p_type VARCHAR2, p_price NUMBER, p_stock NUMBER) AS
        v_fruit_id NUMBER;
    BEGIN
        -- Insert fruit
        INSERT INTO Fruits (FruitID, Name, Type, Price)
        VALUES (Fruits_SEQ.NEXTVAL, p_name, p_type, p_price)
        RETURNING FruitID INTO v_fruit_id;
        
        -- Insert inventory
        INSERT INTO Inventory (InventoryID, FruitID, Stock)
        VALUES (Inventory_SEQ.NEXTVAL, v_fruit_id, p_stock);
        
        -- Insert transaction
        INSERT INTO Transactions (TransactionID, FruitID, TransactionType, Quantity)
        VALUES (Transactions_SEQ.NEXTVAL, v_fruit_id, 'ADD', p_stock);
        
        COMMIT;
    END InsertFruit;
    
    PROCEDURE UpdateFruit(p_id NUMBER, p_name VARCHAR2, p_type VARCHAR2, p_price NUMBER, p_stock NUMBER) AS
    BEGIN
        -- Update fruit
        UPDATE Fruits 
        SET Name = p_name, Type = p_type, Price = p_price
        WHERE FruitID = p_id;
        
        -- Update inventory
        UPDATE Inventory 
        SET Stock = p_stock, LastUpdated = SYSDATE
        WHERE FruitID = p_id;
        
        -- Insert transaction
        INSERT INTO Transactions (TransactionID, FruitID, TransactionType, Quantity)
        VALUES (Transactions_SEQ.NEXTVAL, p_id, 'UPDATE', p_stock);
        
        COMMIT;
    END UpdateFruit;
    
    PROCEDURE GetInventoryView(p_cursor OUT SYS_REFCURSOR) AS
    BEGIN
        OPEN p_cursor FOR
        SELECT f.FruitID, f.Name, f.Type, f.Price, NVL(i.Stock, 0) as Stock
        FROM Fruits f
        LEFT JOIN Inventory i ON f.FruitID = i.FruitID
        ORDER BY f.Name;
    END GetInventoryView;
    
END FruitInventoryPkg;
/

-- Check package status again
SELECT object_name, object_type, status 
FROM user_objects 
WHERE object_name = 'FRUITINVENTORYPKG';

-- Test the procedure
DECLARE
    v_cursor SYS_REFCURSOR;
BEGIN
    FruitInventoryPkg.GetInventoryView(v_cursor);
END;
/

SELECT USER FROM DUAL;

-- Check if tables exist in your current schema
SELECT table_name FROM user_tables WHERE table_name IN ('FRUITS', 'INVENTORY', 'TRANSACTIONS');

-- Check what user you're connected as
SELECT USER FROM DUAL;

-- Keep only the lowest ID for each fruit name
DELETE FROM Inventory WHERE FruitID IN (
    SELECT FruitID FROM Fruits f1 WHERE EXISTS (
        SELECT 1 FROM Fruits f2 WHERE f2.Name = f1.Name AND f2.FruitID < f1.FruitID
    )
);

DELETE FROM Transactions WHERE FruitID IN (
    SELECT FruitID FROM Fruits f1 WHERE EXISTS (
        SELECT 1 FROM Fruits f2 WHERE f2.Name = f1.Name AND f2.FruitID < f1.FruitID
    )
);

DELETE FROM Fruits f1 WHERE EXISTS (
    SELECT 1 FROM Fruits f2 WHERE f2.Name = f1.Name AND f2.FruitID < f1.FruitID
);

COMMIT;