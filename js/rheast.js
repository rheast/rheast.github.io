// StaticRender - Rheast.js

class RHEast {
    constructor() {
        this.name = 'StaticRender';
        this.time = 'Jan 15, 2025';
        this.version = `v${1.07}`;
        this.virtual = [];
        this.forStyle();
        console.log(this.name, this.version, 'Rheast.js');
        document.addEventListener('DOMContentLoaded', () => {
            this.forLoad();
        });
    }

    forStyle() {
        let style = document.createElement('style');
        style.textContent = '[_for]{visibility:hidden;}[_keep]{display:none;}';
        document.querySelector('head').appendChild(style);
    }

    forLoad() {
        const box = Array.from(document.querySelectorAll('[_for]')).filter(
            element => !Array.from(document.querySelectorAll('[_for] [_for],[_bind] [_for]')).includes(element)
        );
        Array.from(box).forEach(item => { this.forClone(item) });
    }

    forClone(div, data) {
        div = typeof div === 'string' ? document.querySelector(div) : div;
        switch (true) {
            case !div: {
                return false;
            }
            case div.hasAttribute('_bind'): {
                return this.forBind(div, data);
            }
            case div.hasAttribute('_for'): {
                return this.forLoop(div, data);
            }
        }
    }

    forBind(div, data, clone = false) {
        if (div.dataset.virtual) {
            clone = document.createElement('div');
            clone.innerHTML = this.virtual[div.dataset.virtual];
            clone = clone.firstElementChild;
        } else {
            div.dataset.virtual = this.virtual.length;
            this.virtual.push(div.outerHTML);
            clone = div;
        }
        this.forReplace(clone, data);
        this.forRetard(clone);
        if (div.outerHTML != clone.outerHTML) {
            div.outerHTML = clone.outerHTML;
        }
    }

    forLoop(div, data) {
        data = this.forData(div, data);
        if (data && Array.isArray(data)) {
            data.forEach((item, index) => {
                let clone = div.cloneNode(true);
                clone.removeAttribute('_for');
                this.forReplace(clone, this.forValue(item, index));
                this.forRetard(clone);
                if (!clone.hasAttribute('_retard')) {
                    div.parentNode.insertBefore(clone, div);
                }
            });
            div.remove();
        }
    }

    forData(div, data) {
        try {
            const target = div.getAttribute('_for');
            switch (true) {
                case !target:
                    return data;
                case /^\[.*\]$|^\{.*\}$/.test(target):
                    return JSON.parse(target);
                case data && target in data:
                    return data[target];
                case Array.isArray(data):
                    return data;
                case target in window:
                    return window[target];
                default:
                    return data;
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    forValue(data, index) {
        data = typeof data === 'object' ? data : { _this: data, _value: data };
        data._index = index;
        return data;
    }

    forReplace(div, data) {
        Array.from(div.attributes).forEach(attr => {
            switch (true) {
                case ['_for', '_bind'].includes(attr.name): {
                    break;
                }
                case ['_if', '_else'].includes(attr.name): {
                    let value = data[attr.value];
                    value = (typeof value === 'number' || value);
                    if ((attr.name === '_if' && value) || (attr.name === '_else' && !value)) {
                        div.removeAttribute(attr.name);
                    } else {
                        div.setAttribute('_retard', true);
                    }
                    break;
                }
                default: {
                    attr.value = this.forBrackets(attr.value, data);
                    if (attr.name.startsWith('_')) {
                        let name = attr.name.slice(1);
                        let value = div.getAttribute(name) || '';
                        div.setAttribute(name, value + attr.value);
                        div.removeAttribute(attr.name);
                    }
                    break;
                }
            }
        });
        Array.from(div.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                node.nodeValue = this.forBrackets(node.nodeValue, data);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                node.getAttribute('_for') ? this.forClone(node, data) : this.forReplace(node, data);
            }
        });
    }

    forRetard(div) {
        div.querySelectorAll('[_retard]').forEach(item => item.remove());
    }

    forBrackets(value, data) {
        return value.replace(/{(.*?)}/g, (_, key) => data[key] === 0 ? '0' : (data[key] ? String(data[key]) : ''));
    }

    get(url, process) {
        fetch(url).then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(data => {
            process(data);
        }).catch(error => {
            console.error(error);
        });
    }

    href(name) {
        return new URL(window.location.href).searchParams.get(name);
    }

    resize() {
        window.addEventListener('resize', () => location.reload());
    }
}

const rheast = new RHEast();