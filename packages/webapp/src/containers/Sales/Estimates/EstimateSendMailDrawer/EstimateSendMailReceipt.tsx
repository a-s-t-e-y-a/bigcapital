import { x } from '@xstyled/emotion';
import { isEmpty } from 'lodash';
import { Group, Stack } from '@/components';
import {
  SendMailReceipt,
  SendMailReceiptProps,
} from '../SendMailViewDrawer/SendMailViewReceiptPreview';

export interface EstimateSendMailReceiptProps extends SendMailReceiptProps {
  // # Company name.
  companyLogoUri?: string;
  companyName: string;

  // # Estimate number.
  estimateNumberLabel?: string;
  estimateNumber: string;

  // # Discount
  discount?: string;
  discountLabel?: string;

  // # Adjustment
  adjustment?: string;
  adjsutmentLabel?: string;

  // # Total.
  total: string;
  totalLabel?: string;

  // # Expiration date.
  expirationDateLabel?: string;
  expirationDate: string;

  // # Message.
  message: string;

  // # Estimate items.
  items?: Array<{ label: string; total: string; quantity: string | number }>;

  // # Subtotal
  subtotalLabel?: string;
  subtotal: string;

  // # View estimate button
  showViewEstimateButton?: boolean;
  viewEstimateButtonLabel?: string;
  viewEstimateButtonOnClick?: () => void;
}

export function EstimateSendMailReceipt({
  // # Company name.
  companyLogoUri,
  companyName,

  // # Estimate number.
  estimateNumberLabel = 'Estimate #',
  estimateNumber,

  // # Expiration date.
  expirationDateLabel = 'Expiration Date',
  expirationDate,

  // # Message
  message,

  // # Items
  items,

  // # Subtotal
  subtotal,
  subtotalLabel = 'Subtotal',

  // # Discount
  discount,
  discountLabel = 'Discount',

  // # Adjustment
  adjustment,
  adjsutmentLabel = 'Adjustment',

  // # Total.
  total,
  totalLabel = 'Total',

  // # View estimate button
  showViewEstimateButton = true,
  viewEstimateButtonLabel = 'View Estimate',
  viewEstimateButtonOnClick,

  ...props
}: EstimateSendMailReceiptProps) {
  return (
    <SendMailReceipt {...props}>
      <Stack spacing={16} textAlign={'center'}>
        {companyLogoUri && <SendMailReceipt.CompanyLogo src={companyLogoUri} />}

        <Stack spacing={8}>
          <x.h1 m={0} fontSize={'18px'} fontWeight={500} color="#404854">
            {companyName}
          </x.h1>

          <x.h3 color="#383E47" fontWeight={500}>
            {total}
          </x.h3>

          <x.span fontSize={'13px'} color="#404854">
            {estimateNumberLabel} {estimateNumber}
          </x.span>

          <x.span fontSize={'13px'} color="#404854">
            {expirationDateLabel} {expirationDate}
          </x.span>
        </Stack>
      </Stack>

      <x.p m={0} whiteSpace={'pre-line'} color="#252A31">
        {message}
      </x.p>

      {showViewEstimateButton && (
        <SendMailReceipt.PrimaryButton
          primaryColor={'#000'}
          onClick={viewEstimateButtonOnClick}
        >
          {viewEstimateButtonLabel}
        </SendMailReceipt.PrimaryButton>
      )}

      <Stack spacing={0}>
        {items?.map((item, key) => (
          <Group
            key={key}
            h={'40px'}
            position={'apart'}
            borderBottomStyle="solid"
            borderBottomWidth={'1px'}
            borderBottomColor={'#D9D9D9'}
            borderTopStyle="solid"
            borderTopColor={'#D9D9D9'}
            borderTopWidth={'1px'}
          >
            <x.span>{item.label}</x.span>
            <x.span>
              {item.quantity} x {item.total}
            </x.span>
          </Group>
        ))}

        <Group
          h={'40px'}
          position={'apart'}
          borderBottomStyle="solid"
          borderBottomWidth={'1px'}
          borderBottomColor={'#000'}
        >
          <x.span fontWeight={500}>{subtotalLabel}</x.span>
          <x.span fontWeight={600} fontSize={15}>
            {subtotal}
          </x.span>
        </Group>

        {!isEmpty(discount) && (
          <Group
            h={'40px'}
            position={'apart'}
            borderBottomStyle="solid"
            borderBottomWidth={'1px'}
            borderBottomColor={'#D9D9D9'}
          >
            <x.span>{discountLabel}</x.span>
            <x.span fontSize={15}>{discount}</x.span>
          </Group>
        )}

        {!isEmpty(adjustment) && (
          <Group
            h={'40px'}
            position={'apart'}
            borderBottomStyle="solid"
            borderBottomWidth={'1px'}
            borderBottomColor={'#D9D9D9'}
          >
            <x.span>{adjsutmentLabel}</x.span>
            <x.span fontSize={15}>{adjustment}</x.span>
          </Group>
        )}

        <Group
          h={'40px'}
          position={'apart'}
          borderBottomStyle="solid"
          borderBottomWidth={'1px'}
          borderColor={'#000'}
        >
          <x.span fontWeight={500}>{totalLabel}</x.span>
          <x.span fontWeight={600} fontSize={15}>
            {total}
          </x.span>
        </Group>
      </Stack>
    </SendMailReceipt>
  );
}
