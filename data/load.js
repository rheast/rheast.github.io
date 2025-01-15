fetch('data/data.json').then(response => {
    if (response.ok) {
        return response.json();
    }
}).then(data => {
    data.myData.forEach(item => {
        item.data.reverse().forEach(entry => {
            entry.link = entry.data[0].link;
            if (entry.value == rheast.name) {
                entry.value += ` ${rheast.version}`;
                entry.time = rheast.time;
            }
        });
    });
    for (let i in data) {
        rheast.forClone(`[_for="${i}"]`, data[i]);
    }
}).catch(error => {
    console.error(error);
});