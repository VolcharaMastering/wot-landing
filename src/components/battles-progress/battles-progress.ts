import { clampBattles } from "../../utils/battles-state";
import "./battles-progress.css";

export function initBattlesProgress(
    root: HTMLElement,
    state: AppState,
    onStateChange: (newState: Partial<AppState>) => void
): HTMLElement {
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

    //  Thumb in progress bar
    const thumb = document.createElement("div");
    thumb.className = "battles-progress-thumb";
    thumb.tabIndex = 0;
    thumb.setAttribute("role", "slider");
    thumb.setAttribute("aria-valuenow", state.battles.toString());
    thumb.setAttribute("aria-valuemin", "0");
    thumb.setAttribute("aria-valuemax", "300");

    progressBar.appendChild(progressFill);
    progressContainer.appendChild(progressBar);
    progressContainer.appendChild(thumb);

    // Func to update visual state
    const updateVisualState = (battles: number) => {
        const percentage = Math.min(100, (battles / 300) * 100);
        progressFill.style.width = `${percentage}%`;

        // Position thumb in progress bar
        const thumbPosition = 22 + (percentage / 100) * 301;
        thumb.style.left = `${thumbPosition}px`;

        thumb.setAttribute("aria-valuenow", battles.toString());
    };

    // Init - Get battles from state
    updateVisualState(state.battles);

    // handler for keyboard to change battles count
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            const step = e.key === "ArrowLeft" ? -5 : 5;
            const newBattles = clampBattles(state.battles + step, 300);
            onStateChange({ battles: newBattles });
        }
    };

    thumb.addEventListener("keydown", handleKeyDown);

    // Handler for mouse grabbing progress bar
    let isDragging = false;

    const handleMouseDown = (e: MouseEvent) => {
        isDragging = true;
        thumb.style.cursor = "grabbing";
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        e.preventDefault();
    };

    // func to calculate the relative position of the mouse cursor within the progress bar element
    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        // subtracting the left position
        const progressBarRect = progressBar.getBoundingClientRect();
        let relativeX = e.clientX - progressBarRect.left;
        relativeX = Math.max(0, Math.min(relativeX, progressBarRect.width));

        // Calculate the percentage of the mouse cursor within the progress bar
        const percentage = relativeX / progressBarRect.width;
        // Calculate the new number of battles
        const newBattles = Math.round(percentage * 300);
        // Clamp the new number of battles
        const clampedBattles = clampBattles(newBattles, 300);

        // Update the visual state and state
        onStateChange({ battles: clampedBattles });
    };

    //Reset the state after  user has finished dragging it
    const handleMouseUp = () => {
        isDragging = false;
        thumb.style.cursor = "grab";
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    thumb.addEventListener("mousedown", handleMouseDown);

    // Update from outside
    const updateFromExternal = (newBattles: number) => {
        updateVisualState(newBattles);
    };

    // Save all methods for outside use
    (container as any).update = updateFromExternal;

    // clean listeners
    (container as any).cleanup = () => {
        thumb.removeEventListener("keydown", handleKeyDown);
        thumb.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    root.appendChild(container);
    return container;
}
