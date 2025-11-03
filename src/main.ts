import "./style.css";
import { initTanksBlock } from "./components/tanks-block/tanks-block";
import { mockTanks } from "./mock-tanks";
import { initTankWidget } from "./components/tank-widget/tank-widget";

// temp mock state for widget
const initialState: AppState = {
    selectedTank: mockTanks[0],
    selectedConfiguration: "Стандартная",
    battles: 130,
    experience: 202,
    maxBattles: 300,
    showWidget: false,
};

function initApp(root: HTMLElement): void {
    let currentState: AppState = { ...initialState };
    let tankWidget: HTMLElement | null = null;

    const tanksSection = document.createElement("section");
    tanksSection.className = "tanks-section";
    root.appendChild(tanksSection);

    const updateState = (newState: Partial<AppState>) => {
        currentState = { ...currentState, ...newState };
    };

    const closeWidget = () => {
        if (!tankWidget) {
            updateState({ showWidget: false, selectedTank: null });
            return;
        }

        (tankWidget as any).__cleanup?.();
        tankWidget.classList.remove("tank-widget--visible");

        setTimeout(() => {
            if (tankWidget) {
                tankWidget.remove();
                tankWidget = null;
            }
            updateState({ showWidget: false, selectedTank: null });
        }, 300);
    };

    const openWidget = (tank: TankData, targetEl: HTMLElement, e: MouseEvent, index: number) => {
        if (tankWidget) {
            (tankWidget as any).__cleanup?.();
            tankWidget.remove();
            tankWidget = null;
        }

        updateState({
            selectedTank: tank,
            battles: tank.battles,
            experience: tank.experience,
            selectedConfiguration: tank.configuration,
            showWidget: true,
        });

        setTimeout(() => {
            tankWidget = initTankWidget({
                tank,
                state: currentState,
                onStateChange: updateState,
                onClose: closeWidget,
                targetEl,
                index,
            });

            document.body.appendChild(tankWidget);
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
