'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Check } from 'lucide-react';
import { StepDestination } from './steps/StepDestination';
import { StepBudget } from './steps/StepBudget';
import { StepInterests } from './steps/StepInterests';
import { StepReview } from './steps/StepReview';
import { GeneratingScreen } from './GeneratingScreen';
import { Button } from '@/components/common/Button';
import { tripsService } from '@/services/trips.service';
import { useToast } from '@/store/uiStore';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/cn';

// ── Step definitions ───────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Destination', description: 'Where & when' },
  { id: 2, label: 'Budget',      description: 'Travel style' },
  { id: 3, label: 'Interests',   description: 'What you love' },
  { id: 4, label: 'Review',      description: 'Confirm & generate' },
];

// ── Form state ─────────────────────────────────────────────────
interface FormState {
  destination: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  budgetTier: string;
  interests: string[];
}

type FieldErrors = Partial<Record<keyof FormState | string, string>>;

const INITIAL: FormState = {
  destination: '',
  durationDays: 7,
  startDate: '',
  endDate: '',
  budgetTier: '',
  interests: [],
};

// ── Step indicator ─────────────────────────────────────────────
function StepIndicator({
  steps,
  current,
}: {
  steps: typeof STEPS;
  current: number;
}) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {steps.map((step, i) => {
        const done = current > step.id;
        const active = current === step.id;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            {/* Circle */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  backgroundColor: done
                    ? '#f97316'
                    : active
                    ? '#f97316'
                    : '#e2e8f0',
                  scale: active ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="w-8 h-8 rounded-full flex items-center justify-center
                           border-2 border-white shadow-sm"
               style={{
  boxShadow: active
    ? '0 0 0 4px rgba(249,115,22,.15)'
    : undefined,
}}
              >
                {done ? (
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                ) : (
                  <span
                    className={cn(
                      'text-xs font-bold',
                      active ? 'text-white' : 'text-slate-400'
                    )}
                  >
                    {step.id}
                  </span>
                )}
              </motion.div>

              {/* Label - hidden on mobile */}
              <div className="hidden sm:block text-center mt-2">
                <p
                  className={cn(
                    'text-xs font-semibold',
                    active ? 'text-orange-500' : done ? 'text-slate-600' : 'text-slate-400'
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-slate-400">{step.description}</p>
              </div>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="flex-1 mx-2 -mt-6 sm:-mt-0">
                <motion.div
                  animate={{
                    backgroundColor: done ? '#f97316' : '#e2e8f0',
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-0.5 w-full rounded-full"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main wizard ────────────────────────────────────────────────
export function CreateTripWizard() {
  const router = useRouter();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Generic field setter
  const setField = (key: string, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // ── Validation per step ──────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: FieldErrors = {};

    if (step === 1) {
      if (!form.destination.trim()) {
        newErrors.destination = 'Destination is required';
      }
      if (!form.durationDays || form.durationDays < 1) {
        newErrors.durationDays = 'Duration must be at least 1 day';
      }
      if (form.durationDays > 365) {
        newErrors.durationDays = 'Duration cannot exceed 365 days';
      }
    }

    if (step === 2) {
      if (!form.budgetTier) {
        newErrors.budgetTier = 'Please select a budget tier';
      }
    }

    if (step === 3) {
      // Interests are optional — skip validation
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Navigation ───────────────────────────────────────────────
  const next = () => {
    if (!validate()) return;
    if (step < STEPS.length) setStep((s) => s + 1);
  };

  const back = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  // ── Submit — create trip then generate itinerary ─────────────
  const handleSubmit = async () => {
    setIsGenerating(true);
    try {
      // 1. Create the trip record
      const trip = await tripsService.create({
        destination: form.destination,
        durationDays: form.durationDays,
        budgetTier: form.budgetTier as 'Low' | 'Medium' | 'High',
        interests: form.interests,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      });

      // 2. Generate AI itinerary
      await tripsService.generateItinerary(trip._id);

      toast.success(
        'Trip created!',
        `Your ${form.durationDays}-day itinerary for ${form.destination} is ready.`
      );

      // 3. Redirect to trip detail
      router.push(ROUTES.TRIP(trip._id));
    } catch (error) {
      toast.error(
        'Generation failed',
        'Could not generate itinerary. Please try again.'
      );
      setIsGenerating(false);
    }
  };

  // ── Render active step ───────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepDestination
            values={{
              destination: form.destination,
              durationDays: form.durationDays,
              startDate: form.startDate,
              endDate: form.endDate,
            }}
            errors={errors}
            onChange={setField}
          />
        );
      case 2:
        return (
          <StepBudget
            value={form.budgetTier}
            error={errors.budgetTier}
            onChange={(v) => setField('budgetTier', v)}
          />
        );
      case 3:
        return (
          <StepInterests
            values={form.interests}
            error={errors.interests}
            onChange={(v) => setField('interests', v)}
          />
        );
      case 4:
        return <StepReview values={form} />;
      default:
        return null;
    }
  };

  // ── Show generating screen ───────────────────────────────────
  if (isGenerating) {
    return <GeneratingScreen destination={form.destination} />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <span className="text-xs font-medium text-orange-500 uppercase tracking-wider">
            AI Trip Planner
          </span>
        </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Create Your Next Adventure
          </h1>
          <p className="text-slate-500 max-w-xl">
            Tell us where you're going and <span className="font-semibold text-orange-500">YATRIK</span> will craft a personalized itinerary in seconds.
          </p>
      </motion.div>

      {/* Card */}
      <div className="
bg-white
rounded-3xl
border border-slate-200
shadow-xl
shadow-slate-200/60
p-5 sm:p-8 lg:p-10
">
        {/* Step indicator */}
        <StepIndicator steps={STEPS} current={step} />

        {/* Step label (mobile) */}
        <div className="sm:hidden mb-6">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
            Step {step} of {STEPS.length}
          </p>
          <h2 className="text-lg font-bold text-slate-900">
            {STEPS[step - 1].label}
          </h2>
        </div>

        {/* Step content */}
        <div className="min-h-[340px] sm:min-h-[320px]">
          <AnimatePresence mode="wait">
            <div key={step}>{renderStep()}</div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6
                        border-t border-slate-100">
          {/* Back */}
          <Button
            variant="ghost"
            size="md"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={step === 1 ? () => router.push(ROUTES.DASHBOARD) : back}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>

          {/* Step counter */}
          <div className="flex gap-1">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  step === s.id
                    ? 'w-6 bg-orange-500'
                    : step > s.id
                    ? 'w-3 bg-orange-200'
                    : 'w-3 bg-slate-200'
                )}
              />
            ))}
          </div>

          {/* Next / Generate */}
          {step < STEPS.length ? (
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={next}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              icon={<Sparkles className="w-4 h-4" />}
              iconPosition="right"
              onClick={handleSubmit}
            >
              Generate trip
            </Button>
          )}
        </div>
      </div>

      {/* Help text */}
      <p className="text-center text-xs text-slate-400 mt-4">
        Generation takes 10–20 seconds using Gemini AI.
        Your trip is saved automatically.
      </p>
    </div>
  );
}