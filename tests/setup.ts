import { p5 } from "@contracts/p5";
import "vitest-canvas-mock";

// Disables P5 "friendly errors" to avoid DOM-related script scanning that causes unhandled rejections in the tests.
// @see https://p5js.org/reference/p5/disableFriendlyErrors/
p5.disableFriendlyErrors = true;
