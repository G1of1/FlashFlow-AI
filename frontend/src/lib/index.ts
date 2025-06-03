//Logic for the dates
export const formatDate = (date: any) => {
    const currentDate: any = new Date();
    const productDate: any = new Date(date);

    const timeDiffSeconds = Math.floor((currentDate - productDate) / 1000);
    const timeDiffMinutes = Math.floor(timeDiffSeconds / 60);
    const timeDiffHours = Math.floor(timeDiffMinutes / 60);
    const timeDiffDays = Math.floor(timeDiffHours / 24);

    if(timeDiffDays > 1) {
        return productDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric'});
    }
    else if(timeDiffDays === 1) {
        return '1d ago';
    }
    else if(timeDiffHours > 1) {
        return `${timeDiffHours}h ago`;
    }
    else if(timeDiffMinutes >= 1) {
        return `${timeDiffMinutes}m ago`;
    }
    else{
        return `${timeDiffSeconds}s ago`;
    }

}
export const MemberSince = (date: any) => {
    const thedate = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[thedate.getMonth()];
    const year = thedate.getFullYear();
    return `Joined Flashflow since: ${month} ${year}`;
}