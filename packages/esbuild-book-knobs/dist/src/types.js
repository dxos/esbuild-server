"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.range = void 0;
function* range(min, max, step = 1) {
    yield min;
    if (min >= max)
        return;
    yield* range(parseFloat(Number(min + step).toPrecision(10)), max, step);
}
exports.range = range;
//# sourceMappingURL=types.js.map