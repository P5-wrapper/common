import { type P5CanvasInstance } from "@contracts/P5CanvasInstance";
import { type SketchProps } from "@contracts/SketchProps";

/** Ref to the active p5.js sketch instance controlling the canvas */
export interface P5CanvasInstanceRef<Props extends SketchProps> {
  current: P5CanvasInstance<Props> | null;
}
