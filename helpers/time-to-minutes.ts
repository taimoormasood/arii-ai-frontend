export const timeToMinutes = (timeStr: string) => {
  const [time, period] = timeStr.split(" ");
  const [hours, minutes] = time.split(":").map(Number);

  let totalMinutes = hours * 60 + minutes;

  if (period === "AM" && hours === 12) {
    totalMinutes -= 12 * 60; // 12 AM should be 0
  } else if (period === "PM" && hours !== 12) {
    totalMinutes += 12 * 60; // Add 12 hours for PM except 12 PM
  }

  return totalMinutes;
};
