/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type DictStrAny = Record<string, any>;

export interface ExecuteRequest {
  input_text?: string;
  name_of_model?: string;
  pick_model_for_visualisation?: string;
  pick_model_for_summary?: string;
  pick_model_for_ai_chat?: string;
  pick_model_for_message_type_checker?: string;
  repeat_if_fails?: number;
  free_chat?: boolean;
  use_chat_context_for_sql?: boolean;
  use_chat_context_for_summary?: boolean;
  include_sql_in_chat_context?: boolean;
  include_data_in_chat_context?: boolean;
  history_range_for_context?: number;
  how_many_rows_of_data_should_be_saved_to_message_objects?: number;
  do_not_save_to_chat_history?: boolean;
  return_mock_data?: boolean;
  enable_rag_optimization?: boolean;
  passcode?: string;
}

export interface VisualizeRequest {
  data?: string;
  query?: string;
  background?: string;
  visualization_guide?: string;
  message_id?: number;
}

export interface ChatMetaData {
  chat_name?: string;
  creation?: string;
  attached_db_name?: string;
}

export interface HistoryMessage {
  user_id?: number;
  user_name?: string;
  user_type?: string;
  id?: number;
  message?: string;
  message_type?: string;
  /** @format date-time */
  timestamp?: string;
  sql?: string;
  sql_result?: string;
  visual_code?: string;
  visual_code_mini?: string;
}

export interface UsageCost {
  query_creation_cost?: number;
  visualization_cost?: number;
}

export interface UserData {
  user_id?: string;
  name?: string;
  email?: string;
  /** @format date-time */
  created_at?: string;
  preferences?: {
    language?: string;
    theme?: string;
  };
  IAM?: {
    allowed_models?: string[];
    allowed_actions?: string[];
    credit_limit?: number;
  };
}

export interface ModelsDataResponse {
  models?: string[];
  defaults?: {
    default_model_for_query_generation: string;
    default_model_for_ai_chat: string;
    default_model_for_summary: string;
    default_model_for_visualisation: string;
    default_model_for_message_type_checker: string;
  };
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://www.budgety.ai";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(
      typeof value === "number" ? value : `${value}`
    )}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key]
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key)
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${
        queryString ? `?${queryString}` : ""
      }`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      }
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title FastAPI Application
 * @version 1.0.0
 * @baseUrl https://www.budgety.ai
 *
 * API for LLMQueryExecutor and LLMVisualisationManager functionality, with user management.
 */
export class Api<
  SecurityDataType extends unknown
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags info
     * @name InfoModelsList
     * @summary Retrieve model data from the YAML file.
     * @request GET:/api/info/models
     */
    infoModelsList: (params: RequestParams = {}) =>
      this.request<
        {
          /** List of available model names. */
          models?: string[];
          /** Default models for each functionality. */
          defaults?: Record<string, string>;
        },
        {
          detail?: string;
        }
      >({
        path: `/api/info/models`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name VisualizeCreate
     * @summary Generate visualizations based on provided data.
     * @request POST:/api/visualize
     * @secure
     */
    visualizeCreate: (data: VisualizeRequest, params: RequestParams = {}) =>
      this.request<
        string,
        {
          detail?: string;
        }
      >({
        path: `/api/visualize`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name ExecuteCreate
     * @summary Executes LLM query and returns results, SQL query, and error (if any).
     * @request POST:/api/execute
     * @secure
     */
    executeCreate: (data: ExecuteRequest, params: RequestParams = {}) =>
      this.request<
        {
          llm_request_success?: boolean;
          answer?: DictStrAny[] | null;
          sql?: string;
          error?: string;
          message_id?: number;
          message_type?: string;
          model_rejection_popup_message?: string;
          usage?: {
            /** Number of input tokens used. */
            input_tokens?: number;
            /** Number of output tokens generated. */
            output_tokens?: number;
            /** The model used for the LLM query. */
            model?: string;
            /** Total number of tokens used. */
            total_tokens?: number;
            /**
             * Total cost for the query execution.
             * @format float
             */
            total_cost?: number;
          };
        },
        any
      >({
        path: `/api/execute`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat
     * @name ChatMetaList
     * @summary Retrieve the list of historical messages.
     * @request GET:/api/chat/meta
     * @secure
     */
    chatMetaList: (params: RequestParams = {}) =>
      this.request<
        ChatMetaData,
        {
          detail?: string;
        }
      >({
        path: `/api/chat/meta`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat
     * @name ChatHistoryList
     * @summary Retrieve the list of historical messages.
     * @request GET:/api/chat/history
     * @secure
     */
    chatHistoryList: (params: RequestParams = {}) =>
      this.request<
        HistoryMessage[],
        {
          detail?: string;
        }
      >({
        path: `/api/chat/history`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat
     * @name ChatHistoryCreate
     * @summary Add a new message to the history.
     * @request POST:/api/chat/history
     * @secure
     */
    chatHistoryCreate: (data: HistoryMessage, params: RequestParams = {}) =>
      this.request<
        {
          status?: string;
          message?: string;
        },
        {
          detail?: string;
        }
      >({
        path: `/api/chat/history`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags info
     * @name UsageList
     * @summary Get total cost, query creation cost, and visualization cost.
     * @request GET:/api/usage
     */
    usageList: (params: RequestParams = {}) =>
      this.request<
        {
          query_creation_cost?: number;
          visualization_cost?: number;
          total_cost?: number;
        },
        {
          detail?: string;
        }
      >({
        path: `/api/usage`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserDetail
     * @summary Get user data by user_id.
     * @request GET:/api/user/{user_id}
     * @secure
     */
    userDetail: (userId: string, params: RequestParams = {}) =>
      this.request<
        UserData,
        {
          detail?: string;
        }
      >({
        path: `/api/user/${userId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserUpdate
     * @summary Update user data by user_id.
     * @request PUT:/api/user/{user_id}
     * @secure
     */
    userUpdate: (userId: string, data: UserData, params: RequestParams = {}) =>
      this.request<
        UserData,
        {
          detail?: string;
        }
      >({
        path: `/api/user/${userId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCreate
     * @summary Create a new user.
     * @request POST:/api/user
     * @secure
     */
    userCreate: (data: UserData, params: RequestParams = {}) =>
      this.request<
        UserData,
        {
          detail?: string;
        }
      >({
        path: `/api/user`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
