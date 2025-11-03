export const clampBattles = (value: number, max: number = 300): number => {
    const clamped = Math.max(0, Math.min(value, max));
    return Math.round(clamped);
};
