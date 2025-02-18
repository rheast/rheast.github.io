var myVersion = data => {
    data.myData.forEach(item => {
        item.data.reverse().forEach(entry => {
            entry.link = entry.data[0].link;
            if (entry.value == rheast.name) {
                entry.value += " " + rheast.version;
                entry.time = rheast.time;
            }
        });
    });
}