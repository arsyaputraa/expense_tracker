import type { z } from "zod";

export function getZodSafeParseError<T>(error: z.ZodError<T> | undefined) {
  if (!error) return "";
  let errorMsg = "[ZOD VALIDATION ERROR] - ";

  error.issues.forEach((item) => {
    item.path.forEach((path) => {
      errorMsg = errorMsg + `${path} : ${item.message}, `;
    });
  });
  return errorMsg;
}
