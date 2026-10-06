import { CARD_BY_ID, PHASES } from '../../content/structure';
import type { ToolId } from '../../content/structure';
import type { Locale } from '../../i18n/config';
import { fill } from '../../i18n/format';
import { href } from '../../i18n/href';
import { getStrings } from '../../i18n/strings';
import { useWorkspace } from '../../workspace/useWorkspace';

/**
 * Shown at the top of a tool when a card session for that tool's phase is in
 * progress, so a group that came from a "apply the tool" card can get back.
 */
export default function ReturnBar({ locale, toolId }: { locale: Locale; toolId: ToolId }) {
  const s = getStrings(locale);
  const t = s.wattworks.session.returnBar;
  const workspace = useWorkspace();
  const session = workspace.cards.sessions.find((item) => item.id === workspace.cards.activeSessionId);
  const phase = PHASES.find((item) => item.toolId === toolId);
  if (!session || session.endedAt || !phase || session.deck !== phase.id) return null;
  const card = CARD_BY_ID.get(session.cursor);

  return (
    <div className="return-bar no-print" data-phase={phase.id} role="region" aria-label={s.wattworks.session.title}>
      <div className="container return-bar__inner">
        <p>
          <strong>{fill(t.text, { title: session.title })}</strong>
          {card?.kind === 'tool' && (
            <>
              {' '}
              <span>{fill(t.card, { n: card.number ?? '', tool: s.tools[toolId].name })}</span>
            </>
          )}
        </p>
        <a className="btn btn--small" href={href(locale, 'tools/cards/session')}>
          ← {t.back}
        </a>
      </div>
    </div>
  );
}
