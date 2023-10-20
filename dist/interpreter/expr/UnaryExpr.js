"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operator = exports.UnaryExpr = void 0;
const InternalException_1 = require("../../error/InternalException");
const LanguageException_1 = require("../../error/LanguageException");
const BoolType_1 = require("../type/primitive/types/BoolType");
const Value_1 = require("../value/Value");
const Expr_1 = require("./Expr");
class UnaryExpr extends Expr_1.Expr {
    constructor(line, expr, op) {
        super(line);
        this.varExpr = expr;
        this.op = op;
    }
    expr() {
        let value = this.varExpr.expr();
        let ret;
        switch (this.op) {
            case Operator.Not:
                ret = this.notOp(value);
                break;
            case Operator.Neg:
                ret = this.negOp(value);
                break;
            default:
                throw new InternalException_1.InternalException("unreachable");
        }
        return ret;
    }
    notOp(value) {
        let btype = BoolType_1.BoolType.instance();
        if (btype.match(value.type)) {
            let b = !Boolean(value.data);
            return new Value_1.Value(btype, b);
        }
        else {
            throw LanguageException_1.LanguageException.instance(super.getLine(), LanguageException_1.customErrors["InvalidType"], value.type.toString());
        }
    }
    negOp(value) {
        let n = Number(value.data);
        return new Value_1.Value(value.type, -n);
    }
}
exports.UnaryExpr = UnaryExpr;
var Operator;
(function (Operator) {
    Operator[Operator["Not"] = 0] = "Not";
    Operator[Operator["Neg"] = 1] = "Neg";
})(Operator || (exports.Operator = Operator = {}));
