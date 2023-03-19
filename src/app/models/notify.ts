export interface Notify {
    type: NotifyType,
    message: string,
}

export enum NotifyType {
    ERROR = 'error',
    WARN = 'warn',
    SUCCESS = 'success',
}