import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Grid, GridColumn } from '@vaadin/react-components';
import { useEffect, useState } from 'react';
import { CustomerService } from 'Frontend/generated/endpoints';
import CustomerSummaryDto from 'Frontend/generated/com/example/shop/customer/CustomerSummaryDto';

export const config: ViewConfig = {
  title: 'Customers',
  menu: { title: 'Customers' },
};

export default function CustomersView() {
  const [customers, setCustomers] = useState<CustomerSummaryDto[]>([]);

  useEffect(() => {
    CustomerService.findAllSummaries().then(setCustomers);
  }, []);

  return (
    <Grid items={customers}>
      <GridColumn path="name" header="Name" />
      <GridColumn path="email" header="Email" />
    </Grid>
  );
}
