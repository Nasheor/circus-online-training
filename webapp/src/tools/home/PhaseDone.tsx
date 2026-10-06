import type { PhaseId } from '../../content/structure';
import type { Locale } from '../../i18n/config';
import { getStrings } from '../../i18n/strings';
import { updateWorkspace } from '../../workspace/store';
import { useWorkspace } from '../../workspace/useWorkspace';

/** Lets a group tick a phase off; shown on the phase page and reflected in My community. */
export default function PhaseDone({ locale, phaseId }: { locale: Locale; phaseId: PhaseId }) {
  const s = getStrings(locale);
  const workspace = useWorkspace();
  const done = workspace.journey.phases[phaseId].done;
  return (
    <label className="choice">
      <input
        type="checkbox"
        checked={done}
        onChange={(event) =>
          updateWorkspace((draft) => {
            draft.journey.phases[phaseId].done = event.target.checked;
          })
        }
      />
      <span>
        <strong>{s.journey.markDone}</strong>
        <br />
        <span className="small muted">{s.common.savedLocally}</span>
      </span>
    </label>
  );
}
