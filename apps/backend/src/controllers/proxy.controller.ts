import { Context } from "hono";


export const proxyController = async (c: Context) => {
    // TODO: 1. Extract subdomain:  
    // from host https://weather.quantumapi.com extract "weather" this 
    // will be unique slug in unique in the Api table
    // For now hardcoding it
    // const api_slug = 
}