export const formatDate = (
  dateString: string,
  format: "short" | "long" | "time" = "short"
): string => {
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  switch (format) {
    case "short":
      options.month = "short";
      options.hour = undefined;
      options.minute = undefined;
      options.second = undefined;
      break;
    case "time":
      options.year = undefined;
      options.month = undefined;
      options.day = undefined;
      break;
    // 'long' will use all options as defined above
  }

  return new Intl.DateTimeFormat("en-GB", options).format(date);
};

// Usage examples:
// console.log(formatDate('2024-12-27T08:26:49.220Z')); // Output: 27 Dec 2024
// console.log(formatDate('2024-12-27T08:26:49.220Z', 'long')); // Output: 27 December 2024, 08:26:49
// console.log(formatDate('2024-12-27T08:26:49.220Z', 'time')); // Output: 08:26:49
