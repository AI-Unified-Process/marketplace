/**
 * Frontend tests for UC-001 "Manage Persons".
 *
 * Template for /hilla-test frontend suites:
 * - File name UC-XXX-<slug>.test.tsx, top-level describe named after the use case
 * - Generated endpoint clients mocked with vi.spyOn — no server, no network
 * - Mocked DTOs copy the field names of the generated TypeScript types
 * - Error flows reject with EndpointError so the production error path runs
 */
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { EndpointError } from '@vaadin/hilla-frontend';
import PersonsView from 'Frontend/views/persons';
import { PersonService } from 'Frontend/generated/endpoints';
import type PersonDto from 'Frontend/generated/com/example/app/person/PersonDto';

const alice: PersonDto = { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com' };
const bob: PersonDto = { id: 2, firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com' };

describe('UC-001: Manage Persons', () => {
  let listSpy: MockInstance;
  let saveSpy: MockInstance;

  beforeEach(() => {
    listSpy = vi.spyOn(PersonService, 'list').mockResolvedValue([alice, bob]);
    saveSpy = vi
      .spyOn(PersonService, 'save')
      .mockImplementation(async (person) => ({ ...person, id: 3 }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('main scenario - lists persons on load', async () => {
    render(<PersonsView />);

    await waitFor(() => expect(screen.getByText('alice@example.com')).to.exist);
    expect(screen.getByText('bob@example.com')).to.exist;
    expect(listSpy).toHaveBeenCalledOnce();
  });

  it('main scenario - saves a new person through the endpoint client', async () => {
    render(<PersonsView />);

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
    // The saved person appears in the refreshed list
    listSpy.mockResolvedValue([alice, bob, { id: 3, firstName: 'Carol', lastName: 'Miller', email: 'carol@example.com' }]);
    await waitFor(() => expect(screen.getByText('carol@example.com')).to.exist);
  });

  it('A1: email already exists - shows the endpoint error to the user', async () => {
    saveSpy.mockRejectedValue(new EndpointError('Email already registered'));
    render(<PersonsView />);

    await userEvent.type(screen.getByLabelText('First name'), 'Alice');
    await userEvent.type(screen.getByLabelText('Last name'), 'Smith');
    await userEvent.type(screen.getByLabelText('Email'), 'alice@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(screen.getByText('Email already registered')).to.exist);
  });

  it('A2: required field missing - does not call the endpoint', async () => {
    render(<PersonsView />);

    // Email left empty — useForm validation blocks submission client-side
    await userEvent.type(screen.getByLabelText('First name'), 'Carol');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(saveSpy).not.toHaveBeenCalled();
  });
});
