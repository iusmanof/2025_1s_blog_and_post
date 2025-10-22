export enum resultStatus {
    SUCCESS = 'success',
    ERROR = 'error',
}

type ExtensionType = {
    field: string | null;
    message: string;
};

export type ResultObject<T = null> = {
    status: resultStatus;
    errorMessages?: string;
    extensions: ExtensionType[];
    data: T;
};