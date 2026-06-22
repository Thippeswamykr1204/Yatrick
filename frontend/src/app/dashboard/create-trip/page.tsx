import type { Metadata } from 'next';
import { CreateTripWizard } from '@/components/trip/CreateTripWizard';

export const metadata: Metadata = { title: 'Plan a Trip' };

export default function CreateTripPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <CreateTripWizard />
    </div>
  );
}