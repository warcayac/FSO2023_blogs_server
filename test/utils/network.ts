import { app } from "../../src";
import { TJMap } from "../../src/@warcayac/types-common";


const SERVER_URL = `${app.server?.hostname}:${app.server?.port}`

export const http = {
  get: async (path: string) : Promise<Response> => {
    const req = new Request(
      `${SERVER_URL}${path}`
    );
    return app.fetch(req);
  },

  post: async (path: string, body: TJMap, headers: TJMap = {}) : Promise<Response> => {
    const req = new Request(
      `${SERVER_URL}${path}`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body),
      },
    );
    return app.fetch(req);
  },

  delete: async (path: string, headers?: HeadersInit) : Promise<Response> => {
    const req = new Request(
      `${SERVER_URL}${path}`, 
      { 
        method: 'DELETE',
        headers,
      },
    );
    return app.fetch(req);
  },

  patch: async (path: string, body: TJMap, headers: TJMap = {}) : Promise<Response> => {
    const req = new Request(
      `${SERVER_URL}${path}`, 
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body),
      },
    );
    return app.fetch(req);
  },
};

/// Returns the data from a Response object, we assume that "data" exists in the JSON object
export async function extractData<T = TJMap>(r: Response) : Promise<T[]> {
  const json = await r.json() as TJMap;
  return json.data as T[];
}
