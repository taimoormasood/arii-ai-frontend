export function formatText(text: string): string {
  

  return text
    ?.replace(/[_-]/g, " ") // Replaces both _ and -
    ?.split(" ")
    ?.map(
      (word) => word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase()
    )
    ?.join(" ");
}

export function convertMinutesToHours(minutes: number): string {
  if (minutes >= 60) {
    const hours = minutes / 60;

    return `${hours} hours`;
  } else {
    return `${minutes} minutes`;
  }
}
