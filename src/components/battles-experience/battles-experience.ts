import "./battles-experience.css";

export function initBattlesExperience(root: HTMLElement, state: AppState): HTMLElement {
    const container = document.createElement("div");
    container.className = "battles-experience";

    const title = document.createElement("h2");
    title.className = "battles-subtitle";
    title.textContent = "Опыт танка";
    container.appendChild(title);

    const experienceContainer = document.createElement("div");
    experienceContainer.className = "battles-experience-container";

    experienceContainer.innerHTML = `
    <div class="star-image" role="img" aria-label="star"></div>
    `;

    const tankExperience = document.createElement("h1");
    tankExperience.className = "battles-experience-text";
    tankExperience.textContent = `${state.experience}`;

    experienceContainer.appendChild(tankExperience);

    container.appendChild(experienceContainer);
    root.appendChild(container);
    return container;
}
