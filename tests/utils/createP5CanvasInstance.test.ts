import { type CanvasContainer } from "@contracts/CanvasContainer";
import { type Sketch } from "@contracts/Sketch";
import { createP5CanvasInstance } from "@utils/createP5CanvasInstance";
import { describe, expect, it, vi } from "vitest";

describe("createP5CanvasInstance", () => {
  it("Creates a p5 instance bound to the given sketch and container", () => {
    const sketch: Sketch = vi.fn();
    const canvasContainer: CanvasContainer = document.createElement("div");

    const instance = createP5CanvasInstance(sketch, canvasContainer);

    expect(instance).toBeDefined();
  });

  it("Calls the sketch with the created p5 instance", () => {
    const sketch: Sketch = vi.fn();
    const canvasContainer: CanvasContainer = document.createElement("div");

    const instance = createP5CanvasInstance(sketch, canvasContainer);

    expect(sketch).toHaveBeenCalledWith(instance);
  });
});
