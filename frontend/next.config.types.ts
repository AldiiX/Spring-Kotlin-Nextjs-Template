export type WebpackRule = {
    oneOf?: WebpackRule[];
    rules?: WebpackRule[];
    use?: WebpackUse;
};

export type WebpackUse =
    | WebpackLoader
    | WebpackLoader[]
    | ((...args: unknown[]) => WebpackLoader | WebpackLoader[]);

export type WebpackLoader = {
    loader?: string;
    options?: {
        modules?: {
            getLocalIdent?: (
                context: { resourcePath: string },
                localIdentName: string,
                localName: string,
            ) => string;
        };
    };
};