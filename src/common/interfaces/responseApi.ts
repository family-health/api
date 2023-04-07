export interface ResponseApi {
    success: boolean;
    message: string;
    data: any;
    type?: string;
    status?: number;
}