import { useState } from 'react';
import { zodResolver } from 'mantine-form-zod-resolver';
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { SAMPLE_PATIENT } from './fixtures';
import { Assessment, assessmentSchema, MOBILITY } from './schema';

// Initial form values shape where fields start empty before user input
export interface AssessmentFormValues {
  mrn: string;
  patientName: string;
  dateOfBirth: string;
  assessmentDate: string;
  mobility: string;
  barthelIndex: number | '';
  medicationCount: number | '';
  pharmacistReviewRequested: boolean;
  followUpDate: string;
  consentObtained: boolean;
}

const initialValues: AssessmentFormValues = {
  mrn: '',
  patientName: '',
  dateOfBirth: '',
  assessmentDate: '',
  mobility: '',
  barthelIndex: '',
  medicationCount: '',
  pharmacistReviewRequested: false,
  followUpDate: '',
  consentObtained: false,
};

// Transform MOBILITY enum values into human-readable label-value pairs for the Select component
const mobilitySelectData = MOBILITY.map((item) => ({
  value: item,
  label: item.charAt(0).toUpperCase() + item.slice(1).replace(/_/g, ' '),
}));

interface GeriatricAssessmentFormProps {
  onSave?: (data: Assessment) => void;
}

export function GeriatricAssessmentForm({ onSave }: GeriatricAssessmentFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<Assessment | null>(null);

  // Initialize Mantine form with Zod schema resolver and validation on blur
  const form = useForm<AssessmentFormValues>({
    initialValues,
    validate: (values) =>
      zodResolver(assessmentSchema)(values as unknown as Record<string, unknown>),
    validateInputOnBlur: true,
  });

  // Handle successful form submission
  const handleSubmit = (values: AssessmentFormValues) => {
    setSubmitting(true);
    setSubmittedData(null);

    // Simulate an ~800ms asynchronous network save request
    setTimeout(() => {
      // Parse values through schema to obtain strongly-typed result
      const parsed = assessmentSchema.parse(values);
      setSubmittedData(parsed);
      setSubmitting(false);

      if (onSave) {
        onSave(parsed);
      }
    }, 800);
  };

  // Pre-fill form fields with valid sample patient fixture
  const handleLoadSamplePatient = () => {
    form.setValues(SAMPLE_PATIENT);
    form.clearErrors();
    setSubmittedData(null);
  };

  return (
    <Container size="sm" py="xl">
      <Paper radius="md" p="xl" withBorder shadow="sm">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Title order={2}>Geriatric Care Assessment</Title>
            <Button variant="light" color="blue" onClick={handleLoadSamplePatient}>
              Load sample patient
            </Button>
          </Group>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Medical record number"
                placeholder="MRN-004821"
                key={form.key('mrn')}
                {...form.getInputProps('mrn')}
              />

              <TextInput
                label="Patient name"
                placeholder="Patient full name"
                key={form.key('patientName')}
                {...form.getInputProps('patientName')}
              />

              <DateInput
                label="Date of birth"
                placeholder="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                key={form.key('dateOfBirth')}
                {...form.getInputProps('dateOfBirth')}
              />

              <DateInput
                label="Assessment date"
                placeholder="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                maxDate={new Date()}
                key={form.key('assessmentDate')}
                {...form.getInputProps('assessmentDate')}
              />

              <Select
                label="Mobility"
                placeholder="Select mobility status"
                data={mobilitySelectData}
                key={form.key('mobility')}
                {...form.getInputProps('mobility')}
              />

              <NumberInput
                label="Barthel Index"
                placeholder="0 - 100 in steps of 5"
                step={5}
                min={0}
                max={100}
                key={form.key('barthelIndex')}
                {...form.getInputProps('barthelIndex')}
              />

              <NumberInput
                label="Regular medications"
                placeholder="0 - 30"
                min={0}
                max={30}
                key={form.key('medicationCount')}
                {...form.getInputProps('medicationCount')}
              />

              <Checkbox
                label="Pharmacist review requested"
                key={form.key('pharmacistReviewRequested')}
                {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
              />

              <DateInput
                label="Next review date"
                placeholder="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                key={form.key('followUpDate')}
                {...form.getInputProps('followUpDate')}
              />

              <Checkbox
                label="Patient or representative has given consent"
                key={form.key('consentObtained')}
                {...form.getInputProps('consentObtained', { type: 'checkbox' })}
              />

              <Button type="submit" loading={submitting} mt="md">
                Save Assessment
              </Button>
            </Stack>
          </form>

          {submittedData && (
            <Alert title="Assessment Saved Successfully" color="green" mt="md">
              <Code block>{JSON.stringify(submittedData, null, 2)}</Code>
            </Alert>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
