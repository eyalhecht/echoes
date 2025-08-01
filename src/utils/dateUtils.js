import { format, formatDistanceToNowStrict, isToday, isYesterday } from 'date-fns';

export const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    let date;
    if (timestamp instanceof Date) {
        date = timestamp;
    } else if (timestamp._seconds) {
        // Firebase timestamp
        date = new Date(timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000);
    } else {
        date = new Date(timestamp);
    }

    const now = new Date();
    if (isToday(date)) {
        return formatDistanceToNowStrict(date, { addSuffix: true });
    } else if (isYesterday(date)) {
        return `Yesterday at ${format(date, 'h:mm a')}`;
    } else if (Math.abs(date.getTime() - now.getTime()) < 7 * 24 * 60 * 60 * 1000) {
        return format(date, 'EEEE \'at\' h:mm a');
    } else {
        return format(date, 'MMM dd, yyyy');
    }
};

export const formatCommentTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    return formatTimestamp(timestamp);
};