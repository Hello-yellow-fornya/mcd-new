/**
 * The solid icon set as drawn in the mockups (guidelines §6). Only icons that
 * exist in a design file are here; keys, clock, question, road, speech bubble
 * and wrench are listed in the guidelines but not yet drawn.
 */
export const iconNames = ['phone', 'shield', 'pound', 'car', 'person', 'star', 'bolt', 'tick', 'cross', 'arrow', 'dot', 'document'] as const;
export type IconName = (typeof iconNames)[number];
