export const dateToString = (d: any, spliter = "-"): string => {
  const date = new Date(d);

  return (
    date.getDate() +
    `${spliter}` +
    (date.getMonth() + 1) +
    `${spliter}` +
    date.getFullYear()
  );
};
