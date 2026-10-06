import { useId, useState } from 'react';
import type { Locale } from '../../i18n/config';
import { getStrings } from '../../i18n/strings';

type LessonId = keyof ReturnType<typeof getStrings>['learn']['lessons'];

/** A lesson's quick check: answer, get the explanation straight away. Nothing is stored. */
export default function Quiz({ locale, lessonId }: { locale: Locale; lessonId: LessonId }) {
  const s = getStrings(locale);
  const t = s.learn;
  const id = useId();
  const questions = t.lessons[lessonId].quiz;
  const [answers, setAnswers] = useState<Record<number, number>>({});

  return (
    <form className="stack-lg" onSubmit={(event) => event.preventDefault()}>
      {questions.map((question, index) => {
        const chosen = answers[index];
        const answered = chosen !== undefined;
        const right = chosen === question.answer;
        return (
          <fieldset key={question.question} className="stack">
            <legend>
              {index + 1}. {question.question}
            </legend>
            {question.options.map((option, optionIndex) => (
              <label key={option} className="choice">
                <input
                  type="radio"
                  name={`${id}-${index}`}
                  checked={chosen === optionIndex}
                  onChange={() => setAnswers({ ...answers, [index]: optionIndex })}
                />
                <span>{option}</span>
              </label>
            ))}
            <p role="status" className={answered ? (right ? 'notice notice--ok' : 'notice notice--warn') : undefined}>
              {answered && (
                <>
                  <strong>{right ? t.correct : t.incorrect}</strong> {question.explain}
                </>
              )}
            </p>
          </fieldset>
        );
      })}
    </form>
  );
}
