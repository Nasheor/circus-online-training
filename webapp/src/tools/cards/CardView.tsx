import type { CardDef } from '../../content/structure';
import { fill } from '../../i18n/format';
import type { Strings } from '../../i18n/strings';

/** A WattWorks card as React, matching components/CardFace.astro. */
export function CardView({ card, s, large = false }: { card: CardDef; s: Strings; large?: boolean }) {
  const text = s.cards[card.id];
  return (
    <article
      className={`wcard${card.kind === 'info' ? ' wcard--info' : ''}${large ? ' wcard--large' : ''}`}
      data-phase={card.deck}
    >
      <div className="wcard__top">
        <span className="wcard__category">{s.cardCategories[card.category]}</span>
        {card.number !== null && <span className="wcard__number">{card.number}</span>}
      </div>
      {text.title && <h3 className="wcard__title">{text.title}</h3>}
      <ul className="wcard__lines">
        {text.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {card.methodologyId && (
        <p className="wcard__tag">
          {fill(s.wattworks.methodologyTag, { name: s.methodologies[card.methodologyId] })}
        </p>
      )}
    </article>
  );
}
