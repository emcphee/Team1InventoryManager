DROP TABLE IF EXISTS R_Items_ItemCategories;
DROP TABLE IF EXISTS Logs;
DROP TABLE IF EXISTS UserPermissions;
DROP TABLE IF EXISTS Items;
DROP TABLE IF EXISTS ItemCategories;

DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Warehouse;

CREATE TABLE Warehouse (
    WarehouseID INT IDENTITY(1,1) PRIMARY KEY,
    
    -- add other info about the warehouse if needed
	Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NOT NULL,
);

CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
	
	Username VARCHAR(255) NOT NULL,
    
    PasswordHash VARBINARY(32) NOT NULL,  -- change length depending on the hashing algo (currently SHA256 = 32bytes)
    Salt VARBINARY(16) NOT NULL  -- change salt length if changed
);

CREATE TABLE UserPermissions (
    UserID INT NOT NULL,
    WarehouseID INT NOT NULL,
    Permission INT CHECK (Permission IN (1, 2, 3)) NOT NULL, -- 1=admin 2=editor 3=viewer
    PRIMARY KEY (UserID, WarehouseID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (WarehouseID) REFERENCES Warehouse(WarehouseID) ON DELETE CASCADE
);

CREATE TABLE ItemCategories (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName VARCHAR(255) NOT NULL,
    WarehouseID INT NOT NULL,
    FOREIGN KEY (WarehouseID) REFERENCES Warehouse(WarehouseID) ON DELETE CASCADE
);

CREATE TABLE Items (
    ItemID INT IDENTITY(1,1) PRIMARY KEY,
    ItemName VARCHAR(255) NOT NULL,
    Amount INT NOT NULL CHECK (Amount >= 0),
    WarehouseID INT NOT NULL,
    FOREIGN KEY (WarehouseID) REFERENCES Warehouse(WarehouseID) ON DELETE CASCADE,
    CONSTRAINT Unique_Name UNIQUE (WarehouseID, ItemName)
);

CREATE TABLE R_Items_ItemCategories (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryID INT NOT NULL,
    ItemID INT NOT NULL,
    FOREIGN KEY (CategoryID) REFERENCES ItemCategories(CategoryID),
    FOREIGN KEY (ItemID) REFERENCES Items(ItemID),
);

CREATE TABLE Logs (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ItemID INT NOT NULL,
    Amount INT CHECK (Amount <> 0) NOT NULL,  -- ensure nonzero value
    WarehouseID INT NOT NULL,
    MovementDate DATETIME DEFAULT GETDATE(),
    UserID INT,  -- user responsible for the movement
    FOREIGN KEY (ItemID) REFERENCES Items(ItemID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL  -- becomes NULL if the user is deleted
);