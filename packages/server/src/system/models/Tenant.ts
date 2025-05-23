import moment from 'moment';
import { Model } from 'objection';
import uniqid from 'uniqid';
import SubscriptionPeriod from '@/services/Subscription/SubscriptionPeriod';
import BaseModel from 'models/Model';
import TenantMetadata from './TenantMetadata';
import PlanSubscription from './Subscriptions/PlanSubscription';

export default class Tenant extends BaseModel {
  upgradeJobId: string;
  buildJobId: string;
  initializedAt!: Date | null;
  seededAt!: Date | null;

  /**
   * Table name.
   */
  static get tableName() {
    return 'tenants';
  }

  /**
   * Timestamps columns.
   * @returns {string[]}
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Virtual attributes.
   * @returns {string[]}
   */
  static get virtualAttributes() {
    return ['isReady', 'isBuildRunning', 'isUpgradeRunning'];
  }

  /**
   * Tenant is ready.
   * @returns {boolean}
   */
  get isReady() {
    return !!(this.initializedAt && this.seededAt);
  }

  /**
   * Detarimes the tenant whether is build currently running.
   * @returns {boolean}
   */
  get isBuildRunning() {
    return !!this.buildJobId;
  }

  /**
   * Detarmines the tenant whether is upgrade currently running.
   * @returns {boolean}
   */
  get isUpgradeRunning() {
    return !!this.upgradeJobId;
  }

  /**
   * Query modifiers.
   */
  static modifiers() {
    return {
      subscriptions(builder) {
        builder.withGraphFetched('subscriptions');
      },
    };
  }

  /**
   * Relations mappings.
   */
  static get relationMappings() {
    const PlanSubscription = require('./Subscriptions/PlanSubscription');
    const TenantMetadata = require('./TenantMetadata');

    return {
      subscriptions: {
        relation: Model.HasManyRelation,
        modelClass: PlanSubscription.default,
        join: {
          from: 'tenants.id',
          to: 'subscription_plan_subscriptions.tenantId',
        },
      },
      metadata: {
        relation: Model.HasOneRelation,
        modelClass: TenantMetadata.default,
        join: {
          from: 'tenants.id',
          to: 'tenants_metadata.tenantId',
        },
      },
    };
  }

  /**
   * Creates a new tenant with random organization id.
   */
  static createWithUniqueOrgId(uniqId) {
    const organizationId = uniqid() || uniqId;
    return this.query().insert({ organizationId });
  }

  /**
   * Mark as seeded.
   * @param {number} tenantId
   */
  static markAsSeeded(tenantId) {
    const seededAt = moment().toMySqlDateTime();
    return this.query().update({ seededAt }).where({ id: tenantId });
  }

  /**
   * Mark the the given organization as initialized.
   * @param {string} organizationId
   */
  static markAsInitialized(tenantId) {
    const initializedAt = moment().toMySqlDateTime();
    return this.query().update({ initializedAt }).where({ id: tenantId });
  }

  /**
   * Marks the given tenant as built.
   */
  static markAsBuilt(tenantId) {
    const builtAt = moment().toMySqlDateTime();
    return this.query().update({ builtAt }).where({ id: tenantId });
  }

  /**
   * Marks the given tenant as built.
   */
  static markAsBuilding(tenantId, buildJobId) {
    return this.query().update({ buildJobId }).where({ id: tenantId });
  }

  /**
   * Marks the given tenant as built.
   */
  static markAsBuildCompleted(tenantId) {
    return this.query().update({ buildJobId: null }).where({ id: tenantId });
  }

  /**
   * Marks the given tenant as upgrading.
   * @param {number} tenantId
   * @param {string} upgradeJobId
   * @returns
   */
  static markAsUpgrading(tenantId, upgradeJobId) {
    return this.query().update({ upgradeJobId }).where({ id: tenantId });
  }

  /**
   * Markes the given tenant as upgraded.
   * @param {number} tenantId
   * @returns
   */
  static markAsUpgraded(tenantId) {
    return this.query().update({ upgradeJobId: null }).where({ id: tenantId });
  }

