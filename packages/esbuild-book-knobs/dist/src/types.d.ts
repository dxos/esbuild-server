export declare type SelectMap = {
    [index: string]: any;
};
export declare type NumberRange = {
    min: number;
    max: number;
    step?: number;
};
export declare function range(min: number, max: number, step?: number): any;
export interface Button {
    label: string;
    onClick: () => void;
}
export interface Select {
    label: string;
    values: SelectMap;
    defaultValue: any;
    onChange: (value: any) => void;
}
export interface Number {
    label: string;
    range: NumberRange;
    defaultValue: number;
    onChange: (value: number) => void;
}
export declare type KnobType = Button | Select | Number;
