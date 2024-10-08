﻿using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WarehouseInventoryManager.Models;

public partial class WarehouseInventoryDbContext : DbContext
{
    public WarehouseInventoryDbContext()
    {
    }

    public WarehouseInventoryDbContext(DbContextOptions<WarehouseInventoryDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Item> Items { get; set; }

    public virtual DbSet<ItemCategory> ItemCategories { get; set; }

    public virtual DbSet<Log> Logs { get; set; }

    public virtual DbSet<RItemsItemCategory> RItemsItemCategories { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserPermission> UserPermissions { get; set; }

    public virtual DbSet<Warehouse> Warehouses { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=tcp:cohort-p2-projects-server.database.windows.net,1433;Initial Catalog=WarehouseInventoryDB;Persist Security Info=False;User ID=associate;Password=Project@1234;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Item>(entity =>
        {
            entity.HasKey(e => e.ItemId).HasName("PK__Items__727E83EB6A81430A");

            entity.HasIndex(e => new { e.WarehouseId, e.ItemName }, "Unique_Name").IsUnique();

            entity.Property(e => e.ItemId).HasColumnName("ItemID");
            entity.Property(e => e.ItemName)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");

            entity.HasOne(d => d.Warehouse).WithMany(p => p.Items)
                .HasForeignKey(d => d.WarehouseId)
                .HasConstraintName("FK__Items__Warehouse__7B264821");
        });

        modelBuilder.Entity<ItemCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__ItemCate__19093A2BC62FD783");

            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.CategoryName)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");

            entity.HasOne(d => d.Warehouse).WithMany(p => p.ItemCategories)
                .HasForeignKey(d => d.WarehouseId)
                .HasConstraintName("FK__ItemCateg__Wareh__76619304");
        });

        modelBuilder.Entity<Log>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__Logs__5E5499A84608AFA8");

            entity.Property(e => e.LogId).HasColumnName("LogID");
            entity.Property(e => e.ItemId).HasColumnName("ItemID");
            entity.Property(e => e.MovementDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");

            entity.HasOne(d => d.Item).WithMany(p => p.Logs)
                .HasForeignKey(d => d.ItemId)
                .HasConstraintName("FK__Logs__ItemID__10216507");

            entity.HasOne(d => d.User).WithMany(p => p.Logs)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__Logs__UserID__11158940");
        });

        modelBuilder.Entity<RItemsItemCategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__R_Items___3214EC27EB3F4217");

            entity.ToTable("R_Items_ItemCategories");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.ItemId).HasColumnName("ItemID");

            entity.HasOne(d => d.Category).WithMany(p => p.RItemsItemCategories)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__R_Items_I__Categ__7E02B4CC");

            entity.HasOne(d => d.Item).WithMany(p => p.RItemsItemCategories)
                .HasForeignKey(d => d.ItemId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__R_Items_I__ItemI__7EF6D905");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCACD0DF6FC8");

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.PasswordHash).HasMaxLength(32);
            entity.Property(e => e.Salt).HasMaxLength(16);
            entity.Property(e => e.Username)
                .HasMaxLength(255)
                .IsUnicode(false);
        });

        modelBuilder.Entity<UserPermission>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.WarehouseId }).HasName("PK__UserPerm__95E8465112D69508");

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");

            entity.HasOne(d => d.User).WithMany(p => p.UserPermissions)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__UserPermi__UserI__72910220");

            entity.HasOne(d => d.Warehouse).WithMany(p => p.UserPermissions)
                .HasForeignKey(d => d.WarehouseId)
                .HasConstraintName("FK__UserPermi__Wareh__73852659");
        });

        modelBuilder.Entity<Warehouse>(entity =>
        {
            entity.HasKey(e => e.WarehouseId).HasName("PK__Warehous__2608AFD97032704E");

            entity.ToTable("Warehouse");

            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
