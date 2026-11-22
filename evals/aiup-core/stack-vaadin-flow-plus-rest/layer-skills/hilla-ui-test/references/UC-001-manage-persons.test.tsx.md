<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# UC-001-manage-persons.test.tsx

The source file `UC-001-manage-persons.test.tsx`, wrapped in Markdown so that every skill host installs it.
Use the content of the code block below; a copy written to disk takes the name `UC-<id>-<slug>.test.tsx` of its use
case, here `UC-001-manage-persons.test.tsx`, under `src/main/frontend/tests/`.

```tsx
/**
 * Frontend tests for UC-001 "Manage Persons".
 *
 * Template for /hilla-ui-test suites:
 * - File name UC-XXX-<slug>.test.tsx, top-level describe named after the use case
 * - Generated endpoint clients mocked with vi.spyOn — no server, no network
 * - Mocked DTOs copy the field names of the generated TypeScript types
 * - The Grid's dataProvider calls the paged list(offset, limit, filter) and count(filter)
 * - Error flows reject with EndpointError so the production error path runs
 */
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { EndpointError } from '@vaadin/hilla-frontend';
import ManagePersonsView from 'Frontend/views/persons';
import { PersonEndpoint } from 'Frontend/generated/endpoints';
import type PersonListItem from 'Frontend/generated/com/example/app/person/PersonListItem';

const alice: PersonListItem = { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com' };
const bob: PersonListItem = { id: 2, firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com' };

describe('UC-001: Manage Persons', () => {
  let listSpy: MockInstance;
  let countSpy: MockInstance;
  let saveSpy: MockInstance;

  beforeEach(() => {
    listSpy = vi.spyOn(PersonEndpoint, 'list').mockResolvedValue([alice, bob]);
    countSpy = vi.spyOn(PersonEndpoint, 'count').mockResolvedValue(2);
    saveSpy = vi
      .spyOn(PersonEndpoint, 'save')
      .mockImplementation(async (person) => ({ ...person, id: 3 }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('main scenario - lists persons on load', async () => {
    render(<ManagePersonsView />);

    await waitFor(() => expect(screen.getByText('alice@example.com')).to.exist);
    expect(screen.getByText('bob@example.com')).to.exist;
    expect(listSpy).toHaveBeenCalled();
    expect(countSpy).toHaveBeenCalled();
  });

  it('main scenario - saves a new person through the endpoint client', async () => {
    // The list the view reloads after the save — set before the click, so the reload cannot run first
    const carol: PersonListItem = { id: 3, firstName: 'Carol', lastName: 'Miller', email: 'carol@example.com' };
    render(<ManagePersonsView />);
    await waitFor(() => expect(screen.getByText('alice@example.com')).to.exist);
    listSpy.mockResolvedValue([alice, bob, carol]);
    countSpy.mockResolvedValue(3);

    await userEvent.type(screen.getByLabelText('First name'), 'Carol');
    await userEvent.type(screen.getByLabelText('Last name'), 'Miller');
    await userEvent.type(screen.getByLabelText('Email'), 'carol@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Carol',
          lastName: 'Miller',
          email: 'carol@example.com',
        }),
      ),
    );
    // Step 5: the success message and the saved person in the refreshed list
    await waitFor(() => expect(screen.getByText('Person saved')).to.exist);
    await waitFor(() => expect(screen.getByText('carol@example.com')).to.exist);
  });

  it('A1: email already exists - shows the endpoint error to the user', async () => {
    saveSpy.mockRejectedValue(new EndpointError('Email already registered'));
    render(<ManagePersonsView />);

    await userEvent.type(screen.getByLabelText('First name'), 'Alice');
    await userEvent.type(screen.getByLabelText('Last name'), 'Smith');
    await userEvent.type(screen.getByLabelText('Email'), 'alice@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(screen.getByText('Email already registered')).to.exist);
  });

  it('A2: required field missing - does not call the endpoint', async () => {
    render(<ManagePersonsView />);

    // Email left empty — useForm validation blocks submission client-side
    await userEvent.type(screen.getByLabelText('First name'), 'Carol');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(saveSpy).not.toHaveBeenCalled();
  });
});
```
