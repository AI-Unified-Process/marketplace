using Microsoft.EntityFrameworkCore;
using ShopCatalog.Data;
using ShopCatalog.Domain;

namespace ShopCatalog.Features.UC010_BrowseProductCatalog;

public class BrowseProductCatalogHandler(IDbContextFactory<AppDbContext> contextFactory)
{
    public async Task<IReadOnlyList<Product>> HandleAsync(
        BrowseProductCatalogQuery query,
        CancellationToken cancellationToken = default)
    {
        await using var context = await contextFactory.CreateDbContextAsync(cancellationToken);

        // BR-010: out-of-stock products must never appear in the catalog
        var products = context.Products.Where(p => p.InStock);

        if (!string.IsNullOrWhiteSpace(query.Category))
        {
            products = products.Where(p => p.Category == query.Category);
        }

        return await products
            .OrderBy(p => p.Name)
            .ToListAsync(cancellationToken);
    }
}
