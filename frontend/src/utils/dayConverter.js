

function getPostedDays(item)
{
    let createdAt = new Date(item);
    let date = new Date();
    let timeDifference = date - createdAt;

    let val = Math.floor(timeDifference/(1000*24*60*60));

    if(val == 0)
    {
        return "Today"
    }
    if(val ==1)
    {
        return `${val} day ago`
    }
    else if(val >30) {
        return `30+ days ago`
    }else {
        return `${val} days ago`
    }
}

export default getPostedDays;