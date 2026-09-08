import { SketchProps } from "@/main";
import { p5 } from "@contracts/p5";
import { type P5CanvasInstanceRef } from "@contracts/P5CanvasInstanceRef";
import { removeP5CanvasInstance } from "@utils/removeP5CanvasInstance";
import { describe, expect, it, vi } from "vitest";

describe("removeP5CanvasInstance", () => {
  it("Calls the remove method on the P5 canvas instance if it exists", () => {
    const instance = new p5(() => {
      return;
    });
    const removeSpy = vi.spyOn(instance, "remove");
    const p5CanvasInstanceRef: P5CanvasInstanceRef<SketchProps> = {
      current: null
    };

    // @see https://github.com/processing/p5.js/pull/7863
    // @ts-expect-error The p5 library changes from the above PR caused some issues with the inferred types.
    p5CanvasInstanceRef.current = instance;

    removeP5CanvasInstance(p5CanvasInstanceRef);

    expect(removeSpy).toHaveBeenCalledOnce();
    expect(p5CanvasInstanceRef.current).toBeNull();
  });

  it("Handles a null ref without throwing", () => {
    const p5CanvasInstanceRef: P5CanvasInstanceRef<SketchProps> = {
      current: null
    };

    expect(() => removeP5CanvasInstance(p5CanvasInstanceRef)).not.toThrow();
    expect(p5CanvasInstanceRef.current).toBeNull();
  });
});
