// StaticRender v1.04 - Rheast.js

class RHEast {
    constructor() {
        this.forStyle();
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
            element => !Array.from(document.querySelectorAll('[_for] [_for]')).includes(element)
        );
        Array.from(box).forEach(item => { this.forClone(item) });
    }

    forClone(div, data) {
        div = typeof div === 'string' ? document.querySelector(div) : div;
        data = this.forData(div, data);
        if (!div || !data || !Array.isArray(data)) { return false };
        data.forEach((item, index) => {
            let clone = div.cloneNode(true);
            clone.removeAttribute('_for');
            this.forReplace(clone, this.forValue(item, index), index);
            if (!clone.hasAttribute('_retard')) {
                clone.querySelectorAll('[_retard]').forEach(item => item.remove());
                div.parentNode.insertBefore(clone, div);
            }
        });
        if (!div.hasAttribute('_keep')) { div.remove() };
    }

    forData(div, data) {
        try {
            let target = div.getAttribute('_for');
            if (!target) { return data };
            if (/^\[.*\]$|^\{.*\}$/.test(target)) { return JSON.parse(target) };
            if (data && target in data) { return data[target] };
            if (target in window) { return window[target] };
            return data;
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
            if (['_if', '_else'].includes(attr.name)) {
                let value = data[attr.value];
                value = (typeof value === 'number' || value);
                if ((attr.name === '_if' && value) || (attr.name === '_else' && !value)) {
                    div.removeAttribute(attr.name);
                } else {
                    div.setAttribute('_retard', true);
                }
            } else {
                attr.value = this.forBrackets(attr.value, data);
                if (attr.name.startsWith('_')) {
                    const name = attr.name.slice(1);
                    let value = div.getAttribute(name) || '';
                    div.setAttribute(name, value + attr.value);
                    div.removeAttribute(attr.name);
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

    forBrackets(value, data) {
        return value.replace(/{(.*?)}/g, (_, key) => String(data[key] || ''));
    }

    href(name) {
        return new URL(window.location.href).searchParams.get(name);
    }

    resize() {
        window.addEventListener('resize', () => location.reload());
    }
}

const rheast = new RHEast();