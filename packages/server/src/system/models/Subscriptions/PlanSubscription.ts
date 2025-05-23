import { Model, mixin } from 'objection';
import SystemModel from '@/system/models/SystemModel';
import moment from 'moment';
import SubscriptionPeriod from '@/services/Subscription/SubscriptionPeriod';
import { SubscriptionPaymentStatus } from '@/interfaces';

export default class PlanSubscription extends mixin(SystemModel) {
  public lemonSubscriptionId: number;

  public endsAt: Date;
  public startsAt: Date;

  public canceledAt: Date;

  public trialEndsAt: Date;

  public paymentStatus: SubscriptionPaymentStatus;

  /**
   * Table name.
   */
  static get tableName() {
    return 'subscription_plan_subscriptions';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Defined virtual attributes.
   */
  static get virtualAttributes() {
    return [
      'active',
      'inactive',
      'ended',
      'canceled',
      'onTrial',
      'status',
      'isPaymentFailed',
      'isPaymentSucceed',
    ];
  }

  /**
   * Modifiers queries.
   */
  static get modifiers() {
    return {
      activeSubscriptions(builder) {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        const now = moment().format(dateFormat);

        builder.where('ends_at', '>', now);
        builder.where('trial_ends_at', '>', now);
      },

      inactiveSubscriptions(builder) {
        builder.modify('endedTrial');
        builder.modify('endedPeriod');
      },

      subscriptionBySlug(builder, subscriptionSlug) {
        builder.where('slug', subscriptionSlug);
      },

      endedTrial(builder) {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        const endDate = moment().format(dateFormat);

        builder.where('ends_at', '<=', endDate);
      },

      endedPeriod(builder) {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        const endDate = moment().format(dateFormat);

        builder.where('trial_ends_at', '<=', endDate);
      },

      /**
       * Filter the failed payment.
       * @param builder
       */
      failedPayment(builder) {
        builder.where('payment_status', SubscriptionPaymentStatus.Failed);
      },

      /**
       * Filter the succeed payment.
       * @param builder
       */
      succeedPayment(builder) {
        builder.where('payment_status', SubscriptionPaymentStatus.Succeed);
      },
    };
  }

  /**
   * Relations mappings.
   */
  static get relationMappings() {
    const Tenant = require('system/models/Tenant');
    const Plan = require('system/models/Subscriptions/Plan');

    return {
      /**
       * Plan subscription belongs to tenant.
       */
      tenant: {
        relation: Model.BelongsToOneRelation,
        modelClass: Tenant.default,
        join: {
          from: 'subscription_plan_subscriptions.tenantId',
          to: 'tenants.id',
        },
      },

      /**
       * Plan description belongs to plan.
       */
      plan: {
        relation: Model.BelongsToOneRelation,
        modelClass: Plan.default,
        join: {
          from: 'subscription_plan_subscriptions.planId',
          to: 'subscription_plans.id',
        },
      },
    };
  }

  /**
   * Check if the subscription is active.
   * Criteria for active:
   *  - During trial period: NOT canceled
   *  - Out of trial period: Must have lemonSubscriptionId and NOT ended
   * @return {Boolean}
   */
  public active() {
    // If on trial, active if not canceled
    if (this.onTrial()) {
      return !this.canceled();
    }
    
    // If trial has ended, must have a valid lemonSubscriptionId (paid subscription)
    // and subscription period must not have ended
    return !!this.lemonSubscriptionId && !this.ended();
  }

  /**
   * Check if the subscription is inactive.
   * @return {Boolean}
   */
  public inactive() {
    return !this.active();
  }

  /**
   * Check if paid subscription period has ended.
   * @return {Boolean}
   */
  public ended() {
    return this.endsAt ? moment().isAfter(this.endsAt) : false;
  }

  /**
   * Check if the paid subscription has started.
   * @returns {Boolean}
   */
  public started() {
    return this.startsAt ? moment().isAfter(this.startsAt) : false;
  }

  /**
   * Check if subscription is currently on trial.
   * @return {Boolean}
   */
  public onTrial() {
    if (!this.trialEndsAt || moment().isAfter(this.trialEndsAt)) {
      return false;
    }
    return true;
  }

  /**
   * Check if the subscription is canceled.
   * @returns {boolean}
   */
  public canceled() {
    return !!this.canceledAt;
  }

  /**
   * Retrieves the subscription status.
   * @returns {string}
   */
  public status() {
    return this.canceled()
      ? 'canceled'
      : this.onTrial()
      ? 'on_trial'
      : this.active()
      ? 'active'
      : 'inactive';
  }

  /**
   * Set new period from the given details.
   * @param {string} invoiceInterval
   * @param {number} invoicePeriod
   * @param {string} start
   *
   * @return {Object}
   */
  static setNewPeriod(invoiceInterval, invoicePeriod, start) {
    const period = new SubscriptionPeriod(
      invoiceInterval,
      invoicePeriod,
      start
    );

    const startsAt = period.getStartDate();
    const endsAt = period.getEndDate();

    return { startsAt, endsAt };
  }

  /**
   * Renews subscription period.
   * @Promise
   */
  renew(invoiceInterval, invoicePeriod) {
    const { startsAt, endsAt } = PlanSubscription.setNewPeriod(
      invoiceInterval,
      invoicePeriod
    );
    return this.$query().update({ startsAt, endsAt });
  }

  /**
   * Detarmines the subscription payment whether is failed.
   * @returns {boolean}
   */
  public isPaymentFailed() {
    return this.paymentStatus === SubscriptionPaymentStatus.Failed;
  }

  /**
   * Detarmines the subscription payment whether is succeed.
   * @returns {boolean}
   */
  public isPaymentSucceed() {
    return this.paymentStatus === SubscriptionPaymentStatus.Succeed;
  }
}
