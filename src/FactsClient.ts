export async function getRandomFact(language: string): Promise<FactClientResponse> {
    const url = `${URL_RANDOM_FACT}?language=${language}`;
    return getFact(url);
}

export async function getTodayFact(language: string): Promise<FactClientResponse> {
    const url = `${URL_TODAY_FACT}?language=${language}`;
    return getFact(url);
}

const URL_RANDOM_FACT = "https://uselessfacts.jsph.pl/random.json";
const URL_TODAY_FACT = "https://uselessfacts.jsph.pl/today.json";

async function getFact(url: string): Promise<FactClientResponse> {
    const apiResponse = await fetch(url);
    const body = await apiResponse.text();

    let clientResponse: FactClientResponse = {
        status: apiResponse.status,
        json: null,
    };

    if (!apiResponse.ok) {
        console.error(body);
        return clientResponse;
    }

    clientResponse.json = JSON.parse(body) as FactResponse;
    return clientResponse;
}

interface FactResponse {
    id: string;
    text: string;
    source: string;
    source_url: string;
    language: string;
    permalink: string;
}

export interface FactClientResponse {
    status: number;
    json: FactResponse | null;
}
