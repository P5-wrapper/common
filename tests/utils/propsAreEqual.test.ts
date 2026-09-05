import { type P5CanvasProps } from "@contracts/P5CanvasProps";
import { propsAreEqual } from "@utils/propsAreEqual";
import { describe, expect, it, vi } from "vitest";

describe("propsAreEqual", () => {
  it("Returns true when the current and next props are the same", () => {
    const sketch = vi.fn();
    const current: P5CanvasProps = { sketch };
    const next: P5CanvasProps = { sketch };
    const equal = propsAreEqual(current, next);

    expect(equal).toBe(true);
  });

  it("Returns false when the current and next props are not the same", () => {
    const current: P5CanvasProps = {
      sketch: () => {
        return;
      }
    };
    const next: P5CanvasProps = {
      sketch: () => {
        return;
      }
    };
    const equal = propsAreEqual(current, next);

    expect(equal).toBe(false);
  });

  it("Returns true when custom props have the same deeply nested values", () => {
    const current = { position: { x: 1, y: 2 }, scale: 3 };
    const next = { position: { x: 1, y: 2 }, scale: 3 };
    const equal = propsAreEqual(current, next);

    expect(equal).toBe(true);
  });

  it("Returns false when custom props have different nested values", () => {
    const current = { position: { x: 1, y: 2 } };
    const next = { position: { x: 1, y: 3 } };
    const equal = propsAreEqual(current, next);

    expect(equal).toBe(false);
  });
});
