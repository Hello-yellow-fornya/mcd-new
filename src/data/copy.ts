/**
 * Approved copy (guidelines §2) and the fixed strings the mockups use.
 * Components read from here so the words stay in one place. Anything marked
 * [TODO] or "pending" is a placeholder from brief §11.
 */
import type { IconName } from '@/components/Icon/names';

export const nav = {
  /** Top-level links. "Services" carries a dropdown; in Phase 1 it lists the pillar pages that exist. */
  links: [
    {
      label: 'Services',
      href: '/accident-management-company/',
      children: [
        { href: '/accident-management-company/', label: 'Accident management company' },
        { href: '/non-fault-accident/', label: 'Non-fault accident' },
        { href: '/third-party-insurance-claim/', label: 'Third party insurance claim' },
        { href: '/non-fault-accident-courtesy-car/', label: 'Courtesy car' },
        { href: '/credit-hire/', label: 'Credit hire' },
      ],
    },
    { href: '/how-accident-management-works/', label: 'How it works' },
    { href: '/accident-management-vs-insurance/', label: 'vs your insurer' },
    { href: '/what-to-do-after-a-car-accident/', label: 'Advice' },
  ],
  claimHref: '/claim-now/',
} as const;

export type NavLink = { label: string; href: string; children?: ReadonlyArray<{ href: string; label: string }> };

export const hero = {
  line: 'Hit by someone else? You shouldn’t pay for it.',
  subline: 'The other driver’s insurer pays. Nothing goes through your policy.',
  photoAlt: 'A woman outside a red-brick London terrace being handed the keys to her hire car',
  pills: [
    { icon: 'shield', label: 'Keep your no claims' },
    { icon: 'pound', label: 'No excess fees, ever' },
    { icon: 'car', label: 'Like-for-like car hire' },
  ] satisfies { icon: IconName; label: string }[],
} as const;

export const keeps = [
  { icon: 'pound', label: 'No excess to pay' },
  { icon: 'shield', label: 'Keep your no claims bonus' },
  { icon: 'car', label: 'Like-for-like car hire' },
] satisfies { icon: IconName; label: string }[];

export const benefits = {
  heading: 'Why claim through Motor Claims Department',
  items: [
    { icon: 'pound', title: 'No excess fees to pay, ever', body: 'Nothing to pay up front. Nothing to chase back.' },
    { icon: 'shield', title: 'Keep your no claims bonus', body: 'Nothing goes through your policy, so your no-claims is untouched.' },
    { icon: 'car', title: 'Like-for-like car hire, 100% guaranteed', body: 'Delivered to your drive. If yours is written off, you keep it until the money lands.' },
    { icon: 'person', title: 'A dedicated, UK-based call handler', body: 'Your handler owns it from first call to keys back. No queues, no repeating yourself.' },
  ] satisfies { icon: IconName; title: string; body: string }[],
} as const;

export const howItWorks = {
  heading: 'How it works',
  introLead: 'Someone hit you. Their insurer has to put it right — not yours.',
  intro:
    'Most people don’t know that. They ring their own insurer, pay the excess, and watch their no-claims take the hit for somebody else’s mistake. We claim from their insurer instead. Here’s what that means for you.',
  steps: [
    { icon: 'phone', title: '1. Tell us what happened', body: 'One call, or your reg. We check the other driver’s covered and the fault is clear. That’s your bit done.' },
    { icon: 'person', title: '2. Your handler takes it on', body: 'One person, in the UK, deals with the other driver’s insurer from start to finish. If they ring you — and they will — send them to us.' },
    { icon: 'car', title: '3. We put you back in a car', body: 'Like-for-like, on your drive, while yours is repaired somewhere you trust. If yours is written off, you keep it until the money comes through.' },
    { icon: 'pound', title: '4. They pay. Not you.', body: 'Their insurer settles the repair, the car and our costs. No excess, nothing on your policy, your no-claims untouched.' },
  ] satisfies { icon: IconName; title: string; body: string }[],
} as const;

/** Pending MCD’s policy on hire charges where fault cannot be established (brief §11). */
export const theCatch = {
  callout:
    'We can only do this when someone else was at fault and they’re insured. If it’s not clear, we’ll tell you on the first call — before you’ve signed anything.',
  faq: 'We recover our costs from the at-fault driver’s insurer, which is why it costs you nothing. If they refuse to accept fault, we argue it for you. In the rare case that fault can’t be established, you could be asked to cover the hire charges, which is why we’ll tell you on the first call whether your claim is one we’d take on.',
} as const;

export const homeFaq = {
  heading: 'What’s the catch?',
  sub: 'There’s one. Here it is, in the same size as everything else.',
  items: [
    { q: 'What’s the catch?', a: theCatch.faq },
    {
      q: 'Will my premium go up?',
      a: 'Nothing goes through your policy, so there’s no claim on it. You’ll still need to tell your insurer about the incident at renewal, and how they price that is up to them. We won’t pretend otherwise.',
    },
    {
      q: 'Do I still need to speak to my insurer?',
      a: 'Only to let them know it happened. We handle everything else, including the call you’ll get from the other driver’s insurer.',
    },
    { q: 'Are you an insurer?', a: 'No. We don’t sell insurance. We just make it pay. MCD is regulated by the Financial Conduct Authority.' },
  ],
} as const;

export const band = {
  line1: 'Your insurer has a claims department.',
  line2: 'It works for your insurer.',
  highlight: 'We work for you.',
} as const;

export const handler = {
  eyebrow: 'Your handler',
  quote: '“I’m Dani. I’ll own your claim until your keys are back.”',
  body: 'Every claim has one person on it, start to finish. They call you back when they say they will. They’re in the UK. You’ll have their name, and they’ll know yours.',
  link: { href: '/about-us/', label: 'Meet the department' },
  photoLabel: 'Photo placeholder: a claims handler at their desk, mid-call, smiling',
} as const;

export const whoWeHelp = ['Car drivers', 'Van drivers', 'Motorbike riders', 'Taxi & fleet', 'Passengers'] as const;

export const independence = {
  generic: 'Independent accident management company. Not an insurer — we help drivers with any insurer claim from the driver who hit them.',
  insurer: (name: string) =>
    `Independent accident management company. Not ${name}, not an insurer — we help drivers with any insurer claim from the driver who hit them.`,
} as const;

export const cta = {
  start: 'Start your claim',
  call: 'Call 0800 048 0048',
} as const;

export const footer = {
  links: [
    [
      { href: '/accident-management-company/', label: 'Accident management company' },
      { href: '/how-accident-management-works/', label: 'How it works' },
      { href: '/non-fault-accident/', label: 'Non-fault accident' },
      { href: '/third-party-insurance-claim/', label: 'Third party insurance claim' },
      { href: '/credit-hire/', label: 'Credit hire' },
    ],
    [
      { href: '/about-us/', label: 'About us' },
      { href: '/contact-us/', label: 'Contact' },
      { href: '/complaints/', label: 'Complaints' },
      { href: '/terms/', label: 'Terms of business' },
      { href: '/privacy-policy/', label: 'Privacy' },
    ],
  ],
  companyNumber: '[00000000]',
  registeredOffice: '[address]',
} as const;
