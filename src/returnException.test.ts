import { returnException } from "./returnException";

describe("When wrapping async function", () => {
  const fn = async (arg: "value" | "error1" | "error2" | "error3") => {
    if (arg === "value") {
      return "value";
    }

    throw arg;
  };

  const isError1 = (error: unknown): error is "error1" => error === "error1";
  const isError2 = (error: unknown): error is "error2" => error === "error2";

  describe("And wrapped function doesn't throw errors", () => {
    it("Returns wrapped function return value", () => {
      expect(returnException(fn)("value")).resolves.toEqual([
        "value",
        undefined,
      ]);
    });
  });

  describe("And wrapped function throw an error", () => {
    it("Returns thrown error", () => {
      expect(returnException(fn)("error1")).resolves.toEqual([
        undefined,
        "error1",
      ]);
    });
  });

  describe("And we pass exception checkers", () => {
    describe("And function throws checked exception", () => {
      it("Returns error", () => {
        expect(
          returnException(fn, [isError1, isError2])("error2")
        ).resolves.toEqual([undefined, "error2"]);
      });
    });

    describe("And function throws unchecked exception", () => {
      it("Throws error", () => {
        expect(() =>
          returnException(fn, [isError1, isError2])("error3")
        ).rejects.toBe("error3");
      });
    });
  });
});

describe("When wrapping sync function", () => {
  const fn = (arg: "value" | "error1" | "error2" | "error3") => {
    if (arg === "value") {
      return "value";
    }

    throw arg;
  };

  const isError1 = (error: unknown): error is "error1" => error === "error1";
  const isError2 = (error: unknown): error is "error2" => error === "error2";

  describe("And wrapped function doesn't throw errors", () => {
    it("Returns wrapped function return value", () => {
      expect(returnException(fn)("value")).toEqual(["value", undefined]);
    });
  });

  describe("And wrapped function throw an error", () => {
    it("Returns thrown error", () => {
      expect(returnException(fn)("error1")).toEqual([undefined, "error1"]);
    });
  });

  describe("And we pass exception checkers", () => {
    describe("And function throws checked exception", () => {
      it("Returns error", () => {
        expect(returnException(fn, [isError1, isError2])("error2")).toEqual([
          undefined,
          "error2",
        ]);
      });
    });

    describe("And function throws unchecked exception", () => {
      it("Throws error", () => {
        expect(() =>
          returnException(fn, [isError1, isError2])("error3")
        ).toThrow("error3");
      });
    });
  });
});
