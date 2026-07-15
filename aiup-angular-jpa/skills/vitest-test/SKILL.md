---
name: vitest-test
description: >
  Creates Vitest component tests for Angular views using Angular's own testing
  idioms — TestBed, ComponentFixture, and HttpTestingController — not React
  Testing Library patterns. Use when the user asks to "write frontend tests",
  "test the Angular component", "write a Vitest test", "unit test an Angular
  page", or mentions TestBed, HttpTestingController, or component testing for
  this stack.
---

# Vitest Test

## Instructions

Create Vitest tests for the Angular component/service covering the use case
$ARGUMENTS. Angular's newer `@angular/build:unit-test` builder runs on Vitest +
jsdom built around **Angular's own testing idioms**, not a part of React
Testing Library. Don't reach for RTL-style queries or MSW here unless the
project already has `@testing-library/angular` or MSW as a dependency — check
`package.json` first.

## Test Naming and Use Case Traceability

These are **use case tests**, same intent as the backend's `@UseCase`
annotation — but TypeScript has no annotation mechanism the AIUP IntelliJ
Navigator plugin resolves, so don't claim that integration. Use a plain naming
convention instead:

- File name: `UC-XXX-<slug>.spec.ts` (Angular convention is always `.spec.ts`
  — never `.test.tsx`, there's no JSX), colocated with the component/service
  under test.
- Top-level `describe` block named after the use case:
  `describe('UC-XXX: <Use Case Name>', ...)`.
- Each `it` title should read as the scenario it covers, matching the spec
  heading text.

Before assuming this is what the project's Vitest builder discovers, check the
project's actual test configuration (`angular.json`'s `test` architect target,
or a dedicated Vitest config) for the real include glob rather than asserting
it unconditionally.

```ts
describe('UC-010: Browse Room Type Catalog', () => {
    it('main scenario - loads and displays room types', async () => { /* ... */
    });
    it('A1: filters room types by capacity', async () => { /* ... */
    });
});
```

## DO NOT

- Port React Testing Library query-priority patterns (`getByRole`,
  `getByLabelText`) wholesale — use them only if `@testing-library/angular` is
  already a project dependency
- Leave real HTTP calls unmocked — always provide `provideHttpClientTesting()`
  and verify with `httpMock.verify()`
- Reach for MSW — `HttpTestingController` is Angular's own idiomatic mechanism
  for this; don't add a dependency the ecosystem doesn't need here
- Default to `fakeAsync`/`tick()` in a zoneless project — check the bootstrap
  config for `provideZonelessChangeDetection()` vs zone.js first
- Assert on internal component state that isn't a signal read through its
  public accessor
- Use `NgModule`-based `TestBed` configuration (`declarations: [...]`) —
  standalone components are imported directly

## Setting Up a Component Test

Standalone components are imported directly into the testing module — no
`declarations` array:

```ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { RoomTypeOverview } from './room-type-overview';

describe('UC-010: Browse Room Type Catalog', () => {
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RoomTypeOverview],
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('main scenario - loads and displays room types', async () => {
        const fixture = TestBed.createComponent(RoomTypeOverview);
        fixture.detectChanges();

        const req = httpMock.expectOne('/api/room-types');
        req.flush([{ id: 1, name: 'Deluxe Suite', description: '', capacity: 2, price: 199 }]);

        await fixture.whenStable();

        expect(fixture.componentInstance.roomTypes()).toHaveLength(1);
        expect(fixture.componentInstance.roomTypes()[0].name).toBe('Deluxe Suite');
    });
});
```

- `fixture.detectChanges()` triggers the initial render/`ngOnInit`; after any
  interaction that touches signals or async work, `await fixture.whenStable()`
  rather than assuming zone.js flushed automatically — check the bootstrap for
  zoneless config first, and only fall back to `fakeAsync`/`tick()` if zone.js
  is actually present.
- Read signal state via its getter (`fixture.componentInstance.roomTypes()`),
  never via a private field.

## Mocking HTTP with `HttpTestingController`

