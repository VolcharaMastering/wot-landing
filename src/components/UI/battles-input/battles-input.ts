import "./battles-input.css";

export function initBattlesInput(
    root: HTMLElement,
    state: AppState,
    onStateChange: (newState: Partial<AppState>) => void
) {
    const container = document.createElement("input");
    container.className = "battles-input";

    container.type = "number";
    container.value = state.battles.toString();
    container.min = "0";
    container.max = "300";

    root.appendChild(container);
}
