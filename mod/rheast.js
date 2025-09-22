// StaticRender - Rheast.js

class RHEast {
    constructor() {
        this.name = 'StaticRender';
        this.time = 'Sep 18, 2025';
        this.version = `v${1.9}`;
        this.virtual = [];
        this.forStyle();
        console.log(this.name, this.version, 'Rheast.js');
        document.addEventListener('DOMContentLoaded', () => {
            this.forRender();
            this.forLoad();
        });
    }

    forLoad() {
        Array.from(document.querySelectorAll('[_data]')).forEach(div => {
            fetch(div.getAttribute('_data')).then(response => {
                return response.json();
            }).then(data => {
                let handle = div.getAttribute('_handle');
                if (handle && typeof window[handle] === 'function') {
                    data = window[handle](data) || data;
                }
                this.forRender(div, data);
                Array.from(document.querySelectorAll('[_load]')).forEach(item => {
                    this.forComponent(item, data);
                });
            }).catch(error => console.error(error));
        });
    }

    forComponent(div, data) {
        div = this.div(div);
        fetch(div.getAttribute('_load')).then(response => {
            return response.text();
        }).then(text => {
            div.innerHTML = text;
            this.forRender(div, data);
            div.removeAttribute('_load');
        }).catch(error => console.error(error));
    }

    forRender(div, data) {
        div = this.div(div);
        div = div || document.querySelector('body');
        let box = Array.from(div.querySelectorAll('[_for]')).filter(
            element => !Array.from(div.querySelectorAll('[_for] [_for],[_bind] [_for]')).includes(element)
        );
        Array.from(box).forEach(item => { this.forClone(item, data) });
    }

    forClone(div, data) {
        div = this.div(div);
        switch (true) {
            case !div: {
                return false;
            }
            case div.hasAttribute('_for'): {
                return this.forLoop(div, data);
            }
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
                    let j = JSON.parse(target.replaceAll("'", '"'));
                    return (typeof data === 'object' && Array.isArray(j)) ? j.map(e => ({ ...data, _this: e })) : j;
                case data && target in data:
                    return data[target];
                case Array.isArray(data):
                    return data;
                case target in window:
                    return window[target];
                default:
                    return data;
            }
        } catch (error) {
            console.error(error);
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

    forStyle() {
        let style = document.createElement('style');
        style.textContent = '[_for]{visibility:hidden;}';
        document.querySelector('head').appendChild(style);
    }

    div(div) {
        return typeof div === 'string' ? document.querySelector(div) : div;
    }

    href(name) {
        return new URL(window.location.href).searchParams.get(name);
    }

    resize() {
        window.addEventListener('resize', () => location.reload());
    }
}

const rheast = new RHEast();