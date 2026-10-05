import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {handle} from '@/lib/service';
async function route(request:Request){const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in to access your private evaluator workspace.'},{status:401});if(!env.DB)return Response.json({error:'Storage unavailable.'},{status:503});return handle(request,env.DB,user)}
export const GET=route;export const POST=route;
