using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShopCatalog.Domain;

namespace ShopCatalog.Data;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("product");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Name).HasMaxLength(150).IsRequired();
        builder.Property(p => p.Category).HasMaxLength(60).IsRequired();
        builder.Property(p => p.Price).HasPrecision(10, 2);
        builder.Property(p => p.InStock).HasDefaultValue(true);
    }
}
