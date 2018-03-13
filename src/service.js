import fetch from 'node-fetch';

export function getRandomString() {
    return Math.random().toString(36).substr(2) + new Date().getTime();
}

export function post(url, data = {}, headers = { 'Content-Type': 'application/json' }) {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers,
        credentials: 'include',
    }).then(res => res.json()).catch((err) => { throw new Error('网络错误', err); });
}

export function get(url, headers) {
    return fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include',
    }).then(res => res.json()).catch((err) => { throw new Error('网络错误', err); });
}
