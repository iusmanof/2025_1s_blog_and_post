import { Request } from "express";

export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestWithQuery<T> = Request<{}, {}, {}, T>;
export type RequestWithParams<T> = Request<T>;
export type RequestWithParamsAndQuery<T, Q> = Request<T,{},{}, Q>;
export type RequestWithParamsAndBody<T, V> = Request<T, {}, V>;
