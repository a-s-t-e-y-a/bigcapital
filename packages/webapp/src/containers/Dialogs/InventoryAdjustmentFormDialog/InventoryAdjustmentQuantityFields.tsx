// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import { Choose } from '@/components';
import IncrementAdjustmentFields from './IncrementAdjustmentFields';
import DecrementAdjustmentFields from './DecrementAdjustmentFields';

export default function InventoryAdjustmentQuantityFields() {
  const { values } = useFormikContext();

  return (
    <div className="adjustment-fields">
      <Choose>
        <Choose.When condition={values.type === 'decrement'}>
          <DecrementAdjustmentFields />
        </Choose.When>
        <Choose.When condition={values.type === 'increment'}>
          <IncrementAdjustmentFields />
        </Choose.When>
      </Choose>
    </div>
  );
}