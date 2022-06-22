export function checkResponseOk(response: Response): void {
  if (!response.ok)
    throw new Error(`Something went wrong. Response status:${response.status}`);
}
