'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { Observer } from 'gsap/Observer';

let registered = false;

export const initGSAP = () => {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, Flip, Observer);
  registered = true;
};

export { gsap, ScrollTrigger, Flip, Observer };
