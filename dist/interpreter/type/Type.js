"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = exports.Category = void 0;
var Category;
(function (Category) {
    Category[Category["Bool"] = 0] = "Bool";
    Category[Category["Int"] = 1] = "Int";
    Category[Category["Float"] = 2] = "Float";
    Category[Category["Char"] = 3] = "Char";
    Category[Category["String"] = 4] = "String";
    Category[Category["Array"] = 5] = "Array";
    Category[Category["Dict"] = 6] = "Dict";
})(Category || (exports.Category = Category = {}));
class Type {
    constructor(category) {
        this.category = category;
    }
    getCategory() {
        return this.category;
    }
}
exports.Type = Type;
