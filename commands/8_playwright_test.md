Create Playwright test for the use case #$ARGUMENTS.
Never use Mockito!
Use existing test data from src/test/resources/db/migration.
Don't accces a service, repository or DSLContext.
Make sure to remove data that was created during the tests but don't delete all data.
Use AssertJ assertions.
Extend from PlaywrightIT

Example

```java
page.navigate("http://localhost:%d/workshops".formatted(localServerPort));

GridPw gridPw = new GridPw(page);
// Caution! This test runs in the browser and depending on the view port not all rows are rendered.
Assertions.assertThat(gridPw.getRenderedRowCount()).isGreaterThan(1);

GridPw.RowPw row = gridPw.getRow(0);
Assertions.assertThat(row.getCell(0).innerText()).isEqualTo("ATDD mit Spring Boot & Karate");

row.select();
mopo.waitForConnectionToSettle();

Locator title = page.locator("vaadin-text-field")
        .filter(new Locator.FilterOptions().setHasText("Title"))
        .locator("input");
Assertions.assertThat(title.inputValue()).isEqualTo("ATDD mit Spring Boot & Karate");

title.fill("Test");

page.locator("vaadin-button").filter(new Locator.FilterOptions().setHasText("Save")).click();
mopo.waitForConnectionToSettle();

GridPw.RowPw rowAfterSave = gridPw.getRow(0);
Assertions.assertThat(rowAfterSave.getCell(0).innerText()).isEqualTo("Test");
```