This is Angular's own, built-in mechanism — reach for it instead of MSW:

```ts
const req = httpMock.expectOne('/api/room-types');
expect(req.request.method).toBe('GET');
req.flush([{ id: 1, name: 'Deluxe Suite', description: '', capacity: 2, price: 199 }]);
```

For an alternative/error flow:

```ts
req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
```

Always call `httpMock.verify()` in `afterEach` to assert no unexpected
requests were made.

## Mocking a Component's Own Service Dependencies (DI override)

For a component under test that depends on a *non-HTTP* service (e.g. an
i18n/translation service), override it via Angular's dependency injection —
reserve `HttpTestingController` specifically for the outermost HTTP boundary:

```ts
class MockI18nService {
    translate(key: string): string {
        return key;
    }
}

TestBed.configureTestingModule({
    imports: [RoomTypeCard],
    providers: [{ provide: I18nService, useClass: MockI18nService }],
});
```

## Testing a Plain Service

```ts
describe('RoomTypeService', () => {
    let service: RoomTypeService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(RoomTypeService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('main scenario - fetches all room types', () => {
        service.getAll().subscribe((roomTypes) => {
            expect(roomTypes).toHaveLength(1);
        });

        httpMock.expectOne('/api/room-types').flush([{ id: 1, name: 'Deluxe Suite' }]);
    });
});
```

## Locating Elements

Native Angular DOM queries — this matches the codebase's current convention;
only switch to `@testing-library/angular`-style accessible queries if that
dependency is already present:

```ts
const button = fixture.debugElement.query(By.css('button.save'));
button.nativeElement.click();

const heading = fixture.nativeElement.querySelector('h1');
expect(heading.textContent).toContain('Room Types');
```

## Form Interactions

```ts
const input = fixture.debugElement.query(By.css('input[name="capacity"]'));
input.nativeElement.value = '4';
input.nativeElement.dispatchEvent(new Event('input'));
fixture.detectChanges();
await fixture.whenStable();
```

## Assertions Reference

| Assertion Type         | Example                                                               |
|------------------------|-----------------------------------------------------------------------|
| Signal value           | `expect(component.roomTypes()).toHaveLength(1)`                       |
| DOM text content       | `expect(fixture.nativeElement.textContent).toContain('Deluxe Suite')` |
| Element present        | `expect(fixture.debugElement.query(By.css('.error'))).toBeTruthy()`   |
| HTTP request made      | `httpMock.expectOne('/api/room-types')`                               |
| No unexpected requests | `httpMock.verify()` in `afterEach`                                    |

## Workflow

1. Read the use case specification (`docs/use-cases/UC-XXX-*.md`) to identify
   the main success scenario, alternative flows (A1, A2, …), and referenced
   business rules (BR-XXX)
2. Create the test file `UC-XXX-<slug>.spec.ts` colocated with the
   component/service
3. Configure `TestBed` with `provideHttpClient()` + `provideHttpClientTesting()`
   for anything that makes HTTP calls
4. For each scenario:
    - Create the fixture, trigger `detectChanges()`/`whenStable()`
    - Flush the expected `HttpTestingController` request(s) with the response
      shape the backend's real DTO produces
    - Assert on signal values and rendered DOM
5. Run the tests to verify they pass (`ng test`)
6. If a test fails:
    - Confirm the mocked URL matches exactly what the component/service requests
    - Confirm `await fixture.whenStable()` was awaited after any signal-driven
      async update
    - Call `httpMock.verify()` to catch unexpected/missing requests

## Resources

- Angular testing documentation: https://angular.dev/guide/testing
- Component testing scenarios: https://angular.dev/guide/testing/components-scenarios
- `HttpClientTestingModule`/`HttpTestingController`: https://angular.dev/guide/http/testing
- Vitest documentation: https://vitest.dev/guide/
- If `aiup-core` is installed, its context7 MCP server covers RxJS/Vitest docs —
  see [the MCP setup rule](../../rules/mcp-servers.md)
