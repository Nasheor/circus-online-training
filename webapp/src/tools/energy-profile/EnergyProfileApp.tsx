import { useMemo } from 'react';
import { resolveAssumptions } from '../../engine/energy-profile/assumptions';
import { compute } from '../../engine/energy-profile/compute';
import type { ProfileInputs } from '../../engine/energy-profile/types';
import type { Locale } from '../../i18n/config';
import { getStrings } from '../../i18n/strings';
import { $loadProblem, $storageAvailable, updateWorkspace } from '../../workspace/store';
import { useWorkspace } from '../../workspace/useWorkspace';
import { useStore } from '@nanostores/react';
import { Assumptions } from './Assumptions';
import { Inputs } from './Inputs';
import { Results } from './Results';
import { Scenarios } from './Scenarios';

const changeInputs = (mutate: (inputs: ProfileInputs) => void) =>
  updateWorkspace((draft) => mutate(draft.profile.current.inputs));

/** The Energy Profile calculator: inputs on the left, live results beside them. */
export default function EnergyProfileApp({ locale }: { locale: Locale }) {
  const s = getStrings(locale);
  const workspace = useWorkspace();
  const storageAvailable = useStore($storageAvailable);
  const loadProblem = useStore($loadProblem);
  const { inputs, assumptionOverrides } = workspace.profile.current;
  const assumptions = useMemo(() => resolveAssumptions(assumptionOverrides), [assumptionOverrides]);
  const results = useMemo(() => compute(inputs, assumptions), [inputs, assumptions]);

  return (
    <div className="stack-lg" data-phase="p1">
      {!storageAvailable && <p className="notice notice--warn">{s.common.storageOff}</p>}
      {loadProblem && <p className="notice notice--warn">{s.common.loadProblem}</p>}
      {/* the inputs beside the headline figures, which stay in view; then the chart band; then scenarios and assumptions */}
      <div className="profile">
        <div className="stack-lg">
          <Inputs s={s} inputs={inputs} change={changeInputs} />
        </div>
        <div className="profile__results">
          <Results locale={locale} s={s} results={results} part="summary" />
        </div>
      </div>
      <Results locale={locale} s={s} results={results} part="detail" />
      <div className="profile__more no-print">
        <Scenarios locale={locale} s={s} workspace={workspace} results={results} />
        <Assumptions locale={locale} s={s} assumptions={assumptions} overrides={assumptionOverrides} />
      </div>
    </div>
  );
}
