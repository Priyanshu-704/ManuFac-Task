import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent, waitFor } from '../../../test-utils';
import { SAMPLE_PATIENT } from './fixtures';
import { GeriatricAssessmentForm } from './GeriatricAssessmentForm';

describe('GeriatricAssessmentForm Component', () => {
  it('loads sample patient, submits form, and calls save handler with parsed values', async () => {
    const handleSave = vi.fn();
    render(<GeriatricAssessmentForm onSave={handleSave} />);

    // Click "Load sample patient" button to pre-fill valid fixture
    const loadSampleButton = screen.getByRole('button', { name: /load sample patient/i });
    await userEvent.click(loadSampleButton);

    // Verify MRN input field is populated
    const mrnInput = screen.getByLabelText(/medical record number/i);
    expect(mrnInput).toHaveValue(SAMPLE_PATIENT.mrn);

    // Click "Save Assessment" submit button
    const submitButton = screen.getByRole('button', { name: /save assessment/i });
    await userEvent.click(submitButton);

    // Assert save handler callback is invoked with exact parsed values
    await waitFor(
      () => {
        expect(handleSave).toHaveBeenCalledWith(SAMPLE_PATIENT);
      },
      { timeout: 3000 }
    );

    // Assert success notification alert is displayed
    expect(await screen.findByText(/assessment saved successfully/i)).toBeInTheDocument();
  });
});
