import { useEffect, useState } from 'react';
import { Button } from '@vaadin/react-components/Button.js';
import { DatePicker } from '@vaadin/react-components/DatePicker.js';
import { Grid } from '@vaadin/react-components/Grid.js';
import { GridColumn } from '@vaadin/react-components/GridColumn.js';
import { TextField } from '@vaadin/react-components/TextField.js';
import { EndpointError } from '@vaadin/hilla-frontend';
import { TaskService } from 'Frontend/generated/endpoints';
import type TaskDto from 'Frontend/generated/com/example/tasks/TaskDto';
import type { ViewConfig } from '@vaadin/hilla-file-router/types.js';

export const config: ViewConfig = { title: 'Tasks', menu: { title: 'Tasks' } };

export default function TasksView() {
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    TaskService.list().then(setTasks);
  }, []);

  async function addTask() {
    if (!title.trim()) {
      setErrorMessage('Title is required');
      return;
    }
    try {
      await TaskService.save({ title, dueDate: dueDate || undefined, done: false });
      setErrorMessage('');
      setTitle('');
      setDueDate('');
      setTasks(await TaskService.list());
    } catch (error) {
      if (error instanceof EndpointError) {
        setErrorMessage(error.message ?? 'Saving failed');
      } else {
        throw error;
      }
    }
  }

  return (
    <main className="p-m flex flex-col gap-m">
      <section className="flex gap-s items-baseline">
        <TextField label="Title" value={title} onValueChanged={(e) => setTitle(e.detail.value)} />
        <DatePicker label="Due date" value={dueDate} onValueChanged={(e) => setDueDate(e.detail.value)} />
        <Button theme="primary" onClick={addTask}>
          Add task
        </Button>
      </section>
      {errorMessage && <div role="alert">{errorMessage}</div>}
      <Grid items={tasks}>
        <GridColumn path="title" header="Title" />
        <GridColumn path="dueDate" header="Due date" />
        <GridColumn path="done" header="Done" />
      </Grid>
    </main>
  );
}
