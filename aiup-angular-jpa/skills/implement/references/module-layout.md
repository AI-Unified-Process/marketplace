# Backend module-layout detection

This is a lookup used by `/implement`, `/flyway-migration`, and `/spring-boot-test` before
writing any backend code. Its job is to answer one question: **does this Spring Boot
backend split hexagonal layers across separate Maven modules, or is it one flat module?**
Never assume — always run this detection first, because generating flat-style code into a
hexagonal reactor (or vice versa) breaks the project's module dependency direction (e.g. a
JPA `@Entity` accidentally placed in a `domain` module that has zero framework
dependencies).

## Step 1 — Find the real reactor

Read the backend's root `pom.xml`. If it is a thin aggregator — `<packaging>pom</packaging>`,
a `<modules>` list pointing at sibling directories, no Java source of its own (this is common
when a repo's outermost `pom.xml` aggregates both a frontend placeholder module and a backend
directory) — descend into whichever listed module itself declares further `<modules>`, and
treat *that* nested `pom.xml`'s module list as the candidate reactor. Don't stop at the
outermost aggregator if it's just a wrapper.

## Step 2 — Classify each module by keyword bucket

Match each module's directory name / `artifactId` (case-insensitive substring, after
stripping any common project-name prefix) against these buckets:

| Bucket               | Keywords                                                 |
|----------------------|----------------------------------------------------------|
| Domain               | `domain`                                                 |
| Business/Application | `business`, `application`, `service`, `core`             |
| Persistence adapter  | `postgres`, `jpa`, `persistence`, `db`, `infra*`, `data` |
| Inbound adapter      | `api`, `web`, `rest`, `controller`                       |
| Composition root     | `app`, `bootstrap`, `launcher`, `main`, `runner`         |

## Step 3 — Confidence gate

Classify as **Hexagonal Multi-Module** only if a Domain-bucket module is present **and**
at least two of {Business/Application, Persistence adapter, Inbound adapter} are also
present. Never switch pattern on a single keyword match alone.

Otherwise → **Flat Single-Module**. Say so explicitly in your response ("found N modules
but couldn't confidently classify them as a layered split — implementing as a flat pattern
into `<module>`; let me know if this project follows a different layered convention") rather
than silently picking one.

## Step 4 — Before writing new code in the hexagonal case, imitate an existing feature

Find one already-implemented entity/feature across the classified modules and copy its
exact shape — don't generate purely from this heuristic in isolation:

- **Outbound port location**: is the repository/port interface a plain sibling file next to
  the service class, or does it live in a dedicated `port`/`port.out` subpackage? Match
  whichever exists.
- **Inbound port**: does any use-case/inbound-port interface exist anywhere in the reactor
  (something the controller implements against, rather than calling a concrete service
  directly)? If none exists project-wide, do **not** invent one for the new feature — call
  the concrete `@Service` class directly from the controller, matching the existing
  asymmetric convention.
- **DTO conversion**: is it a static factory method living on the DTO record itself (e.g.
  `XxxDTO.fromBusiness(domainObject)`), or a separate mapper class? Match whichever exists.
  It's normal for the request-side and response-side to use different approaches — copy
  each side's own convention rather than unifying them into one.

## Step 5 — First-ever hexagonal use case (nothing to imitate yet)

If the reactor is classified as Hexagonal Multi-Module but has no existing feature to copy,
fall back to this documented default rather than inventing textbook full hexagonal:

- Outbound port as a plain sibling interface in the business module (not a `port`
  subpackage).
- No inbound port/use-case interface — the controller calls the concrete service directly.
- DTO-to-domain conversion for the response path via a static factory method on the DTO
  record itself.

## Reference chain (hexagonal case)

```
<Feature>Controller                    (inbound adapter module)
  → <Feature>Service                    (business module, concrete class — no interface)
    → <Feature>Factory / mapper         (business module — request DTO → domain, if the project uses one)
    → <Feature>Repository (interface)   (business module — the one real port)
      → <Feature>RepositoryImpl         (persistence adapter module, implements the port)
        → <Feature>EntityConverter      (persistence adapter module — domain → JPA entity)
        → <Feature>JpaRepository        (persistence adapter module — Spring Data JpaRepository<Entity, ID>)
        → <Feature>Converter            (persistence adapter module — JPA entity → domain, back-conversion)
  → <Feature>DTO.fromBusiness(...)      (business module — domain → response DTO)
  ← ResponseEntity<...DTO>
```

Never let a JPA `@Entity`, Spring annotation, or persistence import leak into the domain
module — that module's whole purpose is to have zero framework dependencies.
