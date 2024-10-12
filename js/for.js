document.addEventListener('DOMContentLoaded', function () {
    try {
        setMigrate();
        setElementAll();
        forElementAll();
        //resize();
    } catch (e) {
        console.error(e);
    }
});

function forCheck(obj, info) {
    let div = obj.querySelectorAll('[_if],[_else]');
    for (let i = 0; i < div.length; i++) {
        let _if = div[i].getAttribute('_if');
        let _else = div[i].getAttribute('_else');
        if ((_if && !info[_if]) || (_else && info[_else])) {
            div[i].remove();
        }
    }
    return obj;
}

function forInner(obj, info) {
    let match = getBrackets(obj);
    for (let i in match) {
        let a = '{' + match[i] + '}';
        let b = info[match[i]];
        if (!b) {
            b = '';
        }
        if (typeof obj === 'string') {
            obj = obj.replace(a, b);
        } else {
            b = String(b).replaceAll('\n', '<br/>');
            obj.innerHTML = obj.innerHTML.replaceAll(a, b);
        }
    }
    return obj;
}

function forAttr(obj, info) {
    let name = obj.getAttributeNames();
    for (let i in name) {
        let attr = obj.getAttribute(name[i]);
        if (attr) {
            let text = forInner(String(attr), info);
            if (name[i] == '_for') {
                obj.setAttribute('_save', attr);
            }
            if (text != attr) {
                if (text.length > 0) {
                    obj.setAttribute(name[i], text);
                } else {
                    obj.removeAttribute(name[i]);
                }
            }
        }
    }
    return obj;
}

function forChild(obj, info) {
    let child = obj.querySelectorAll('*');
    for (let i = 0; i < child.length; i++) {
        child[i] = forAttr(child[i], info);
    }
    return obj;
}

function forSave(obj, old) {
    let inside = obj.querySelectorAll('[_save]');
    for (let i = 0; i < inside.length; i++) {
        inside[i].innerHTML = '';
    }
    inside = obj.querySelectorAll('[_save]');
    for (let i = 0; i < inside.length; i++) {
        let name = inside[i].getAttribute('_save');
        let inner = old.querySelector('[_for="' + name + '"]').innerHTML;
        inside[i].innerHTML = inner;
        inside[i].removeAttribute('_save');
    }
    return obj;
}

function forBox(obj) {
    let data = eval(forName(obj));
    for (let i in data) {
        let info = data[i];
        let copy = obj.cloneNode(true);
        copy = forCheck(copy, info);
        copy = forInner(copy, info);
        copy = forAttr(copy, info);
        copy = forChild(copy, info);
        copy = forSave(copy, obj, info);
        copy = forClean(copy);
        copy = forCount(copy, i);
        obj.parentNode.insertBefore(copy, obj);
    }
    obj.remove();
}

function forName(obj) {
    let name = obj.getAttribute('_for');
    let count = obj.getAttribute('_count');
    if (count) {
        count = count.split(',');
    }
    for (let i in count) {
        name = name.replace('|' + i + '|', count[i]);
    }
    return name;
}

function forCount(obj, index) {
    let box = obj.querySelectorAll('[_for]');
    for (let i = 0; i < box.length; i++) {
        let e = box[i].getAttribute('_count');
        if (!e) {
            e = '';
        }
        box[i].setAttribute('_count', e + index + ',');
    }
    return obj;
}

function forClean(obj) {
    let attr = ['_for', '_i', '_index', '_save', '_count'];
    for (let i in attr) {
        obj.removeAttribute(attr[i]);
    }
    return obj;
}

function forClean(obj) {
    let attr = ['for', 'i', 'index', 'save', 'count'];
    for (let a in attr) {
        obj.removeAttribute('_' + attr[a]);
    }
    return obj;
}

function forElement(name) {
    let box = document.querySelectorAll('[_for="' + name + '"]');
    for (let i = 0; i < box.length; i++) {
        forBox(box[i]);
    }
}

function setElementAll() {
    let name = ''
    for (let n = 1; n < 10; n++) {
        name += '[_for] ';
        let box = document.querySelectorAll(name);
        for (let i = 0; i < box.length; i++) {
            let index = box[i].getAttribute('_index');
            if (!index) {
                index = n;
            }
            box[i].setAttribute('_i', index);
        }
    }
}

function setMigrate() {
    let tag = ['n-', 'v-'];
    let attr = ['for', 'i', 'index', 'save', 'count', 'if', 'else'];
    for (let t in tag) {
        for (let a in attr) {
            let box = document.querySelectorAll('[' + tag[t] + attr[a] + ']');
            for (let i = 0; i < box.length; i++) {
                box[i].setAttribute('_' + attr[a], box[i].getAttribute(tag[t] + attr[a]));
                box[i].removeAttribute(tag[t] + attr[a]);
            }
        }
    }
}

function forElementAll() {
    for (let n = 0; n < 100; n++) {
        let box = document.querySelectorAll('[_i="' + n + '"]');
        for (let i = 0; i < box.length; i++) {
            forBox(box[i]);
        }
        if (document.querySelectorAll('[_for]').length == 0) {
            break;
        }
    }
}

function getBrackets(txt) {
    let rule = /(?<=\{).*?(?=\})/g;
    let match;

    if (typeof (txt) == typeof ('N')) {
        match = txt.match(rule);
    } else if (typeof (txt) == typeof (document.createElement('div'))) {
        match = txt.textContent.match(rule);
    }

    return match;
}

function resize() {
    if (window.addEventListener) {
        window.addEventListener("resize", function () {
            location.reload();
        });
    } else if (window.attachEvent) {
        window.attachEvent("onresize", function () {
            location.reload();
        });
    }
}

function getLink(name) {
    let myLink = new URL(window.location.href);
    return myLink.searchParams.get(name);
}

function changeClass(obj, index, name) {
    if (typeof obj == 'string') {
        obj = document.querySelectorAll(obj);
    }

    for (let i = 0; i < obj.length; i++) {
        if (i == index) {
            obj[i].classList.add(name);
        } else {
            obj[i].classList.remove(name);
        }
    }
}

function changeShow(obj) {
    let name = 'none';
    if (typeof obj == 'string') {
        obj = document.querySelector(obj);
    }
    if (obj.style.display == 'none') {
        name = '';
    }
    obj.style.display = name;
}