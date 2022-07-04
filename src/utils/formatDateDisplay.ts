export const formatDateDisplay = (stringDate: Date | undefined) => {
  if (stringDate) {
    return new Intl.DateTimeFormat("en-NZ", { dateStyle: "full" }).format(new Date(stringDate));
  }

  return null;
};
