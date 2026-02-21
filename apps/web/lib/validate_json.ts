export function isJsonValid(val: string){
    try{
        JSON.parse(val);
        return true;
    }
    catch{
        return false;
    }
}