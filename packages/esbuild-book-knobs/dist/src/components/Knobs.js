"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Knobs = void 0;
const react_1 = __importStar(require("react"));
const css_1 = require("@emotion/css");
const types_1 = require("../types");
const hooks_1 = require("../hooks");
const styles = (0, css_1.css) `
  position: absolute;
  right: 0;
`;
exports.Knobs = (0, react_1.forwardRef)(({ className = styles }, ref) => {
    const [knobs] = (0, hooks_1.useKnobs)();
    return (react_1.default.createElement("div", { ref: ref, className: className }, knobs.map(([type, options], i) => {
        switch (type) {
            case 'button': {
                const { label, onClick } = options;
                return (react_1.default.createElement("button", { key: i, onClick: onClick }, label));
            }
            case 'select': {
                const { label, values, defaultValue, onChange } = options;
                return (react_1.default.createElement("div", { key: i },
                    react_1.default.createElement("label", null, label.toUpperCase()),
                    react_1.default.createElement("select", { value: defaultValue, onChange: (event) => {
                            onChange(event.target.value !== '' ? values[event.target.value] : undefined);
                        } }, Object.keys(values).map(key => (react_1.default.createElement("option", { key: key, value: key }, key))))));
            }
            case 'number': {
                const { label, range: { min, max, step = 1 }, defaultValue, onChange } = options;
                return (react_1.default.createElement("div", { key: i },
                    react_1.default.createElement("label", null, label.toUpperCase()),
                    react_1.default.createElement("select", { value: defaultValue, onChange: (event) => {
                            onChange(event.target.value !== '' ? parseInt(event.target.value) : defaultValue);
                        } }, [...(0, types_1.range)(min, max, step)].map(value => (react_1.default.createElement("option", { key: value, value: value }, value))))));
            }
        }
    })));
});
//# sourceMappingURL=Knobs.js.map