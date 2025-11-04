import "./battles-experience.css";

export function initBattlesExperience(
    root: HTMLElement,
    state: AppState,
    _onStateChange?: (newState: Partial<AppState>) => void
): HTMLElement {
    const container = document.createElement("div");
    container.className = "battles-experience";

    const title = document.createElement("h2");
    title.className = "battles-subtitle";
    title.textContent = "Опыт танка";
    container.appendChild(title);

    const experienceContainer = document.createElement("div");
    experienceContainer.className = "battles-experience-container";

    const star = document.createElement("div");
    star.className = "star-image";

    const tankExperience = document.createElement("h1");
    tankExperience.className = "battles-experience-text";
    tankExperience.textContent = `${state.experience}`;

    experienceContainer.appendChild(star);
    experienceContainer.appendChild(tankExperience);
    container.appendChild(experienceContainer);
    root.appendChild(container);

    // Update expirience and add animation
    const updateExperience = (newExperience: number) => {
        const currentValue = parseInt(tankExperience.textContent || "0");

        if (currentValue !== newExperience) {
            // Add animation
            star.classList.add("star-image--animated");
            tankExperience.classList.add("battles-experience-text--changing");

            // update expirience
            tankExperience.textContent = `${newExperience}`;

            // Delete animation after 0.5s
            setTimeout(() => {
                star.classList.remove("star-image--animated");
                tankExperience.classList.remove("battles-experience-text--changing");
            }, 500);
        }
    };

    // Save methods for outside use
    (container as any).update = updateExperience;

    // Cleaning if listeners will be added
    (container as any).cleanup = () => {
        // Now listeners now
    };

    return container;
}
