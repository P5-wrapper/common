import { type Sketch } from "@contracts/Sketch";
import { type SketchProps } from "@contracts/SketchProps";
import { type Updater } from "@contracts/Updater";

export type P5CanvasProps<
  Props extends SketchProps = SketchProps,
  OutputNode = unknown
> = {
  sketch?: Sketch<Props>;
  updater?: Updater<Props>;
  fallback?: () => OutputNode;
  loading?: () => OutputNode;
  error?: (error: unknown) => OutputNode;
  children?: OutputNode;
} & Props;
