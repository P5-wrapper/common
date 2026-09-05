import { CanvasContainerClassName } from "@constants/CanvasContainerClassName";
import { describe, expect, it } from "vitest";

describe("CanvasContainerClassName", () => {
  it("Exports the css class name used on the canvas container", () => {
    expect(CanvasContainerClassName).not.toBeUndefined();
    expect(CanvasContainerClassName).toBe("canvas-container");
  });

  it("Exports the css class name used on the canvas container as a non-empty string", () => {
    expect(typeof CanvasContainerClassName).toBe("string");
    expect(CanvasContainerClassName.length).toBeGreaterThan(0);
  });
});
