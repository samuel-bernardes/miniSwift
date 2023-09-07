export enum Category {
    Bool,
    Int,
    Float,
    Char,
    String,
    Array,
    Dict
}

export abstract class Type {
    private category: Category;

    constructor(category: Category) {
        this.category = category;
    }

    public getCategory(): Category {
        return this.category;
    }

    public abstract match(type: Type): boolean;
}
