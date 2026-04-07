'use client';

import { useState, useTransition, type ChangeEvent, type FormEvent } from 'react';
import {
      ADULT_AGE_RANGES,
      APPOINTMENT_PREFERENCE_OPTIONS,
      CONTACT_INSURANCE_OTHER_VALUE,
      CONTACT_METHOD_OPTIONS,
      MINOR_AGE_RANGES,
} from '@/lib/contactForm';

type TherapistOption = {
      slug: string;
      name: string;
};

type ContactFormState = {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      city: string;
      state: string;
      zip: string;
      isMinor: boolean;
      ageRange: string;
      insurance: string;
      insuranceOther: string;
      therapistRequested: string;
      preferredContactMethod: string;
      appointmentPreference: string;
      preferredDays: string;
      message: string;
      company: string;
};

interface ContactFormProps {
      initialTherapistQuery?: string;
      insuranceOptions: string[];
      therapistOptions: TherapistOption[];
}

function createInitialState(therapistRequested = ''): ContactFormState {
      return {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            city: '',
            state: 'MI',
            zip: '',
            isMinor: false,
            ageRange: ADULT_AGE_RANGES[0],
            insurance: '',
            insuranceOther: '',
            therapistRequested,
            preferredContactMethod: 'Either',
            appointmentPreference: 'No preference',
            preferredDays: '',
            message: '',
            company: '',
      };
}

function resolveTherapistFromQuery(rawValue: string | null, therapistOptions: TherapistOption[]): string {
      if (!rawValue) {
            return '';
      }

      const normalizedValue = rawValue.trim().toLowerCase();
      if (!normalizedValue) {
            return '';
      }

      const matchedTherapist = therapistOptions.find((option) => {
            return option.slug.toLowerCase() === normalizedValue || option.name.toLowerCase() === normalizedValue;
      });

      return matchedTherapist?.name ?? '';
}

const inputClassName =
      'mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-200';
const labelClassName = 'block text-sm font-semibold text-slate-900';

