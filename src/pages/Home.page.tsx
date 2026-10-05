import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { GeriatricAssessmentForm } from '../features/assessment/GeriatricAssessmentForm';

export function HomePage() {
  return (
    <>
      <GeriatricAssessmentForm />
      <ColorSchemeToggle />
    </>
  );
}
