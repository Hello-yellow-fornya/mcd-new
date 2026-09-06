import styles from './Wordmark.module.css';

type Props = {
  /** paper: ink type, yellow chip (header on cream). yellow: ink type, ink chip with yellow text (the hero). ink: white type, yellow chip (the footer). */
  surface?: 'paper' | 'yellow' | 'ink';
  className?: string;
};

/**
 * The 3.0 wordmark: "motor claims" over "department", lowercase Quicksand
 * Bold, with "department" in the chip. Not the 2.0 logo.
 */
export function Wordmark({ surface = 'paper', className }: Props) {
  return (
    <span className={[styles.mark, styles[surface], className].filter(Boolean).join(' ')} data-wordmark={surface}>
      <span className={styles.line}>motor claims</span>
      <span className={styles.chip}>department</span>
    </span>
  );
}
