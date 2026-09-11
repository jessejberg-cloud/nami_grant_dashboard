import {env} from 'cloudflare:workers';
export function database(){if(!env.DB)throw Error('The record store is unavailable. Please try again later.');return env.DB;}
