document.addEventListener('DOMContentLoaded', function () {
    try {
        forElementAll();
        //resize();
    } catch (e) {
        console.error(e);
    }
});

function forCheck(obj, info) {
    let div = obj.querySelectorAll('[n-if],[n-else]');
    for (let i = 0; i < div.length; i++) {
        let _if = div[i].getAttribute('n-if');
        let _else = div[i].getAttribute('n-else');
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
            if (name[i] == 'n-for') {
                obj.setAttribute('n-save', attr);
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
    let inside = obj.querySelectorAll('[n-save]');
    for (let i = 0; i < inside.length; i++) {
        inside[i].innerHTML = '';
    }
    inside = obj.querySelectorAll('[n-save]');
    for (let i = 0; i < inside.length; i++) {
        let name = inside[i].getAttribute('n-save');
        let inner = old.querySelector('[n-for="' + name + '"]').innerHTML;
        inside[i].innerHTML = inner;
        inside[i].removeAttribute('n-save');
    }
    return obj;
}

function forBox(obj) {
    let data = eval(obj.getAttribute('n-for'));
    for (let i in data) {
        let info = data[i];
        let copy = obj.cloneNode(true);
        copy = forCheck(copy, info);
        copy = forInner(copy, info);
        copy = forAttr(copy, info);
        copy = forChild(copy, info);
        copy = forSave(copy, obj, info);
        copy.removeAttribute('n-for');
        copy.removeAttribute('n-index');
        copy.removeAttribute('n-save');
        obj.parentNode.insertBefore(copy, obj);
    }
    obj.remove();
}

function forElement(name) {
    let box = document.querySelectorAll('[n-for="' + name + '"]');
    for (let i = 0; i < box.length; i++) {
        forBox(box[i]);
    }
}

function forElementAll() {
    for (let n = 1; n < 10; n++) {
        let box = document.querySelectorAll('[n-index="' + n + '"]');
        for (let i = 0; i < box.length; i++) {
            forBox(box[i]);
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