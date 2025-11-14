export enum resultStatus {
  SUCCESS = "success",
  ERROR = "error",
  NOT_FOUND = "not-found",
  EXISTS = "exists",
  BAD_REQUEST = "bag-request",
  CODE_EXPIRED = "code-expired",
  UNAUTORIZED = "unauthorized",
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
