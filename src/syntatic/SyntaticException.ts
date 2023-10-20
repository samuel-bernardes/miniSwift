export class SyntaticException extends Error {

    constructor(line: Number, reason: String) {
        super(`${line}: ${reason}`);
    }

}