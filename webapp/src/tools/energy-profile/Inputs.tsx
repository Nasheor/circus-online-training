import { useId } from 'react';
import { HEATING_TYPES, HOUSE_TYPES } from '../../engine/energy-profile/types';
import type { ProfileInputs } from '../../engine/energy-profile/types';
import { fill } from '../../i18n/format';
import type { Strings } from '../../i18n/strings';
import { NumberField } from '../shared/NumberField';
import { PercentField } from '../shared/PercentField';

interface Props {
  s: Strings;
  inputs: ProfileInputs;
  /** Apply a change to the inputs held in the workspace. */
  change: (mutate: (inputs: ProfileInputs) => void) => void;
}

function Step({ number, title, lead, children }: { number: number; title: string; lead: string; children: React.ReactNode }) {
  return (
    <section className="panel profile__step stack">
      <h3>
        <span className="profile__step-number" aria-hidden="true">
          {number}
        </span>
        {title}
      </h3>
      <p>{lead}</p>
      {children}
    </section>
  );
}

export function Inputs({ s, inputs, change }: Props) {
  const t = s.profile;
  const id = useId();
  const totalHomes = HOUSE_TYPES.reduce(
    (total, type) => total + HEATING_TYPES.reduce((sum, heating) => sum + inputs.houses[type][heating], 0),
    0,
  );
  const goalSet = inputs.targets.evShareTarget !== null;

  return (
    <div className="stack-lg">
      <Step number={1} title={t.steps.homes.title} lead={t.steps.homes.lead}>
        <div className="table-wrap">
          <table className="table homes-table">
            <caption className="visually-hidden">{t.homes.caption}</caption>
            <thead>
              <tr>
                <th scope="col">{t.homes.type}</th>
                {HEATING_TYPES.map((heating) => (
                  <th key={heating} scope="col">
                    {t.heating[heating]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOUSE_TYPES.map((type) => (
                <tr key={type}>
                  <th scope="row">{t.houseTypes[type]}</th>
                  {HEATING_TYPES.map((heating) => (
                    <td key={heating}>
                      <NumberField
                        value={inputs.houses[type][heating]}
                        onChange={(value) =>
                          change((draft) => {
                            draft.houses[type][heating] = value;
                          })
                        }
                        errors={t.errors}
                        whole
                        className="input input--number"
                        ariaLabel={fill(t.homes.cell, { house: t.houseTypes[type], heating: t.heating[heating] })}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">{t.homes.total}</th>
                <td colSpan={3} className="num" aria-live="polite">
                  {totalHomes}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="small muted">{t.homes.heatingHelp}</p>
      </Step>

      <Step number={2} title={t.steps.transport.title} lead={t.steps.transport.lead}>
        <div className="field field-row">
          <label htmlFor={`${id}-cars`}>{t.fields.carsPerHousehold.label}</label>
          <NumberField
            id={`${id}-cars`}
            value={inputs.carsPerHousehold}
            onChange={(value) =>
              change((draft) => {
                draft.carsPerHousehold = value;
              })
            }
            errors={t.errors}
            max={20}
            ariaDescribedBy={`${id}-cars-hint`}
          />
          <span id={`${id}-cars-hint`} className="hint">
            {t.fields.carsPerHousehold.hint}
          </span>
        </div>
        <PercentField
          label={t.fields.evShare.label}
          value={inputs.evShare}
          onChange={(value) =>
            change((draft) => {
              draft.evShare = value;
            })
          }
          errors={t.errors}
        />
      </Step>

      <Step number={3} title={t.steps.production.title} lead={t.steps.production.lead}>
        <div className="field field-row">
          <label htmlFor={`${id}-panels`}>{t.fields.solarPanels.label}</label>
          <NumberField
            id={`${id}-panels`}
            value={inputs.solarPanels}
            onChange={(value) =>
              change((draft) => {
                draft.solarPanels = value;
              })
            }
            errors={t.errors}
            whole
            ariaDescribedBy={`${id}-panels-hint`}
          />
          <span id={`${id}-panels-hint`} className="hint">
            {t.fields.solarPanels.hint}
          </span>
        </div>
        <fieldset className="stack">
          <legend>{t.fields.wind.legend}</legend>
          <p className="small muted">{t.fields.wind.hint}</p>
          {inputs.wind.map((row, index) => (
            <div key={index} className="wind-row">
              <div className="field">
                <label htmlFor={`${id}-wind-name-${index}`} className="small">
                  {t.fields.wind.name}
                </label>
                <input
                  id={`${id}-wind-name-${index}`}
                  className="input"
                  value={row.name}
                  onChange={(event) =>
                    change((draft) => {
                      draft.wind[index].name = event.target.value;
                    })
                  }
                />
              </div>
              <div className="field">
                <label htmlFor={`${id}-wind-count-${index}`} className="small">
                  {t.fields.wind.count}
                </label>
                <NumberField
                  id={`${id}-wind-count-${index}`}
                  value={row.count}
                  onChange={(value) =>
                    change((draft) => {
                      draft.wind[index].count = value;
                    })
                  }
                  errors={t.errors}
                  whole
                />
              </div>
              <div className="field">
                <label htmlFor={`${id}-wind-kw-${index}`} className="small">
                  {t.fields.wind.kw}
                </label>
                <NumberField
                  id={`${id}-wind-kw-${index}`}
                  value={row.kw}
                  onChange={(value) =>
                    change((draft) => {
                      draft.wind[index].kw = value;
                    })
                  }
                  errors={t.errors}
                />
              </div>
              <button
                type="button"
                className="btn btn--small"
                onClick={() =>
                  change((draft) => {
                    draft.wind.splice(index, 1);
                  })
                }
              >
                {s.common.remove}
                <span className="visually-hidden">
                  : {t.fields.wind.remove} {row.name || index + 1}
                </span>
              </button>
            </div>
          ))}
          <div>
            <button
              type="button"
              className="btn btn--small"
              onClick={() =>
                change((draft) => {
                  draft.wind.push({ name: '', count: 0, kw: 0 });
                })
              }
            >
              + {t.fields.wind.add}
            </button>
          </div>
        </fieldset>
      </Step>

      <Step number={4} title={t.steps.targets.title} lead={t.steps.targets.lead}>
        <PercentField
          label={t.fields.reduceElectricity.label}
          hint={t.fields.reduceElectricity.hint}
          value={inputs.targets.reduceElectricity}
          onChange={(value) =>
            change((draft) => {
              draft.targets.reduceElectricity = value;
            })
          }
          errors={t.errors}
        />
        <PercentField
          label={t.fields.reduceHeating.label}
          hint={t.fields.reduceHeating.hint}
          value={inputs.targets.reduceHeating}
          onChange={(value) =>
            change((draft) => {
              draft.targets.reduceHeating = value;
            })
          }
          errors={t.errors}
        />
        <fieldset className="stack">
          <legend>{t.fields.evTarget.label}</legend>
          <div className="cluster">
            <label className="choice">
              <input
                type="radio"
                name={`${id}-ev-goal`}
                checked={!goalSet}
                onChange={() =>
                  change((draft) => {
                    draft.targets.evShareTarget = null;
                  })
                }
              />
              <span>{t.fields.evTarget.keep}</span>
            </label>
            <label className="choice">
              <input
                type="radio"
                name={`${id}-ev-goal`}
                checked={goalSet}
                onChange={() =>
                  change((draft) => {
                    draft.targets.evShareTarget = draft.evShare;
                  })
                }
              />
              <span>{t.fields.evTarget.set}</span>
            </label>
          </div>
          {goalSet && (
            <PercentField
              label={t.fields.evTarget.share}
              value={inputs.targets.evShareTarget ?? 0}
              onChange={(value) =>
                change((draft) => {
                  draft.targets.evShareTarget = value;
                })
              }
              errors={t.errors}
            />
          )}
        </fieldset>
      </Step>
    </div>
  );
}
