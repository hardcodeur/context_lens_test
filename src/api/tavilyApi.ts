import { tavily } from "@tavily/core"
import dotenv from "dotenv"

dotenv.config();

async function searchWithTavily(q: string) {
    const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
    try {
        const response = await tvly.search(q);
        return parseTavilyToGraphResponse(response);   
    } catch (error) {
        console.error(error);
    }
    
}

function parseTavilyToGraphResponse(response: any){

    return {
        main_node: {
            id : 0,
            label : response.query
        },
        nodes: response.results.map((result: any,i: number) => ({
            id : i+1 ,
            label: result.title,
            url: result.url,
            content : result.content
        }))
    }
}

export { searchWithTavily }  