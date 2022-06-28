export function getCleanIdAndSource(
  id: string,
  prefix: string,
  splitter: string
): IIdAndSource | null {
  const prefixLength = prefix.length;
  const result = id.slice(prefixLength).split(splitter);

  if (result.length === 2) {
    return {
      source: result[0],
      id: result[1],
    };
  }

  return;
}

interface IIdAndSource {
  source: string;
  id: string;
}
