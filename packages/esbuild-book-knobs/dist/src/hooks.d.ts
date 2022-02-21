import { NumberRange, SelectMap } from './types';
export declare type KnobDef = [type: string, options: any];
export declare const KnobContext: any;
export declare const useKnobs: () => any;
export declare const useButton: (label: string, onClick: () => void) => void;
export declare const useSelect: (label: string, values: SelectMap, defaultValue?: any) => any;
export declare const useNumber: (label: string, range: NumberRange, defaultValue?: number) => number;
