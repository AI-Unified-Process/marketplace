// UC-020 Register Guest
import { useEffect } from 'react';
import { useSignal } from '@vaadin/hilla-react-signals';
import { useForm } from '@vaadin/hilla-react-form';
import { EndpointError } from '@vaadin/hilla-frontend';
import type { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, DatePicker, EmailField, FormLayout, Grid, GridColumn, Notification, TextField } from '@vaadin/react-components';
import { GuestEndpoint } from 'Frontend/generated/endpoints';
import type Guest from 'Frontend/generated/com/example/hotel/guest/Guest';
import GuestRegistrationModel from 'Frontend/generated/com/example/hotel/guest/GuestRegistrationModel';

export const config: ViewConfig = { title: 'Guests', menu: { order: 1 }, rolesAllowed: ['FRONT_DESK'] };

export default function GuestsView() {
  const guests = useSignal<Guest[]>([]);
  const reload = async () => {
    guests.value = await GuestEndpoint.list();
  };
  useEffect(() => {
    reload();
  }, []);

  const { model, field, submit, clear } = useForm(GuestRegistrationModel, {
    onSubmit: async (registration) => {
      try {
        await GuestEndpoint.register(registration);
        Notification.show('Guest saved', { theme: 'success' });
        clear();
        await reload();
      } catch (e) {
        if (e instanceof EndpointError) {
          Notification.show(e.message, { theme: 'error' });
        }
      }
    },
  });

  return (
    <div className="p-m">
      <Grid items={guests.value}>
        <GridColumn path="firstName" header="First name" />
        <GridColumn path="lastName" header="Last name" />
        <GridColumn path="email" header="Email" />
      </Grid>
      <FormLayout>
        <TextField label="First name" {...field(model.firstName)} />
        <TextField label="Last name" {...field(model.lastName)} />
        <EmailField label="Email" {...field(model.email)} />
        <DatePicker label="Date of birth" {...field(model.dateOfBirth)} />
      </FormLayout>
      <Button theme="primary" onClick={submit}>
        Register
      </Button>
    </div>
  );
}
