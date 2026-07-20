using Microsoft.EntityFrameworkCore;

namespace ArtisanShop.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Customer> Customers => Set<Customer>();
}

public class Product
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public decimal Price { get; set; }
    public bool InStock { get; set; }
}

public class Order
{
    public long Id { get; set; }
    public long CustomerId { get; set; }
    public DateTime CreatedAt { get; set; }
    public decimal TotalAmount { get; set; }
}

public class Customer
{
    public long Id { get; set; }
    public required string Email { get; set; }
    public required string FullName { get; set; }
}
