import { useEffect, useState } from 'react';
import projectAPI from '../services/api';
import type { Experience } from '../types/experience';
import Job from './Job';

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    projectAPI.fetchExperiences()
      .then((records) => { if (active) setExperiences(records); })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load experience');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <section aria-labelledby="experience-heading" className="mb-16">
      <h2 id="experience-heading" className="font-bold text-sm text-neutral-400 mb-8">EXPERIENCE</h2>
      {loading && <p role="status" className="text-sm text-neutral-400">Loading experience...</p>}
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {!loading && !error && experiences.length === 0 && (
        <p className="text-sm text-neutral-400">No experience listed yet.</p>
      )}
      {experiences.map((experience) => (
        <Job key={experience.id} title={experience.title} company={experience.company}
          duration={experience.duration} description={experience.description} />
      ))}
    </section>
  );
}
