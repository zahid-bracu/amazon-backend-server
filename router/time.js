function getTimes(){
    var d = new Date();
    const year=d.getFullYear();
    const month=d.getMonth();
    const date=d.getUTCDate();
    const hour=d.getHours();
    const minute=d.getUTCMinutes();
    const second=d.getUTCSeconds();
    const time=date+"/"+month+"/"+year+"||"+hour+":"+minute+":"+second;
    return time;
}

module.exports={getTimes};