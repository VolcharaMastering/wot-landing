import { initTanksBlock } from "./components/tanks-block/tanks-block";
import { initTankWidget } from "./components/tank-widget/tank-widget";
import { calculateExperience } from "./utils/experience-calculator";
import { mockTanks } from "./mock-tanks";
import "./style.css";

// Start state of app
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

function initApp(root: HTMLElement): () => void {
    let currentState: AppState = { ...initialState };
    let tankWidget: HTMLElement | null = null;
    let closeTimer: number | null = null;
    let currentHoverCard: HTMLElement | null = null;

    const tanksSection = document.createElement("section");
    tanksSection.className = "tanks-section";
    root.appendChild(tanksSection);

    // State updater
    const updateState = (newState: Partial<AppState>) => {
        currentState = { ...currentState, ...newState };
    };

    // Close widget function
    const closeWidget = () => {
        if (!tankWidget) {
            updateState({ showWidget: false, selectedTank: null });
            return;
        }

        // Call cleanup if widget exposed one
        (tankWidget as any).__cleanup?.();

        // Start hide animation
        tankWidget.classList.remove("tank-widget--visible");

        // Remove after animation
        setTimeout(() => {
            if (tankWidget) {
                tankWidget.remove();
                tankWidget = null;
            }
            updateState({ showWidget: false, selectedTank: null });
            currentHoverCard = null;
        }, 300);
    };

    // Start close timer
    const startCloseTimer = () => {
        if (closeTimer) {
            clearTimeout(closeTimer);
        }
        closeTimer = window.setTimeout(() => {
            closeWidget();
        }, 1000);
    };

    // Cancel close timer
    const cancelCloseTimer = () => {
        if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
        }
    };

    // Open widget function
    const openWidget = (tank: TankData, targetEl: HTMLElement, index: number, e?: MouseEvent) => {
        // Cancel any pending close
        cancelCloseTimer();

        // Close previous widget if exists
        if (tankWidget) {
            (tankWidget as any).__cleanup?.();
            tankWidget.remove();
            tankWidget = null;
        }

        // Set current hover card
        currentHoverCard = targetEl;

        // Experience counter for selected tank
        const tankExperience = calculateExperience(
            tank.battles,
            tank.configuration
        ).totalExperience;

        // Update application state
        updateState({
            selectedTank: tank,
            battles: tank.battles,
            experience: tankExperience,
            selectedConfiguration: tank.configuration,
            showWidget: true,
        });

        // Create widget after 30ms
        setTimeout(() => {
            // Create widget
            tankWidget = initTankWidget({
                tank,
                state: currentState,
                onStateChange: updateState,
                onClose: closeWidget,
                targetEl,
                index,
            });

            // Append to body so absolute positioning works relative to viewport
            document.body.appendChild(tankWidget);

            // Add hover events for desktop
            if (window.innerWidth > 768) {
                const widgetElement = tankWidget as HTMLElement;

                // handler for widget mouseenter
                widgetElement.addEventListener("mouseenter", () => {
                    cancelCloseTimer();
                });

                widgetElement.addEventListener("mouseleave", (e) => {
                    // Check if mouse left the widget
                    if (!widgetElement.contains(e.relatedTarget as Node)) {
                        startCloseTimer();
                    }
                });

                // Add handler for card mouseleave
                if (currentHoverCard) {
                    const cardMouseLeaveHandler = (e: MouseEvent) => {
                        if (!widgetElement.contains(e.relatedTarget as Node)) {
                            startCloseTimer();
                        }
                    };

                    currentHoverCard.addEventListener("mouseleave", cardMouseLeaveHandler);

                    // Save handler for cleanup
                    (tankWidget as any).cardMouseLeaveHandler = cardMouseLeaveHandler;
                }
            }

            // Force initial position after appended and styles applied
            requestAnimationFrame(() => {
                (tankWidget as any).__position?.();
            });
        }, 30);
    };

    // Click handler for mobile
    const handleClick = (tank: TankData, targetEl: HTMLElement, e: MouseEvent, index: number) => {
        openWidget(tank, targetEl, index, e);
    };

    // Hover handler for desktop
    const handleHover = (tank: TankData, targetEl: HTMLElement, index: number) => {
        if (window.innerWidth > 768) {
            openWidget(tank, targetEl, index);
        }
    };

    const renderApp = () => {
        tanksSection.innerHTML = "";
        const tanksBlock = initTanksBlock({
            tanks: mockTanks,
            selectedTank: currentState.selectedTank,
            onTankSelect: handleClick,
            onTankHover: handleHover,
            index: 0,
        });
        tanksSection.appendChild(tanksBlock);
    };

    renderApp();

    // Handle window resize
    const handleResize = () => {
        console.log("Window resized - please refresh to update interaction mode");
        // Close widget on resize to prevent positioning issues
        if (tankWidget) {
            closeWidget();
        }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function for app
    return () => {
        window.removeEventListener("resize", handleResize);
        if (tankWidget) {
            closeWidget();
        }
    };
}

// Launch application
const appRoot = document.getElementById("app");
if (appRoot) {
    initApp(appRoot);
    // window.addEventListener('beforeunload', cleanup);
} else {
    console.error("Root element #app not found");
}