export default function ContactForm({ initialTherapistQuery = '', insuranceOptions, therapistOptions }: ContactFormProps) {
      const therapistFromQuery = resolveTherapistFromQuery(initialTherapistQuery, therapistOptions);
      const [formData, setFormData] = useState<ContactFormState>(() => createInitialState(therapistFromQuery));
      const [successMessage, setSuccessMessage] = useState('');
      const [errorMessage, setErrorMessage] = useState('');
      const [isPending, startTransition] = useTransition();

      const ageRangeOptions = formData.isMinor ? MINOR_AGE_RANGES : ADULT_AGE_RANGES;
      const showInsuranceOtherField = formData.insurance === CONTACT_INSURANCE_OTHER_VALUE;

      function handleFieldChange(
            event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      ) {
            const { name, value } = event.target;

            setFormData((current) => {
                  if (name === 'state') {
                        return {
                              ...current,
                              state: value.toUpperCase(),
                        };
                  }

                  return {
                        ...current,
                        [name]: value,
                  };
            });
      }

      function handleMinorToggle(event: ChangeEvent<HTMLInputElement>) {
            const isMinor = event.target.checked;
            const nextAgeRange = isMinor ? MINOR_AGE_RANGES[0] : ADULT_AGE_RANGES[0];

            setFormData((current) => ({
                  ...current,
                  isMinor,
                  ageRange: nextAgeRange,
            }));
      }

      function handleSubmit(event: FormEvent<HTMLFormElement>) {
            event.preventDefault();
            setSuccessMessage('');
            setErrorMessage('');

            startTransition(async () => {
                  try {
                        const response = await fetch('/api/contact', {
                              method: 'POST',
                              headers: {
                                    'Content-Type': 'application/json',
                              },
                              body: JSON.stringify(formData),
                        });

                        const payload = (await response.json().catch(() => null)) as { error?: string } | null;

                        if (!response.ok) {
                              throw new Error(payload?.error || 'We could not send your message right now.');
                        }

                        setFormData(createInitialState(therapistFromQuery));
                        setSuccessMessage('Thanks. Your message was sent to the practice, and someone should follow up within 1 to 2 business days.');
                  } catch (error) {
                        const message =
                              error instanceof Error
                                    ? error.message
                                    : 'We could not send your message right now. Please call or email the office directly.';
                        setErrorMessage(message);
                  }
            });
      }

      return (
            <section className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
                  <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                              Contact form
                        </p>
                        <h2 className="mt-3 text-3xl text-slate-900">Send a message to the practice</h2>
                        <p className="mt-4 text-base leading-relaxed text-slate-700">
                              Share the basics here and the office can follow up about availability, insurance, and therapist fit.
                        </p>
                  </div>

                  <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="grid gap-6 md:grid-cols-2">
                              <label className={labelClassName}>
                                    First name
                                    <input
                                          required
                                          autoComplete="given-name"
                                          className={inputClassName}
                                          name="firstName"
                                          onChange={handleFieldChange}
                                          value={formData.firstName}
                                    />
                              </label>

                              <label className={labelClassName}>
                                    Last name
                                    <input
                                          required
                                          autoComplete="family-name"
                                          className={inputClassName}
                                          name="lastName"
                                          onChange={handleFieldChange}
                                          value={formData.lastName}
                                    />
                              </label>

                              <label className={labelClassName}>
                                    Phone number
                                    <input
                                          required
                                          autoComplete="tel"
                                          className={inputClassName}
                                          name="phone"
                                          onChange={handleFieldChange}
                                          value={formData.phone}
                                    />
                              </label>

                              <label className={labelClassName}>
                                    Email address
                                    <input
                                          required
                                          autoComplete="email"
                                          className={inputClassName}
                                          name="email"
                                          onChange={handleFieldChange}
                                          type="email"
                                          value={formData.email}
                                    />
                              </label>
                        </div>

                        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
                              <label className={labelClassName}>
                                    City
                                    <input
                                          required
                                          autoComplete="address-level2"
                                          className={inputClassName}
                                          name="city"
                                          onChange={handleFieldChange}
                                          value={formData.city}
                                    />
                              </label>

                              <label className={labelClassName}>
                                    State
                                    <input
                                          required
                                          autoComplete="address-level1"
                                          className={inputClassName}
                                          maxLength={40}
                                          name="state"
                                          onChange={handleFieldChange}
                                          value={formData.state}
                                    />
                              </label>

                              <label className={labelClassName}>
                                    ZIP code
                                    <input
                                          required
                                          autoComplete="postal-code"
                                          className={inputClassName}
                                          inputMode="numeric"
                                          name="zip"
                                          onChange={handleFieldChange}
                                          value={formData.zip}
                                    />
                              </label>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                              <div className="rounded-3xl border border-teal-100 bg-teal-50 p-5">
                                    <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-800">
                                          <input
                                                checked={formData.isMinor}
                                                className="mt-1 h-4 w-4 rounded border-stone-300 text-teal-700 focus:ring-teal-500"
                                                name="isMinor"
                                                onChange={handleMinorToggle}
                                                type="checkbox"
                                          />
                                          <span>
                                                <span className="block font-semibold text-slate-900">This inquiry is for a minor</span>
                                                Use this if the client seeking care is under 18.
                                          </span>
                                    </label>
                              </div>

                              <label className={labelClassName}>
                                    Age range
                                    <select
                                          className={inputClassName}
                                          name="ageRange"
                                          onChange={handleFieldChange}
                                          value={formData.ageRange}
                                    >
                                          {ageRangeOptions.map((option) => (
                                                <option key={option} value={option}>
                                                      {option}
                                                </option>
                                          ))}
                                    </select>
                              </label>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                              <label className={labelClassName}>
                                    Insurance
                                    <select
                                          required
                                          className={inputClassName}
                                          name="insurance"
                                          onChange={handleFieldChange}
                                          value={formData.insurance}
                                    >
                                          <option value="">Select insurance</option>
                                          {insuranceOptions.map((provider) => (
                                                <option key={provider} value={provider}>
                                                      {provider}
                                                </option>
                                          ))}
                                          <option value={CONTACT_INSURANCE_OTHER_VALUE}>{CONTACT_INSURANCE_OTHER_VALUE}</option>
                                    </select>
                              </label>

                              {therapistOptions.length > 0 ? (
                                    <label className={labelClassName}>
                                          Requested therapist
                                          <select
                                                className={inputClassName}
                                                name="therapistRequested"
                                                onChange={handleFieldChange}
                                                value={formData.therapistRequested}
                                          >
                                                <option value="">No preference</option>
                                                {therapistOptions.map((option) => (
                                                      <option key={option.slug} value={option.name}>
                                                            {option.name}
                                                      </option>
                                                ))}
                                          </select>
                                    </label>
                              ) : (
                                    <label className={labelClassName}>
                                          Requested therapist
                                          <input
                                                className={inputClassName}
                                                name="therapistRequested"
                                                onChange={handleFieldChange}
                                                placeholder="Optional"
                                                value={formData.therapistRequested}
                                          />
                                    </label>
                              )}
                        </div>

                        {showInsuranceOtherField && (
                              <label className={labelClassName}>
                                    Insurance plan name
                                    <input
                                          required
                                          className={inputClassName}
                                          name="insuranceOther"
                                          onChange={handleFieldChange}
                                          placeholder="Enter your insurance plan"
                                          value={formData.insuranceOther}
                                    />
                              </label>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                              <label className={labelClassName}>
                                    Preferred contact method
                                    <select
                                          className={inputClassName}
                                          name="preferredContactMethod"
                                          onChange={handleFieldChange}
                                          value={formData.preferredContactMethod}
                                    >
                                          {CONTACT_METHOD_OPTIONS.map((option) => (
                                                <option key={option} value={option}>
                                                      {option}
                                                </option>
                                          ))}
                                    </select>
                              </label>

                              <label className={labelClassName}>
                                    Appointment preference
                                    <select
                                          className={inputClassName}
                                          name="appointmentPreference"
                                          onChange={handleFieldChange}
                                          value={formData.appointmentPreference}
                                    >
                                          {APPOINTMENT_PREFERENCE_OPTIONS.map((option) => (
                                                <option key={option} value={option}>
                                                      {option}
                                                </option>
                                          ))}
                                    </select>
                              </label>
                        </div>

                        <label className={labelClassName}>
                              Preferred days or times
                              <input
                                    className={inputClassName}
                                    name="preferredDays"
                                    onChange={handleFieldChange}
                                    placeholder="Optional"
                                    value={formData.preferredDays}
                              />
                        </label>

                        <label className={labelClassName}>
                              What would you like help with?
                              <textarea
                                    required
                                    className={`${inputClassName} min-h-40 resize-y`}
                                    name="message"
                                    onChange={handleFieldChange}
                                    placeholder="Share what brings you in, any scheduling constraints, and anything else that would help the office guide next steps."
                                    value={formData.message}
                              />
                        </label>

                        <div className="hidden" aria-hidden="true">
                              <label>
                                    Company
                                    <input name="company" onChange={handleFieldChange} tabIndex={-1} value={formData.company} />
                              </label>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              <button
                                    className="inline-flex items-center justify-center rounded-full bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-teal-300"
                                    disabled={isPending}
                                    type="submit"
                              >
                                    {isPending ? 'Sending...' : 'Send message'}
                              </button>
                              <p className="text-sm leading-relaxed text-slate-600">
                                    Do not use this form for emergencies. Call <strong>911</strong> or dial/text <strong>988</strong> if you need immediate help.
                              </p>
                        </div>

                        <div aria-live="polite" className="space-y-3">
                              {successMessage ? (
                                    <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                                          {successMessage}
                                    </p>
                              ) : null}

                              {errorMessage ? (
                                    <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                                          {errorMessage}
                                    </p>
                              ) : null}
                        </div>
                  </form>
            </section>
      );
}
