import styles from './PhotoPlaceholder.module.css';

type Props = {
  /** The scene the real photo will show; doubles as the accessible name. */
  label: string;
  /** Visible production note, e.g. "Photo: keys handed over on a driveway". */
  note?: string;
  ratio?: '4/3' | '16/9' | '3/2';
  /** stone on paper/white surfaces (default), white on stone. */
  tone?: 'stone' | 'white';
  className?: string;
};

/** Stone box with a 24px photo-frame radius, used wherever a real photo is still to come. */
export function PhotoPlaceholder({ label, note, ratio = '4/3', tone = 'stone', className }: Props) {
  return (
    <div
      className={[styles.ph, styles[tone], className].filter(Boolean).join(' ')}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={label}
    >
      {note && <span>{note}</span>}
    </div>
  );
}
