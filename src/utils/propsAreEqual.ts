import { type SketchProps } from "@contracts/SketchProps";
import diff from "microdiff";

export function propsAreEqual<Props extends SketchProps>(
  previous: Props,
  next: Props
) {
  const differences = diff(previous, next);

  return differences.length === 0;
}
