function timeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) {
        return `${days} ${days === 1 ? "Day" : "Days"} ago`;
    }

    if (hours > 0) {
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    if (minutes > 0) {
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }

    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
}

export default timeAgo;