  /**
   * Saves the metadata of the given tenant.
   */
  static async saveMetadata(tenantId, metadata) {
    const foundMetadata = await TenantMetadata.query().findOne({ tenantId });
    const updateOrInsert = foundMetadata ? 'patch' : 'insert';

    return TenantMetadata.query()
      [updateOrInsert]({
        tenantId,
        ...metadata,
      })
      .where({ tenantId });
  }

  /**
   * Saves the metadata of the tenant.
   */
  saveMetadata(metadata) {
    return Tenant.saveMetadata(this.id, metadata);
  }

  /**
   *
   * @param {*} planId
   * @param {*} invoiceInterval
   * @param {*} invoicePeriod
   * @param {*} subscriptionSlug
   * @returns
   */
  public newSubscription(
    planId,
    invoiceInterval,
    invoicePeriod,
    subscriptionSlug,
    payload?,
  ) {
    console.log('[DEBUG] Instance newSubscription called with:');
    console.log('[DEBUG] - planId:', planId);
    console.log('[DEBUG] - invoiceInterval:', invoiceInterval);
    console.log('[DEBUG] - invoicePeriod:', invoicePeriod);
    console.log('[DEBUG] - subscriptionSlug:', subscriptionSlug);
    console.log('[DEBUG] - payload:', JSON.stringify(payload));
    
    return Tenant.newSubscription(
      this.id,
      planId,
      invoiceInterval,
      invoicePeriod,
      subscriptionSlug,
      payload
    );
  }

  /**
   * Records a new subscription for the associated tenant.
   */
  static async newSubscription(
    tenantId: number,
    planId: number,
    invoiceInterval: 'month' | 'year',
    invoicePeriod: number,
    subscriptionSlug: string,
    payload?: { lemonSqueezyId: string }
  ) {
    console.log('[DEBUG] Static newSubscription called with:');
    console.log('[DEBUG] - tenantId:', tenantId);
    console.log('[DEBUG] - planId:', planId);
    console.log('[DEBUG] - invoiceInterval:', invoiceInterval);
    console.log('[DEBUG] - invoicePeriod:', invoicePeriod);
    console.log('[DEBUG] - subscriptionSlug:', subscriptionSlug);
    console.log('[DEBUG] - payload:', JSON.stringify(payload));
    
    // Extract the lemonSqueezyId from the payload
    const lemonSqueezyId = payload?.lemonSqueezyId;
    console.log('[DEBUG] LemonSqueezyId to be used:', lemonSqueezyId);
    
    const period = new SubscriptionPeriod(invoiceInterval, invoicePeriod);
    console.log('[DEBUG] Start Date:', period.getStartDate());
    console.log('[DEBUG] End Date:', period.getEndDate());
    
    // Check if tenant already has any subscriptions (past or present)
    const existingSubscriptions = await PlanSubscription.query()
      .where('tenantId', tenantId);
    
    const hasExistingSubscriptions = existingSubscriptions.length > 0;
    console.log('[DEBUG] Tenant has existing subscriptions:', hasExistingSubscriptions);
    
    // Only apply trial period for first subscription
    let trialEndsAt = null;
    if (!hasExistingSubscriptions) {
      // This is the first subscription, so apply trial period
      trialEndsAt = moment(period.getStartDate()).add(14, 'days').toDate();
      console.log('[DEBUG] First subscription for tenant - applying trial period. Trial ends at:', trialEndsAt);
    } else {
      // This is not the first subscription, no trial period
      console.log('[DEBUG] Not the first subscription for tenant - no trial period applied.');
    }

    // Create the insertion data
    const insertData = {
      tenantId,
      slug: subscriptionSlug,
      planId,
      startsAt: period.getStartDate(),
      endsAt: period.getEndDate(),
      lemonSubscriptionId: lemonSqueezyId || null,
      trialEndsAt: trialEndsAt
    };
    
    console.log('[DEBUG] Insertion data for subscription:', JSON.stringify(insertData));
    
    return PlanSubscription.query().insert(insertData);
  }
}
