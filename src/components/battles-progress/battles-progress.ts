import "./battles-progress.css";

export function initBattlesProgress(root: HTMLElement, state: AppState): HTMLElement {
    const container = document.createElement("div");
    container.className = "battles-progress";

    const title = document.createElement("h2");
    title.className = "battles-subtitle";
    title.textContent = "Количество боёв";

    container.appendChild(title);

    const progressContainer = document.createElement("div");
    progressContainer.className = "battles-progress-container";

    container.appendChild(progressContainer);

    const progressBar = document.createElement("div");
    progressBar.className = "battles-progress-bar";

    const progressFill = document.createElement("div");
    progressFill.className = "battles-progress-fill";
    const progressPercentage = (state.battles / state.maxBattles) * 100;
    progressFill.style.width = `${progressPercentage}%`;

    progressBar.appendChild(progressFill);
    progressContainer.appendChild(progressBar);

    root.appendChild(container);
    return container;
}
