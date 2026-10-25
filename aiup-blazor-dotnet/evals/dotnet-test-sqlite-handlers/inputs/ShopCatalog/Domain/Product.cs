namespace ShopCatalog.Domain;

public class Product
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public required string Category { get; set; }
    public decimal Price { get; set; }
    public bool InStock { get; set; } = true;
}
