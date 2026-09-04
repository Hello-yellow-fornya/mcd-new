import Link from 'next/link';
import type { ReactNode, MouseEventHandler } from 'react';
import { Icon } from '@/components/Icon/Icon';
import type { IconName } from '@/components/Icon/names';
import styles from './Button.module.css';

export type ButtonVariant = 'coral' | 'ink' | 'secondary' | 'secondary-on-dark';

type ButtonProps = {
  children: ReactNode;
  href?: string;
  /** coral: the bright, for Start your claim and Call. ink: primary on light surfaces. secondary: 2px ink border. */
  variant?: ButtonVariant;
  icon?: IconName;
  iconAfter?: IconName;
  /** lg is the 60px mobile hero size. */
  size?: 'md' | 'lg';
  full?: boolean;
  type?: 'button' | 'submit';
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  'aria-label'?: string;
};

const variantClass: Record<ButtonVariant, string> = {
  coral: styles.coral,
  ink: styles.ink,
  secondary: styles.secondary,
  'secondary-on-dark': styles.secondaryOnDark,
};

export function Button({ children, href, variant = 'coral', icon, iconAfter, size = 'md', full, type = 'button', className, onClick, ...rest }: ButtonProps) {
  const cls = [styles.btn, variantClass[variant], size === 'lg' && styles.lg, full && styles.full, className].filter(Boolean).join(' ');
  const inner = (
    <>
      {icon && <Icon name={icon} className={styles.ph} />}
      {children}
      {iconAfter && <Icon name={iconAfter} className={styles.ph} />}
    </>
  );
  if (href && href.startsWith('/')) {
    return (
      <Link href={href} className={cls} onClick={onClick} {...rest}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} {...rest}>
      {inner}
    </button>
  );
}
