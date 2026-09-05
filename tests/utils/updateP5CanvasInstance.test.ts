import { SketchProps } from "@/main";
import { type CanvasContainerRef } from "@contracts/CanvasContainerRef";
import { p5 } from "@contracts/p5";
import { type P5CanvasInstanceRef } from "@contracts/P5CanvasInstanceRef";
import { createP5CanvasInstance } from "@utils/createP5CanvasInstance";
import { updateP5CanvasInstance } from "@utils/updateP5CanvasInstance";
import { describe, expect, it, vi } from "vitest";

describe("updateP5CanvasInstance", () => {
  it("Removes the previous instance and creates a new one", () => {
    const sketch = vi.fn();
    const canvasContainer = document.createElement("div");
    const canvasContainerRef: CanvasContainerRef = { current: canvasContainer };
    const p5CanvasInstanceRef: P5CanvasInstanceRef<SketchProps> = {
      current: null
    };
    const instance = createP5CanvasInstance(sketch, canvasContainer);

    p5CanvasInstanceRef.current = instance;

    const updatedInstance = updateP5CanvasInstance(
      p5CanvasInstanceRef,
      canvasContainerRef,
      sketch
    );

    expect(instance).toBeInstanceOf(p5);
    expect(updatedInstance).toBeInstanceOf(p5);
    expect(instance).not.toEqual(updatedInstance);
  });

  it("Returns null when the canvas container ref is null", () => {
    const sketch = vi.fn();
    const canvasContainer = document.createElement("div");
    const canvasContainerRef: CanvasContainerRef = { current: null };
    const p5CanvasInstanceRef: P5CanvasInstanceRef<SketchProps> = {
      current: null
    };
    const instance = createP5CanvasInstance(sketch, canvasContainer);

    p5CanvasInstanceRef.current = instance;

    const updatedInstance = updateP5CanvasInstance(
      p5CanvasInstanceRef,
      canvasContainerRef,
      sketch
    );

    expect(updatedInstance).toBeNull();
  });
});
