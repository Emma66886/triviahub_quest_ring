declare module 'zzfx' {
    export function zzfx(...params: (number | undefined)[]): void;
    export const ZZFX: {
        z: number;
        t: number;
        x: AudioContext;
    };
}
