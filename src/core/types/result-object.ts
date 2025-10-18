export enum ResultStatus {
    SUCCESS = 'success',
    ERROR = 'error',
}

type ExtensionType = {
    field: string | null;
    message: string;
};

export type ResultObject<T = null> = {
    status: ResultStatus;
    errorMessages?: string;
    extensions: ExtensionType[];
    data: T;
};