import { z } from 'zod';

export const MINOR_AGE_RANGES = ['0-5', '6-10', '11-13', '14-17'] as const;
export const ADULT_AGE_RANGES = ['18-21', '22-40', '41-65', '65+'] as const;
export const CONTACT_AGE_RANGES = [...MINOR_AGE_RANGES, ...ADULT_AGE_RANGES] as const;
export const CONTACT_METHOD_OPTIONS = ['Phone', 'Email', 'Either'] as const;
export const APPOINTMENT_PREFERENCE_OPTIONS = ['In-person', 'Telehealth', 'No preference'] as const;
export const CONTACT_INSURANCE_OTHER_VALUE = 'Other / not listed';

const phonePattern = /^[0-9+().\-\s]{7,25}$/;
const zipPattern = /^\d{5}(?:-\d{4})?$/;

export const contactFormSchema = z
      .object({
            firstName: z.string().trim().min(1, 'First name is required.').max(80, 'First name is too long.'),
            lastName: z.string().trim().min(1, 'Last name is required.').max(80, 'Last name is too long.'),
            phone: z
                  .string()
                  .trim()
                  .min(1, 'Phone number is required.')
                  .max(25, 'Phone number is too long.')
                  .regex(phonePattern, 'Enter a valid phone number.'),
            email: z.string().trim().email('Enter a valid email address.').max(254, 'Email address is too long.'),
            city: z.string().trim().min(1, 'City is required.').max(80, 'City is too long.'),
            state: z.string().trim().min(2, 'State is required.').max(40, 'State is too long.'),
            zip: z
                  .string()
                  .trim()
                  .regex(zipPattern, 'Enter a valid ZIP code.'),
            isMinor: z.boolean(),
            ageRange: z.enum(CONTACT_AGE_RANGES, {
                  error: 'Select an age range.',
            }),
            insurance: z.string().trim().min(1, 'Select an insurance option.').max(120, 'Insurance value is too long.'),
            insuranceOther: z.string().trim().max(120, 'Insurance value is too long.').optional().default(''),
            therapistRequested: z.string().trim().max(120, 'Therapist name is too long.').optional().default(''),
            preferredContactMethod: z.enum(CONTACT_METHOD_OPTIONS, {
                  error: 'Select a preferred contact method.',
            }),
            appointmentPreference: z.enum(APPOINTMENT_PREFERENCE_OPTIONS, {
                  error: 'Select an appointment preference.',
            }),
            preferredDays: z.string().trim().max(240, 'Preferred days/times are too long.').optional().default(''),
            message: z
                  .string()
                  .trim()
                  .min(20, 'Please share a bit more about what you are looking for.')
                  .max(4000, 'Message is too long.'),
            company: z.string().max(200, 'Invalid submission.').optional().default(''),
      })
      .superRefine((value, ctx) => {
            const validAgeRanges: readonly string[] = value.isMinor ? MINOR_AGE_RANGES : ADULT_AGE_RANGES;

            if (!validAgeRanges.includes(value.ageRange)) {
                  ctx.addIssue({
                        code: 'custom',
                        path: ['ageRange'],
                        message: value.isMinor ? 'Select a minor age range.' : 'Select an adult age range.',
                  });
            }

            if (value.insurance === CONTACT_INSURANCE_OTHER_VALUE && !value.insuranceOther.trim()) {
                  ctx.addIssue({
                        code: 'custom',
                        path: ['insuranceOther'],
                        message: 'Please enter the insurance plan name.',
                  });
            }
      });

export type ContactFormInput = z.infer<typeof contactFormSchema>;
