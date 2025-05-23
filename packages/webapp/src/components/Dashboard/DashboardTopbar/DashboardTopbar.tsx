// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router';
import {
  Navbar,
  NavbarGroup,
  NavbarDivider,
  Button,
  Classes,
  Tooltip,
  Position,
  MenuItem,
  Menu,
  MenuDivider,
  Intent,
} from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';

import { FormattedMessage as T, Icon, Hint, If } from '@/components';

import DashboardTopbarUser from '@/components/Dashboard/TopbarUser';
import DashboardBreadcrumbs from '@/components/Dashboard/DashboardBreadcrumbs';
import DashboardBackLink from '@/components/Dashboard/DashboardBackLink';

import withUniversalSearchActions from '@/containers/UniversalSearch/withUniversalSearchActions';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import withDashboard from '@/containers/Dashboard/withDashboard';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import QuickNewDropdown from '@/containers/QuickNewDropdown/QuickNewDropdown';
import {
  DashboardHamburgerButton,
  DashboardQuickSearchButton,
  DashboardTopbarSubscriptionMessage,
} from './_components';

import { DialogsName } from '@/constants/dialogs';
import {
  COMMUNITY_BIGCAPITAL_LINK,
  DOCS_BIGCAPITAL_LINK,
} from '@/constants/routes';

import { compose } from '@/utils';

/**
 * Dashboard topbar.
 */
function DashboardTopbar({
  // #withDashboard
  pageTitle,
  editViewId,
  pageHint,

  // #withDashboardActions
  toggleSidebarExpand,

  // #withDashboard
  sidebarExpended,

  // #withGlobalSearch
  openGlobalSearch,

  // #withDialogActions
  openDialog,
}) {
  const history = useHistory();

  const handlerClickEditView = () => {
    history.push(`/custom_views/${editViewId}/edit`);
  };

  const handleSidebarToggleBtn = () => {
    toggleSidebarExpand();
  };

  return (
    <div class="dashboard__topbar" data-testId={'dashboard-topbar'}>
      <div class="dashboard__topbar-left">
        {/* Remove or comment out the hamburger button section */}
        {/* <div class="dashboard__topbar-sidebar-toggle">
          <Tooltip
            content={
              !sidebarExpended ? (
                <T id={'open_sidebar'} />
              ) : (
                <T id={'close_sidebar'} />
              )
            }
            position={Position.RIGHT}
          >
            <DashboardHamburgerButton onClick={handleSidebarToggleBtn} />
          </Tooltip>
        </div> */}
        <DashboardTopbarSubscriptionMessage />
        {pageTitle && (
          <div className="dashboard__page-title" style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginLeft: '16px',
            width: '100%'
          }}>
            <DashboardBackLink />
            <h3 style={{ 
              margin: 0,
              fontSize: '16px',
              fontWeight: 500,
              color: '#1C2026'
            }}>{pageTitle}</h3>
            <DashboardBreadcrumbs />
            {pageTitle === 'Inventory Adjustments' && (
              <Button
                icon={<Icon icon="plus" iconSize={16} />}
                intent={Intent.PRIMARY}
                className="inventory-adjustment-button"
                onClick={() => openDialog(DialogsName.InventoryAdjustmentForm)}
                style={{ 
                  marginLeft: 'auto',
                  height: '32px',
                  padding: '0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <T id={'new_adjustment'} />
              </Button>
            )}
          </div>
        )}
      </div>
      
      <div class="dashboard__topbar-center">
        <h2 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: 600,
          color: '#1C2026'
        }}>EaseBooks</h2>
      </div>
      
      <div class="dashboard__topbar-right">
        <Navbar class="dashboard__topbar-navbar">
          <NavbarGroup>
            <DashboardQuickSearchButton
              onClick={() => openGlobalSearch(true)}
            />

            <Tooltip
              content={<T id={'notifications'} />}
              position={Position.BOTTOM}
            >
              <Button
                className={Classes.MINIMAL}
                icon={<Icon icon={'notification-24'} iconSize={20} color="#666D80"/>}
              />
            </Tooltip>

            <QuickNewDropdown />

            <Popover2
              content={
                <Menu>
                  <MenuItem
                    text={'Documents'}
                    onClick={() => window.open(DOCS_BIGCAPITAL_LINK)}
                    labelElement={<Icon icon={'share'} iconSize={16} />}
                  />
                  <MenuItem
                    text={'Community support'}
                    onClick={() => window.open(COMMUNITY_BIGCAPITAL_LINK)}
                    labelElement={<Icon icon={'share'} iconSize={16} />}
                  />
                  <MenuItem
                    text={'Keyboard shortcuts'}
                    onClick={() => openDialog(DialogsName.KeyboardShortcutForm)}
                  />
                  <MenuDivider />
                  <MenuItem text={'Share feedback'} />
                </Menu>
              }
            >
            </Popover2>
            <NavbarDivider />
          </NavbarGroup>
        </Navbar>

        <div class="dashboard__topbar-user">
          <DashboardTopbarUser />
        </div>
      </div>
    </div>
  );
}

export default compose(
  withUniversalSearchActions,
  withDashboard(({ pageTitle, pageHint, editViewId, sidebarExpended }) => ({
    pageTitle,
    editViewId,
    sidebarExpended,
    pageHint,
  })),
  withDashboardActions,
  withDialogActions,
)(DashboardTopbar);
