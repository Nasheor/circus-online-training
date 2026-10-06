import type { TextareaHTMLAttributes } from 'react';

/**
 * A textarea that prints in full. Browsers print only the visible box of a
 * textarea and cut off the rest, so on paper the text is shown as plain text.
 */
export function PrintableTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement> & { value: string }) {
  return (
    <>
      <textarea {...props} className={`${props.className ?? ''} screen-only`.trim()} />
      <div className="print-only print-text">{props.value}</div>
    </>
  );
}
