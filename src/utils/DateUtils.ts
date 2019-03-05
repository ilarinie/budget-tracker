export const lastPayDate = (payDate: number): Date => {
    const date = new Date();
    if ( date.getDate() < payDate ) {
        date.setMonth(date.getMonth() - 1);
    }
    date.setDate(payDate);
    return date;
} 