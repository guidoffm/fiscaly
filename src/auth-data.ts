export interface AuthData {
    access_token: string;
    access_token_claims: any;
    access_token_expires_in: number;
    access_token_expires_at: number;

    refresh_token: string;
    refresh_token_expires_in: number;
    refresh_token_expires_at: number;
}
