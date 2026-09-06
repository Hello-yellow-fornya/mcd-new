import { hero, howItWorks, homeFaq, themUs, whoWeHelp, band, cta } from '@/data/copy';
import { site } from '@/lib/site';

/**
 * MCD 3.0 homepage copy. Same copy rules as 2.0: the headline, lead, steps,
 * comparison rows, FAQ, band lines and CTA labels are the shared copy; only
 * the 3.0 framing (the three worries, the shortcut heading, who we help) is
 * new. [assumption] The 3.0 design files were not in /design/ when this was
 * built, so the framing copy below is drafted to the brief and needs
 * reconciling against mcd-homepage-concept-guidelines-v1.html.
 */
export const home3 = {
  hero: {
    /** "Hit by someone else?" then the payoff on its own line in the ink chip. */
    line: 'Hit by someone else?',
    payoff: 'You shouldn’t pay for it.',
    lead: hero.subline,
    /** The three worries a non-fault driver arrives with, each answered in a line. */
    worries: [
      { icon: 'pound', worry: 'Will I have to pay?', answer: 'No. The other driver’s insurer pays. No excess.' },
      { icon: 'shield', worry: 'Will I lose my no claims?', answer: 'No. Nothing goes through your policy.' },
      { icon: 'car', worry: 'How do I get around?', answer: 'A like-for-like car on your drive.' },
    ],
    online: 'Or start your claim online',
    proof: ['avg-wait', 'fastest-way'],
    illustrationAlt: 'A car with its keys, drawn in bold outline',
  },
  how: { heading: howItWorks.heading, highlight: 'works', intro: howItWorks.introLead, steps: howItWorks.steps },
  shortcut: {
    heading: 'We know a shortcut',
    highlight: 'shortcut',
    sub: 'The old way sends you through your own insurer. The new way sends the bill to theirs.',
    oldWay: 'The old way',
    newWay: 'The new way',
    rows: themUs.rows,
  },
  handler: {
    eyebrow: 'Your handler',
    quote: '“I’m Dani. I’ll own your claim until your keys are back.”',
    body: 'Every claim has one person on it, start to finish. They call you back when they say they will. They’re in the UK. You’ll have their name, and they’ll know yours.',
    link: { href: '/about-us/', label: 'Meet the department' },
    photoLabel: 'Photo placeholder: a claims handler at their desk, mid-call, smiling',
  },
  who: { heading: 'Who we help', highlight: 'help', chips: whoWeHelp, note: 'Any car, van or bike. Any insurer. As long as someone else was at fault.' },
  faq: { heading: 'What’s the catch?', highlight: 'catch?', sub: 'There’s one. Here it is, in the same size as everything else.', items: homeFaq.items },
  final: { line1: band.line1, line2: band.line2, payoff: band.highlight },
  cta,
  phone: site.phone,
} as const;
