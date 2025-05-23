// @ts-nocheck
import React from 'react';
import { ProjectExpenseFormProvider } from './ProjectExpenseFormProvider';
import ProjectExpenseForm from './ProjectExpenseForm';

/**
 * Project expense form dialog content.
 * @returns
 */
export default function ProjectExpenseFormDialogContent({
  // #ownProps
  dialogName,
  expense,
  project,
}) {
  console.log(project)
  return (
    <ProjectExpenseFormProvider dialogName={dialogName} expenseId={expense} projectId={project}>
      <ProjectExpenseForm />
    </ProjectExpenseFormProvider>
  );
}
