import { initTanksBlock } from "./components/tanks-block/tanks-block";
import { initTankWidget } from "./components/tank-widget/tank-widget";
import { calculateExperience } from "./utils/experience-calculator";
import { mockTanks } from "./mock-tanks";
import "./style.css";

// start state of app
const initialState: AppState = {
    selectedTank: mockTanks[0],
    selectedConfiguration: "Стандартная",
    battles: 130,
    experience: 0,
    maxBattles: 300,
    showWidget: false,
};

// Count start experience
initialState.experience = calculateExperience(
    initialState.battles,
    initialState.selectedConfiguration
).totalExperience;

function initApp(root: HTMLElement): void {
    let currentState: AppState = { ...initialState };
    let tankWidget: HTMLElement | null = null;

    const tanksSection = document.createElement("section");
    tanksSection.className = "tanks-section";
    root.appendChild(tanksSection);

    // State (manager :)) updater
    const updateState = (newState: Partial<AppState>) => {
        currentState = { ...currentState, ...newState };
    };

    // close widget
    const closeWidget = () => {
        if (!tankWidget) {
            updateState({ showWidget: false, selectedTank: null });
            return;
        }

        // call cleanup if widget exposed one
        (tankWidget as any).__cleanup?.();

        // start hide animation
        tankWidget.classList.remove("tank-widget--visible");

        // remove after animation
        setTimeout(() => {
            if (tankWidget) {
                tankWidget.remove();
                tankWidget = null;
            }
            updateState({ showWidget: false, selectedTank: null });
        }, 300);
    };

    // Open widget with tanks info
    const openWidget = (tank: TankData, targetEl: HTMLElement, e: MouseEvent, index: number) => {
        // close previous widget if exists
        if (tankWidget) {
            (tankWidget as any).__cleanup?.();
            tankWidget.remove();
            tankWidget = null;
        }

        // Experience counter for selected tank
        const tankExperience = calculateExperience(
            tank.battles,
            tank.configuration
        ).totalExperience;

        // update application state
        updateState({
            selectedTank: tank,
            battles: tank.battles,
            experience: tankExperience,
            selectedConfiguration: tank.configuration,
            showWidget: true,
        });

        // Create widget after 30ms
        setTimeout(() => {
            // create widget — pass targetEl (must exist)
            tankWidget = initTankWidget({
                tank,
                state: currentState,
                onStateChange: updateState,
                onClose: closeWidget,
                targetEl,
                index,
            });

            // append to body so absolute positioning works relative to viewport
            document.body.appendChild(tankWidget);

            // force initial position after appended and styles applied
            requestAnimationFrame(() => {
                (tankWidget as any).__position?.();
            });
        }, 30);
    };

    const renderApp = () => {
        tanksSection.innerHTML = "";
        const tanksBlock = initTanksBlock({
            tanks: mockTanks,
            selectedTank: currentState.selectedTank,
            onTankSelect: openWidget,
            index: 0,
        });
        tanksSection.appendChild(tanksBlock);
    };

    renderApp();
}

const appRoot = document.getElementById("app");
if (appRoot) {
    initApp(appRoot);
} else {
    console.error("Root element #app not found");
}
