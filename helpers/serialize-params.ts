type ParamValue =
  | string
  | number
  | boolean
  | Array<string | number | boolean>
  | null
  | undefined;

export const serializeParams = (params: Record<string, ParamValue>): string => {
  const query = Object.entries(params)
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(
          (v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`
        );
      }
      if (value !== undefined && value !== null) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }

      return [];
    })
    .join("&");

  return query;
};
