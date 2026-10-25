<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Example Slice: UC-010 Create Order

The command, validator, and handler of one write use case. The use case states two rules:
BR-001 "An order has at least one item" and BR-002 "A blocked customer cannot place an order".
The page calls the handler and shows `Result.Error` next to the form.

## Features/UC010_CreateOrder/UC010_Command.cs

```csharp
namespace MyApp.Features.UC010_CreateOrder;

public sealed record UC010_Command(long CustomerId, List<UC010_Item> Items);

public sealed record UC010_Item(long ProductId, int Quantity);
```

## Features/UC010_CreateOrder/UC010_Validator.cs

```csharp
using FluentValidation;

namespace MyApp.Features.UC010_CreateOrder;

public sealed class UC010_Validator : AbstractValidator<UC010_Command>
{
    public UC010_Validator()
    {
        // UC-010 BR-001: An order has at least one item.
        RuleFor(c => c.Items).NotEmpty().WithMessage("Add at least one item.");
        RuleForEach(c => c.Items).ChildRules(item =>
            item.RuleFor(i => i.Quantity).GreaterThan(0));
    }
}
```

## Features/UC010_CreateOrder/UC010_Handler.cs

```csharp
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace MyApp.Features.UC010_CreateOrder;

public sealed record UC010_Result(long? OrderId, string? Error);

public sealed class UC010_Handler(
    IDbContextFactory<AppDbContext> dbFactory,
    IValidator<UC010_Command> validator)
{
    public async Task<UC010_Result> HandleAsync(UC010_Command command, CancellationToken ct)
    {
        var validation = await validator.ValidateAsync(command, ct);
        if (!validation.IsValid)
            return new UC010_Result(null, validation.Errors[0].ErrorMessage);

        await using var db = await dbFactory.CreateDbContextAsync(ct);
        var customer = await db.Customers.SingleAsync(c => c.Id == command.CustomerId, ct);

        // UC-010 BR-002: A blocked customer cannot place an order.
        if (customer.Blocked)
            return new UC010_Result(null, "Your account is blocked. Please contact support.");

        var order = new Order
        {
            Customer = customer,
            Items = command.Items
                .Select(i => new OrderItem { ProductId = i.ProductId, Quantity = i.Quantity })
                .ToList()
        };
        db.Orders.Add(order);
        await db.SaveChangesAsync(ct);
        return new UC010_Result(order.Id, null);
    }
}
```

## What it shows

- One `DbContext` per call from `IDbContextFactory`, so a circuit-scoped page never shares one.
- A rule enforced in the validator and a rule enforced in the handler each carry their marker.
- The messages are the ones the specification's alternative flows state; the page displays them as they are.
- Register the handler and validator in `Program.cs` (`AddScoped<UC010_Handler>()`,
  `AddValidatorsFromAssemblyContaining<UC010_Validator>()`) if the project does not scan for them.
