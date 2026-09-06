import { cta } from '@/data/copy';
import { site } from '@/lib/site';

/**
 * MCD 3.0 homepage copy, verbatim from design/mcd-homepage-concept-guidelines-v1.html
 * and mcd-homepage-mobile-guidelines-v1.html. The CTA labels follow the shared
 * copy rules (cta.start / cta.call); everything else is the signed-off text.
 */
export const home3 = {
  hero: {
    eyebrow: 'Just been hit? Start here.',
    line: 'Not your fault?',
    payoff: 'It’s handled.',
    lead: 'The other driver’s insurer pays. Nothing goes through your policy. One person owns your claim from the first call to the keys back.',
    worries: [
      { icon: 'pound', worry: 'Will it cost me?', answer: 'No. No excess, nothing to chase back.' },
      { icon: 'shield', worry: 'Will I lose my bonus?', answer: 'No. Your no-claims is untouched.' },
      { icon: 'car', worry: 'Will I be without a car?', answer: 'No. A like-for-like car on your drive.' },
    ],
    online: 'Or start your claim online',
    proof: ['avg-wait', 'fastest-way'],
    illustrationAlt: 'Illustration of a replacement car on a driveway with a set of keys',
  },
  how: {
    eyebrow: 'How it works',
    heading: 'Your claim, without the chaos',
    highlight: 'without the chaos',
    sub: 'Someone hit you. Their insurer has to put it right — not yours. Most people don’t know that. We claim from their insurer instead.',
    steps: [
      { title: 'Tell us what happened', body: 'One call, or your reg. That’s your bit done.' },
      { title: 'Your handler takes it on', body: 'One person, in the UK, deals with the other driver’s insurer.' },
      { title: 'We put you back in a car', body: 'Like-for-like, on your drive, while yours is repaired.' },
      { title: 'They pay. Not you.', body: 'No excess, nothing on your policy, your no-claims untouched.' },
    ],
  },
  shortcut: {
    eyebrow: 'Call us before you call your insurer',
    heading: 'We know a shortcut',
    highlight: 'a shortcut',
    sub: 'Your insurer’s claims department is paid by your insurer. Ours is paid by the insurer of the driver who hit you — which is why it costs you nothing.',
    newWay: {
      eyebrow: 'The new way',
      title: 'Call Motor Claims Department',
      items: [
        'Speak to a UK-based handler in minutes, not a queue',
        'One named person on your claim from first call to keys back',
        'No excess, nothing on your policy, your no-claims untouched',
        'A like-for-like car on your drive while yours is fixed',
      ],
    },
    oldWay: {
      eyebrow: 'The old way',
      title: 'Call your insurer',
      items: [
        'Wait on hold, then repeat your story to whoever picks up',
        'Pay your excess up front and chase it back later',
        'A claim on your record, and your no-claims takes the hit',
        'A small courtesy car, if your policy includes one at all',
      ],
    },
  },
  handler: {
    caption: 'Your handler',
    eyebrow: 'Someone competent has taken over',
    quote: '“I’m Dani. I’ll own your claim until your keys are back.”',
    body: 'Every claim has one person on it, start to finish. They call you back when they say they will. They’re in the UK. You’ll have their name, and they’ll know yours.',
    link: { href: '/about-us/', label: 'Meet the department →' },
    photoLabel: 'Photo: real handler, mid-call, real desk · shot warm, slightly over',
  },
  who: {
    eyebrow: 'Who we help',
    heading: 'Cars, vans, bikes, fleets and passengers',
    highlight: 'fleets and passengers',
    tags: ['Non-fault accidents', 'Motorbike claims', 'Taxi & fleet', 'Van drivers', 'Passengers'],
  },
  faq: {
    eyebrow: 'Straight answers',
    heading: 'What’s the catch?',
    highlight: 'the catch?',
    sub: 'There’s one. Here it is, in the same size as everything else.',
    items: [
      { q: 'What’s the catch?', a: 'We recover our costs from the at-fault driver’s insurer, which is why it costs you nothing. If they refuse to accept fault, we argue it for you. In the rare case that fault can’t be established, you could be asked to cover the hire charges — which is why we tell you on the first call whether your claim is one we’d take on.' },
      { q: 'Do I speak to my insurer?', a: 'Only to let them know it happened. That’s a notification, not a claim. We handle everything else, including the call you’ll get from the other driver’s insurer.' },
      { q: 'Will my premium go up?', a: 'Nothing goes through your policy, so there’s no claim on it. You’ll still need to tell your insurer about the incident at renewal, and how they price that is up to them. We won’t pretend otherwise.' },
      { q: 'Are you an insurer?', a: 'No. We don’t sell insurance. We just make it pay.' },
    ],
  },
  final: {
    heading: 'One call',
    payoff: 'sorts the lot.',
    sub: 'Tell us what happened and we’ll get straight on it. Nothing to pay. Nothing on your policy.',
  },
  footer: {
    strapline: 'The claims department on your side.',
    columns: [
      { heading: 'Claims', links: [{ href: '/claim-now/', label: 'Start your claim' }, { href: '/non-fault-accident/', label: 'Non-fault accidents' }, { href: '/non-fault-accident-courtesy-car/', label: 'Courtesy car' }, { href: '/credit-hire/', label: 'Credit hire' }] },
      { heading: 'Help', links: [{ href: '/how-accident-management-works/', label: 'How it works' }, { href: '/#catch', label: 'What’s the catch?' }, { href: '/contact-us/', label: 'Contact' }, { href: '/complaints/', label: 'Complaints' }] },
      { heading: 'Legal', links: [{ href: '/terms/', label: 'Terms' }, { href: '/privacy-policy/', label: 'Privacy' }, { href: '/cookies/', label: 'Cookies' }] },
    ],
  },
  cta,
  phone: site.phone,
} as const;
