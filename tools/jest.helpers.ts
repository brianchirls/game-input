/// <reference types="jest" />
import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
expect.extend({ toBeDeepCloseTo, toMatchCloseTo });
