"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetExpr = void 0;
const Expr_1 = require("./Expr");
class SetExpr extends Expr_1.Expr {
    constructor(line) {
        super(line);
    }
}
exports.SetExpr = SetExpr;
