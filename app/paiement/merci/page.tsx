import { PaymentUpload } from '@/components/payment-upload';

export default function PaymentThankYouPage({ searchParams }: { searchParams: { session_id?: string } }) {
  return <PaymentUpload sessionId={searchParams.session_id} />;
}
