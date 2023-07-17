import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

function toBase64(data: object) : string {
    return Buffer.from(JSON.stringify(data)).toString('base64')
}

function fromBase64(data: string) : object {
    return JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))
}


function cache(route) {
    const data = fetch(route).then(r => {
        return r.json();
    }).then(r => {
        redis.set(route, toBase64(r)).then(r => console.log(r));
        return r;
    });

    return data;
}

export async function fetchAndCache(route: string) {
    const rawData = await redis.get<string>(route) ?? "";
    if (rawData.length == 0) {
        return cache(route);
    }
    return fromBase64(rawData);
}