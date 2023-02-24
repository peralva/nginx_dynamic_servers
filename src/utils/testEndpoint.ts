export default async ({
    url,
    method,
    body
}: {
    url: string,
    method: string,
    body: object
}): Promise<boolean> => {
    const resultFetch: Response = await fetch(
        url,
        {
            method,
            body: JSON.stringify(body),
        }
    );

    return (true
        && resultFetch.status >= 200
        && resultFetch.status <= 299
    );
};