export class InternalException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InternalException';
    }
}
