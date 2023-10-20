"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstExpr = void 0;
const Expr_1 = require("./Expr");
class ConstExpr extends Expr_1.Expr {
    constructor(line, value) {
        super(line);
        this.value = value;
    }
    expr() {
        return this.value;
    }
}
exports.ConstExpr = ConstExpr;
