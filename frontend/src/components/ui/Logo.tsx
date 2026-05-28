import { Link } from 'react-router-dom';
import logoLight from '../../assets/skillproof-logo.png';
import logoDark from '../../assets/skillproof-logo-white.png';

const HEIGHT = {
  sm: 'h-7',
  md: 'h-8',
  lg: 'h-10',
} as const;

export type LogoProps = {
  to?: string;
  className?: string;
  size?: keyof typeof HEIGHT;
  /** White logo on dark backgrounds (footer, hero strips) */
  inverted?: boolean;
};

export function Logo({
  to = '/',
  className = '',
  size = 'md',
  inverted = false,
}: LogoProps) {
  const height = HEIGHT[size];

  return (
    <Link
      to={to}
      className={`inline-flex shrink-0 items-center ${className}`}
      aria-label="SkillProof home"
    >
      {inverted ? (
        <img
          src={logoDark}
          alt="SkillProof"
          className={`${height} w-auto max-w-[min(100%,14rem)] object-contain object-left`}
          width={160}
          height={32}
        />
      ) : (
        <>
          <img
            src={logoLight}
            alt="SkillProof"
            className={`${height} w-auto max-w-[min(100%,14rem)] object-contain object-left dark:hidden`}
            width={160}
            height={32}
          />
          <img
            src={logoDark}
            alt=""
            aria-hidden
            className={`${height} hidden w-auto max-w-[min(100%,14rem)] object-contain object-left dark:block`}
            width={160}
            height={32}
          />
        </>
      )}
    </Link>
  );
}
