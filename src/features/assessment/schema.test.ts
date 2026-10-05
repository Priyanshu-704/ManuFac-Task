import { describe, expect, it } from 'vitest';
import { SAMPLE_PATIENT } from './fixtures';
import { assessmentSchema } from './schema';

describe('Geriatric Assessment Schema Validation', () => {
  // Test boundary rule: Patient must turn at least 60 years old on assessment date
  it('accepts patient who turns exactly 60 on the assessment date', () => {
    const validData = {
      ...SAMPLE_PATIENT,
      assessmentDate: '2026-08-07',
      dateOfBirth: '1966-08-07', // Exactly 60 years prior to assessment date
    };

    const result = assessmentSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects patient who is one day short of turning 60 on the assessment date', () => {
    const invalidData = {
      ...SAMPLE_PATIENT,
      assessmentDate: '2026-08-07',
      dateOfBirth: '1966-08-08', // One day short of 60 years
    };

    const result = assessmentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    const issues = result.error?.issues ?? [];
    const dateOfBirthIssue = issues.find((i) => i.path.includes('dateOfBirth'));
    expect(dateOfBirthIssue?.message).toBe('This pathway is for patients aged 60 and over');
  });

  // Additional boundary checks based on specifications
  it('validates Barthel Index bounds and step values', () => {
    expect(assessmentSchema.safeParse({ ...SAMPLE_PATIENT, barthelIndex: 0 }).success).toBe(true);
    expect(assessmentSchema.safeParse({ ...SAMPLE_PATIENT, barthelIndex: 100 }).success).toBe(true);
    expect(assessmentSchema.safeParse({ ...SAMPLE_PATIENT, barthelIndex: 82 }).success).toBe(false);
    expect(assessmentSchema.safeParse({ ...SAMPLE_PATIENT, barthelIndex: 105 }).success).toBe(
      false
    );
  });

  it('enforces pharmacist review requirement for polypharmacy (5+ medications)', () => {
    // 4 medications without review requested is valid
    expect(
      assessmentSchema.safeParse({
        ...SAMPLE_PATIENT,
        medicationCount: 4,
        pharmacistReviewRequested: false,
      }).success
    ).toBe(true);

    // 5 medications without review requested is invalid
    expect(
      assessmentSchema.safeParse({
        ...SAMPLE_PATIENT,
        medicationCount: 5,
        pharmacistReviewRequested: false,
      }).success
    ).toBe(false);

    // 5 medications with review requested is valid
    expect(
      assessmentSchema.safeParse({
        ...SAMPLE_PATIENT,
        medicationCount: 5,
        pharmacistReviewRequested: true,
      }).success
    ).toBe(true);
  });
});
