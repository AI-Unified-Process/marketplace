// UC-002 Register for Workshop.
import { useEffect, useState } from 'react';
import { Button, Grid, GridColumn, Notification, TextField, EmailField } from '@vaadin/react-components';
import { RegistrationEndpoint } from 'Frontend/generated/endpoints';
import type UpcomingWorkshop from 'Frontend/generated/com/example/workshops/registration/UpcomingWorkshop';
import type { ViewConfig } from '@vaadin/hilla-file-router/types.js';

export const config: ViewConfig = { title: 'Register for a Workshop' };

export default function RegisterView() {
  const [workshops, setWorkshops] = useState<UpcomingWorkshop[]>([]);
  const [selected, setSelected] = useState<UpcomingWorkshop | undefined>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const load = () => RegistrationEndpoint.findUpcoming().then(setWorkshops);
  useEffect(() => {
    load();
  }, []);

  const register = async () => {
    if (!selected) return;
    try {
      await RegistrationEndpoint.register({ workshopId: selected.id, name, email });
      Notification.show(`You are registered for ${selected.title}.`);
      await load();
    } catch (e: any) {
      Notification.show(e.message);
    }
  };

  return (
    <div className="p-m flex flex-col gap-s">
      <Grid
        id="upcoming-workshops"
        items={workshops}
        selectedItems={selected ? [selected] : []}
        onActiveItemChanged={(e) => setSelected(e.detail.value ?? undefined)}>
        <GridColumn path="title" header="Title" />
        <GridColumn path="startsAt" header="Start" />
        <GridColumn path="freePlaces" header="Free places" />
      </Grid>
      <TextField label="Name" maxlength={100} value={name} onValueChanged={(e) => setName(e.detail.value)} />
      <EmailField label="Email" maxlength={255} value={email} onValueChanged={(e) => setEmail(e.detail.value)} />
      <Button onClick={register}>Register</Button>
    </div>
  );
}
