export const calculateExperience = (
    battles: number,
    configuration: ConfigurationType
): ExperienceCalculation => {
    const baseExperience = battles * 3;
    let bonusMultiplier = 0;

    if (configuration === "Элитная") {
        bonusMultiplier = 0.1;
    } else if (configuration === "Премиум") {
        bonusMultiplier = 0.2;
    }

    const bonusExperience = Math.round(baseExperience * bonusMultiplier);
    const totalExperience = baseExperience + bonusExperience;

    return {
        baseExperience,
        bonusMultiplier,
        bonusExperience,
        totalExperience,
    };
};
