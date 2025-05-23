// @ts-nocheck
import React from 'react';
import { Button, MenuItem } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import { useHistory } from 'react-router-dom';
import { Icon } from '@/components';
import { Position } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { css } from '@emotion/css';
import { Intent } from '@blueprintjs/core';

import { useGetQuickNewMenu } from '@/constants/quickNewOptions';

/**
 * Quick New Dropdown.
 */
export default function QuickNewDropdown() {
  const history = useHistory();
  const quickNewOptions = useGetQuickNewMenu();

  // Can't continue if there is no any quick new menu items to display.
  if (quickNewOptions.length === 0) {
    return null;
  }
  // Handle click quick new button.
  const handleClickQuickNew = ({ path }) => {
    history.push(`/${path}`);
  };

  // Item renderer.
  const itemRenderer = (item, { handleClick, modifiers, query }) => (
    <MenuItem text={item.name} label={item.label} onClick={handleClick} />
  );

  return (
    <Select
      items={quickNewOptions}
      itemRenderer={itemRenderer}
      onItemSelect={(type) => handleClickQuickNew(type)}
      popoverProps={{ minimal: false, position: Position.BOTTOM }}
      className={'form-group--quick-new-downDrop'}
      filterable={false}
    >
      <Button
        text={<T id={'quick_new'} />}
        icon={<Icon icon={'plus-24'} iconSize={20} />}
        intent={Intent.PRIMARY}
        className={css`
          &.bp4-button.bp4-intent-primary {
            width: 150px;
            height: 40px;
            background-color: #0052cc;
            color: white;
            padding: 5px 8px;
            border-radius: 5px;
            &:hover {
              background-color: #004bb3;
            }
          }
        `}
      />
    </Select>
  );
}
