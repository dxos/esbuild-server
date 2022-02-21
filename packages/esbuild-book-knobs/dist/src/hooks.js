"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNumber = exports.useSelect = exports.useButton = exports.useKnobs = exports.KnobContext = void 0;
const react_1 = require("react");
exports.KnobContext = (0, react_1.createContext)(undefined);
const useKnobs = () => {
    return (0, react_1.useContext)(exports.KnobContext);
};
exports.useKnobs = useKnobs;
const useButton = (label, onClick) => {
    const [, addKnob] = (0, exports.useKnobs)();
    (0, react_1.useEffect)(() => {
        addKnob('button', { label, onClick });
    }, []);
};
exports.useButton = useButton;
const useSelect = (label, values, defaultValue = undefined) => {
    const [, addKnob] = (0, exports.useKnobs)();
    const [value, setValue] = (0, react_1.useState)(values[Object.keys(values)[0]]);
    (0, react_1.useEffect)(() => {
        addKnob('select', { label, values, defaultValue, onChange: value => setValue(value) });
    }, []);
    return value;
};
exports.useSelect = useSelect;
const useNumber = (label, range, defaultValue = 0) => {
    const [, addKnob] = (0, exports.useKnobs)();
    const [value, setValue] = (0, react_1.useState)(defaultValue);
    (0, react_1.useEffect)(() => {
        addKnob('number', { label, range, defaultValue, onChange: (value) => setValue(value) });
    }, []);
    return value;
};
exports.useNumber = useNumber;
//# sourceMappingURL=hooks.js.map