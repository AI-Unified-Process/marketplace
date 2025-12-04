Create KaribuTest for the use case #$ARGUMENTS.
Never use Mockito!
Create the test data per test using Flyway migrations in src/test/resources/db/migration.
Don't use a service, repository or DSLContext to create test data.
Make sure to remove data that was created during the tests but don't delete all data.
Use AssertJ assertions or KaribuTesting assertions.
Karibu Tests may not use @Transactional because the transaction boundary must stay!
Use the KaribuTesting MCP server.
The Karibu Testing documentation can be found
here: https://github.com/mvysny/karibu-testing/tree/master/karibu-testing-v10

There are important helper classes:
- com.github.mvysny.kaributesting.v10.GridKt
- com.github.mvysny.kaributesting.v10.NotificationsKt
- com.github.mvysny.kaributesting.v10.pro.ConfirmDialogKt

Example:

````java
	@Test
	void check_grid_size() {
		UI.getCurrent().navigate(PersonView.class);

		var grid = _get(Grid.class);
		assertThat(GridKt._size(grid)).isEqualTo(100);

		Set<PersonRecord> selectedItems = grid.getSelectedItems();
		assertThat(selectedItems).hasSize(1).first().extracting(PersonRecord::getFirstName).isEqualTo("Eula");
		
		// Get component Column from Grid
		GridKt._getCellComponent(grid, 0, "actions")
			.getChildren()
			.filter(Button.class::isInstance)
			.findFirst()
			.map(Button.class::cast)
			.ifPresent(Button::click);
	}
```