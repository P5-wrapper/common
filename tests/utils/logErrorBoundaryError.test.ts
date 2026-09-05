import { logErrorBoundaryError } from "@utils/logErrorBoundaryError";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockInstance,
  vi
} from "vitest";

describe("logErrorBoundaryError", () => {
  let errorLoggerSpy: MockInstance<typeof console.error>;

  beforeEach(() => {
    const errorLogger = vi.fn();

    errorLoggerSpy = vi.spyOn(console, "error").mockImplementation(errorLogger);
  });

  afterEach(() => {
    errorLoggerSpy.mockReset();
    errorLoggerSpy.mockRestore();
  });

  it("Logs the error correctly when provided an `Error` instance", () => {
    logErrorBoundaryError(new Error("Example"));

    expect(errorLoggerSpy).toHaveBeenCalledOnce();
    expect(errorLoggerSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error("Example")')
    );
  });

  it("Logs the error correctly when provided a string", () => {
    logErrorBoundaryError("Example");

    expect(errorLoggerSpy).toHaveBeenCalledOnce();
    expect(errorLoggerSpy).toHaveBeenCalledWith(
      expect.stringContaining('String("Example")')
    );
  });

  it("Logs the error correctly when provided a number", () => {
    logErrorBoundaryError(404);

    expect(errorLoggerSpy).toHaveBeenCalledOnce();
    expect(errorLoggerSpy).toHaveBeenCalledWith(
      expect.stringContaining("Number(404)")
    );
  });

  it("Logs the introduction line once", () => {
    logErrorBoundaryError(new Error("Example"));

    const logged = errorLoggerSpy.mock.calls[0][0] as string;
    const introductions = logged
      .split("\n")
      .filter(line => line.includes("The error boundary was triggered"));

    expect(introductions).toHaveLength(1);
  });
});
