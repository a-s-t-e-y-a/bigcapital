// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import { Classes, Position, ControlGroup } from '@blueprintjs/core';
import { CLASSES } from '@/constants/classes';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import {
  FFormGroup,
  FInputGroup,
  FDateInput,
  FormattedMessage as T,
} from '@/components';
import {
  ExpenseSelect,
  FInputGroupComponent,
  ProjectTaskChargeTypeSelect,
} from '../../components';
import ExpenseFormChargeFields from './ProjectExpenseFormChargeFields';
import { momentFormatter } from '@/utils';
import { useProjectExpenseFormContext } from './ProjectExpenseFormProvider';
import { expenseChargeOption } from '../common/modalChargeOptions';

/**
 * Project expense form fields.
 * @returns
 */
export default function ProjectExpenseFormFields() {
  const { values } = useFormikContext();

  React.useEffect(() => {
    console.log('Form Fields:', values);
  }, [values]);

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Expense Name -----------*/}
      <FFormGroup
        label={intl.get('project_expense.dialog.expense_name')}
        name={'expenseName'}
      >
        <FInputGroup name="expenseName" />
      </FFormGroup>
      {/*------------ Track to Expense -----------*/}
      {/* <FFormGroup
        name={'estimatedExpense'}
        label={intl.get('project_expense.dialog.track_expense')}
        className={classNames('form-group--select-list', Classes.FILL)}
      >
        <ExpenseSelect
          name={'estimatedExpense'}
          popoverProps={{ minimal: true }}
          expenses={[{ id: 1, name: 'Expense 1' }]}
          value={values.estimatedExpense}
          onChange={(value) => setFieldValue('estimatedExpense', value)}
        />
      </FFormGroup> */}

      {/*------------ Extimated Date -----------*/}
      <FFormGroup
        label={intl.get('project_expense.dialog.expense_date')}
        name={'expemseDate'}
        className={classNames(CLASSES.FILL, 'form-group--date')}
      >
        <FDateInput
          {...momentFormatter('YYYY/MM/DD')}
          name="expemseDate"
          formatDate={(date) => date.toLocaleString()}
          popoverProps={{
            position: Position.BOTTOM,
            minimal: true,
          }}
        />
      </FFormGroup>
      {/*------------ Quantity -----------*/}
      <FFormGroup
        label={intl.get('project_expense.dialog.quantity')}
        name={'expenseQuantity'}
      >
        <FInputGroupComponent name="expenseQuantity" />
      </FFormGroup>

      <MetaLineLabel>
        <T id={'project_expense.dialog.cost_to_you'} />
      </MetaLineLabel>
      {/*------------ Unit Price -----------*/}
      <ControlGroup className={Classes.FILL}>
        <FInputGroup name="expenseUnitPrice" />
      </ControlGroup>

      <MetaLineLabel>
        <T id={'project_expense.dialog.what_you_ll_charge'} />
      </MetaLineLabel>
      {/*------------ Charge -----------*/}
      <FFormGroup
        name={'expenseCharge'}
        label={<T id={'project_expense.dialog.charge'} />}
      >
        <FInputGroup name="expenseTotal" />
      </FFormGroup>

      {/*------------ Charge Fields -----------*/}
      {/* <ExpenseFormChargeFields /> */}
    </div>
  );
}

const MetaLineLabel = styled.div`
  font-size: 14px;
  line-height: 1.5rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const ExpenseTotalBase = styled.div`
  display: block;
  text-align: right;
`;

const ExpenseTotalLabel = styled.div`
  font-size: 14px;
  line-height: 1.5rem;
  opacity: 0.75;
`;

const ExpenseTotal = styled.div`
  font-size: 15px;
  font-weight: 700;
  padding-left: 14px;
  line-height: 2rem;
`;
