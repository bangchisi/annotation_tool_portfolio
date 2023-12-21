export function getFormattedDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}

export function getDifferenceDate(dateString: string) {
  const now = new Date();
  const targetDate = new Date(dateString);

  const timeDifference = now.getTime() - targetDate.getTime();

  if (timeDifference >= 24 * 60 * 60 * 1000) {
    const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    return `${days} days ago`;
  } else if (timeDifference >= 60 * 60 * 1000) {
    const hours = Math.floor(timeDifference / (60 * 60 * 1000));
    return `${hours} hours ago`;
  } else if (timeDifference >= 60 * 1000) {
    const minutes = Math.floor(timeDifference / (60 * 1000));
    return `${minutes} minutes ago`;
  } else {
    return 'now';
  }
}

export function secondsToHMS(secondsString?: string) {
  if (!secondsString) return '-';
  const totalSeconds = parseInt(secondsString, 10);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = totalSeconds - hours * 3600 - minutes * 60;

  const hoursFormat = hours.toString().padStart(2, '0');
  const minutesFormat = minutes.toString().padStart(2, '0');
  const secondsFormat = seconds.toString().padStart(2, '0');

  return `${hoursFormat}:${minutesFormat}:${secondsFormat}`;
}
