export interface HeadersRequest {
    ua: string;
    browser: {
        name?: string,
        version?: string,
        major?: string
    },
    engine: {
        name?: string,
        version?: string
    },
    os: {
        name?: string,
        version?: string
    },
    device: {},
    cpu: {
        architecture?: string
    }
}