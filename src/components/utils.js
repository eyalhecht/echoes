import {format, formatDistanceToNowStrict, isToday, isYesterday} from "date-fns";

export const formatFirebaseTimestamp = (firebaseTimestamp) => {
    if (!firebaseTimestamp || typeof firebaseTimestamp._seconds !== 'number') {
        return 'Invalid Date';
    }
    const date = new Date(firebaseTimestamp._seconds * 1000 + firebaseTimestamp._nanoseconds / 1000000);
    const now = new Date();
    if (isToday(date)) {
        return formatDistanceToNowStrict(date, { addSuffix: true });
    } else if (isYesterday(date)) {
        return `Yesterday at ${format(date, 'h:mm a')}`;
    } else if (Math.abs(date.getTime() - now.getTime()) < 7 * 24 * 60 * 60 * 1000) {
        return format(date, 'EEEE \'at\' h:mm a'); // E.g., "Monday at 10:00 AM"
    } else {
        return format(date, 'MMM dd, yyyy'); // E.g., "Jul 15, 2025"
    }
};
