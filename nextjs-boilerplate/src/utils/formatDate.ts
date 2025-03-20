/**
 * Formats a date into a readable string
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns A formatted date string
 */
export function formatDate(date: Date | string, locale: string = 'en-US'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Returns a relative time string (e.g., "2 hours ago", "yesterday")
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns A relative time string
 */
export function getRelativeTimeString(date: Date | string, locale: string = 'en-US'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  } else if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour');
  } else if (diffInDays < 30) {
    return rtf.format(-diffInDays, 'day');
  } else {
    return formatDate(dateObj, locale);
  }
}
