import { useId, useState } from 'react';
import { PHASES } from '../../content/structure';
import type { PhaseId } from '../../content/structure';
import type { Locale } from '../../i18n/config';
import { fill } from '../../i18n/format';
import { href } from '../../i18n/href';
import { getStrings } from '../../i18n/strings';
import { now } from '../../workspace/create';
import { updateWorkspace } from '../../workspace/store';
import { useWorkspace } from '../../workspace/useWorkspace';

/** The first question answered "no" decides the phase: each phase builds on the one before. */
export function recommendPhase(answers: Record<string, string>): PhaseId {
  if (answers.group !== 'yes' || answers.usage !== 'yes') return 'p1';
  if (answers.options !== 'yes' || answers.direction !== 'yes') return 'p2';
  return 'p3';
}

export default function SelfCheck({ locale }: { locale: Locale }) {
  const s = getStrings(locale);
  const t = s.selfCheck;
  const workspace = useWorkspace();
  const formId = useId();
  const saved = workspace.journey.selfCheck;
  const [answers, setAnswers] = useState<Record<string, string>>(saved?.answers ?? {});
  const complete = t.questions.every((question) => answers[question.id]);
  const recommended = complete ? recommendPhase(answers) : null;
  const phase = PHASES.find((item) => item.id === recommended);

  const answer = (questionId: string, optionId: string) => {
    const next = { ...answers, [questionId]: optionId };
    setAnswers(next);
    if (t.questions.every((question) => next[question.id])) {
      updateWorkspace((draft) => {
        draft.journey.selfCheck = { answers: next, recommended: recommendPhase(next), at: now() };
      });
    }
  };

  const reset = () => {
    setAnswers({});
    updateWorkspace((draft) => {
      delete draft.journey.selfCheck;
    });
  };

  return (
    <div className="split">
      <form className="stack" onSubmit={(event) => event.preventDefault()}>
        {t.questions.map((question, index) => (
          <fieldset key={question.id} className="stack">
            <legend>
              <span className="visually-hidden">
                {fill(t.progress, { n: index + 1, total: t.questions.length })}:{' '}
              </span>
              {index + 1}. {question.text}
            </legend>
            {question.options.map((option) => (
              <label key={option.id} className="choice">
                <input
                  type="radio"
                  name={`${formId}-${question.id}`}
                  checked={answers[question.id] === option.id}
                  onChange={() => answer(question.id, option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
        ))}
      </form>
      <div aria-live="polite">
        {phase && recommended ? (
          <div className="panel panel--phase stack" data-phase={recommended}>
            <p className="eyebrow">{t.resultTitle}</p>
            <h3>
              {fill(s.common.phase, { n: phase.order })} – {s.phases[recommended].name}
            </h3>
            <p>{t.result[recommended]}</p>
            <div className="cluster">
              <a className="btn btn--primary" href={href(locale, `journey/${phase.slug}`)}>
                {fill(t.go, { n: phase.order })}
              </a>
              <button type="button" className="btn btn--quiet" onClick={reset}>
                {t.again}
              </button>
            </div>
            <p className="small muted">{t.savedNote}</p>
          </div>
        ) : (
          <div className="panel panel--flat stack">
            <p className="eyebrow">{t.resultTitle}</p>
            <p className="muted">{t.lead}</p>
          </div>
        )}
      </div>
    </div>
  );
}
