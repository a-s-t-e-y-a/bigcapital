// @ts-nocheck
import * as R from 'ramda';
import clsx from 'classnames';
import { includes } from 'lodash';
import { Box, Group, Stack } from '@/components';
import { Button, Card, Classes, Intent, Text } from '@blueprintjs/core';
import withAlertActions from '../Alert/withAlertActions';
import styles from './BillingSubscription.module.scss';
import withDrawerActions from '../Drawer/withDrawerActions';
import { DRAWERS } from '@/constants/drawers';
import { useBillingPageBoot } from './BillingPageBoot';
import { getSubscriptionStatusText } from './_utils';
import { create } from 'zustand';

// Create Zustand store
interface ChangeSubscriptionPlanStore {
  isFirstPlan: boolean;
  setIsFirstPlan: (value: boolean) => void;
}

export const useChangeSubscriptionPlanStore = create<ChangeSubscriptionPlanStore>((set) => ({
  isFirstPlan: false,
  setIsFirstPlan: (value) => set({ isFirstPlan: value }),
}));

function SubscriptionRoot({ openAlert, openDrawer }) {
  const { mainSubscription } = useBillingPageBoot();
  const { isFirstPlan, setIsFirstPlan } = useChangeSubscriptionPlanStore();

  console.log('[DEBUG] BillingSubscription - mainSubscription:', mainSubscription);
  if (mainSubscription) {
    console.log('[DEBUG] lemonSubscriptionId value:', mainSubscription.lemonSubscriptionId);
    console.log('[DEBUG] lemonSubscriptionId type:', typeof mainSubscription.lemonSubscriptionId);
    console.log('[DEBUG] lemonSubscriptionId === true?', mainSubscription.lemonSubscriptionId === true);
    console.log('[DEBUG] lemonSubscriptionId !== true?', mainSubscription.lemonSubscriptionId !== true);
  }

  const handleUpgradeBtnClick = () => {
    openDrawer(DRAWERS.CHANGE_SUBSCARIPTION_PLAN);
  };
  
  const handleFirstTimePlanPurchase = () => {
    setIsFirstPlan(true);
    openDrawer(DRAWERS.CHANGE_SUBSCARIPTION_PLAN);
  };

  // If no subscription, show only upgrade button
  if (!mainSubscription) {
    console.log('[DEBUG] No mainSubscription found, showing trial view');
    return (
      <Card className={styles.root}>
        <Stack spacing={6}>
          <h1 className={styles.title}>Trial is active</h1>
          <Text className={styles.description}>
            Control your business bookkeeping with automated accounting, to run
            intelligent reports for faster decision-making.
          </Text>
          <Stack align="flex-start" spacing={8} className={styles.actions}>
            <Button
              minimal
              small
              inline
              intent={Intent.PRIMARY}
              onClick={handleFirstTimePlanPurchase}
            >
              Selects the Plan
            </Button>
            {/* <SubscriptionStatusText subscription={mainSubscription} /> */}
          </Stack>
        </Stack>
      </Card>
    );
  }

  const handleCancelSubBtnClick = () => {
    openAlert('cancel-main-subscription');
  };
  const handleResumeSubBtnClick = () => {
    openAlert('resume-main-subscription');
  };
  const handleUpdatePaymentMethod = () => {
    window.LemonSqueezy.Url.Open(
      mainSubscription.lemonUrls?.updatePaymentMethod,
    );
  };

  return (
    <Card className={styles.root}>
      <Stack spacing={6}>
        <h1 className={styles.title}>{mainSubscription.planName}</h1>

        <Group
          spacing={0}
          className={clsx(styles.period, {
            [Classes.INTENT_DANGER]: includes(
              ['on_trial', 'inactive'],
              mainSubscription.status,
            ),
            [Classes.INTENT_SUCCESS]: includes(
              ['active', 'canceled'],
              mainSubscription.status,
            ),
          })}
        >
          <Text className={styles.periodStatus}>
            {mainSubscription.statusFormatted}
          </Text>

          <SubscriptionStatusText subscription={mainSubscription} />
        </Group>
      </Stack>

      <Text className={styles.description}>
        Control your business bookkeeping with automated accounting, to run
        intelligent reports for faster decision-making.
      </Text>

      <Stack align="flex-start" spacing={8} className={styles.actions}>
        {mainSubscription.lemonSubscriptionId !== true ? (
          <Button
            minimal
            small
            inline
            intent={Intent.PRIMARY}
            onClick={handleFirstTimePlanPurchase}
          >
            Purchase the Plan
          </Button>
        ) : (
          <>
            <Button
              minimal
              small
              inline
              intent={Intent.PRIMARY}
              onClick={handleUpgradeBtnClick}
            >
              Upgrade the Plan
            </Button>
            {mainSubscription.canceled && (
              <Button minimal small inline intent={Intent.PRIMARY} onClick={handleResumeSubBtnClick}>
                Resume Subscription
              </Button>
            )}
            {!mainSubscription.canceled && (
              <Button minimal small inline intent={Intent.PRIMARY} onClick={handleCancelSubBtnClick}>
                Cancel Subscription
              </Button>
            )}
            <Button minimal small inline intent={Intent.PRIMARY} onClick={handleUpdatePaymentMethod}>
              Change Payment Method
            </Button>
          </>
        )}
      </Stack>

      <Group position={'apart'} style={{ marginTop: 'auto' }}>
        <Group spacing={4}>
          <Text className={styles.priceAmount}>
            {mainSubscription.planPriceFormatted}
          </Text>

          {mainSubscription.planPeriod && (
            <Text className={styles.pricePeriod}>
              {mainSubscription.planPeriod === 'month'
                ? 'mo'
                : mainSubscription.planPeriod === 'year'
                ? 'yearly'
                : ''}
            </Text>
          )}
        </Group>

        <Box>
          {mainSubscription.canceled && (
            <Button
              intent={Intent.PRIMARY}
              onClick={handleResumeSubBtnClick}
              className={styles.subscribeButton}
            >
              Resume Subscription
            </Button>
          )}
        </Box>
      </Group>
    </Card>
  );
}

export const Subscription = R.compose(
  withAlertActions,
  withDrawerActions,
)(SubscriptionRoot);

function SubscriptionStatusText({ subscription }) {
  const text = getSubscriptionStatusText(subscription);

  if (!text) return <>    -----Buy the plan to get started</>;

  return <Text className={styles.periodText}>{text}</Text>;
}
