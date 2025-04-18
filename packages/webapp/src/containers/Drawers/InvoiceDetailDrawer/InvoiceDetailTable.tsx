// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import { CommercialDocEntriesTable } from '@/components';

import { useInvoiceReadonlyEntriesColumns } from './utils';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

import { TableStyle } from '@/constants';

/**
 * Invoice readonly details entries table columns.
 */
export default function InvoiceDetailTable() {
  // Invoice readonly entries table columns.
  const columns = useInvoiceReadonlyEntriesColumns();

  // Invoice details drawer context.
  const {
    invoice: { entries },
  } = useInvoiceDetailDrawerContext();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={entries}
      styleName={TableStyle.Constrant}
      initialHiddenColumns={
        // If any entry has no discount, hide the discount column.
        entries?.some((e) => e.discount_formatted) ? [] : ['discount']
      }
    />
  );
}
