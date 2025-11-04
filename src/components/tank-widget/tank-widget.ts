import { calculateExperience } from "../../utils/experience-calculator";
import { applyPlacementToContent, computeWidgetPlacement } from "../../utils/positioning";
import { initBattlesExperience } from "../battles-experience/battles-experience";
import { initBattlesProgress } from "../battles-progress/battles-progress";
import { initConfiguration } from "../radio-items/radio-items";
import { initBattlesInput } from "../UI/battles-input/battles-input";
import "./tank-widget.css";

export function initTankWidget(props: TankWidgetProps): HTMLElement {
    const widget = document.createElement("div");
    widget.className = "tank-widget";
    const mobile = window.innerWidth <= 768;

    if (mobile) {
        widget.innerHTML = `
            <div class="tank-widget__content" role="dialog" aria-modal="true">
                <div class="tank-widget__header">
                    <h2 class="tank-widget__name">${props.tank.name}</h2>
                    <button class="tank-widget__close" aria-label="Close tank information">&times;</button>
                </div>
                <div class="tank-widget__body"></div>
            </div>
        `;
    } else {
        widget.innerHTML = `
            <div class="tank-widget__content" role="dialog" aria-modal="true">
                <div class="tank-widget__body"></div>
            </div>
        `;
    }

    const content = widget.querySelector(".tank-widget__content") as HTMLElement;
    const body = widget.querySelector(".tank-widget__body") as HTMLElement;

    const cleanupFunctions: (() => void)[] = [];
    let battlesProgress: HTMLElement | null = null;
    let battlesInput: HTMLElement | null = null;
    let battlesExperience: HTMLElement | null = null;

    // Close button handler
    if (mobile) {
        const closeBtn = widget.querySelector(".tank-widget__close") as HTMLButtonElement;
        if (closeBtn) {
            closeBtn.addEventListener("click", props.onClose);
            cleanupFunctions.push(() => closeBtn.removeEventListener("click", props.onClose));
        }
    }

    // Escape key handler
    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            props.onClose();
        }
    };
    document.addEventListener("keydown", onKeyDown);
    cleanupFunctions.push(() => document.removeEventListener("keydown", onKeyDown));

    // Local state for widget
    let localState = { ...props.state };

    // Experience calculation function
    const recalculateExperience = (state: AppState) => {
        return calculateExperience(state.battles, state.selectedConfiguration).totalExperience;
    };

    // Wrapped state change handler
    const wrappedOnStateChange = (newState: Partial<AppState>) => {
        // Update local state
        localState = { ...localState, ...newState };

        // Recalculate experience based on actual state
        const newExperience = recalculateExperience(localState);
        localState.experience = newExperience;

        // Pass all changes to parent component
        props.onStateChange({ ...newState, experience: newExperience });

        // Sync components
        if (newState.battles !== undefined) {
            if (battlesProgress && (battlesProgress as any).update) {
                (battlesProgress as any).update(localState.battles);
            }
            if (battlesInput && (battlesInput as any).update) {
                (battlesInput as any).update(localState.battles);
            }
        }

        // Always update experience display
        if (battlesExperience && (battlesExperience as any).update) {
            (battlesExperience as any).update(localState.experience);
        }
    };

    // Initialize components
    if (mobile) {
        initConfiguration(body, localState, wrappedOnStateChange);
        battlesProgress = initBattlesProgress(body, localState, wrappedOnStateChange);
        battlesInput = initBattlesInput(body, localState, wrappedOnStateChange);
        body.insertAdjacentHTML("beforeend", '<div class="divider"></div>');
        battlesExperience = initBattlesExperience(body, localState, wrappedOnStateChange);
    } else {
        initConfiguration(body, localState, wrappedOnStateChange);
        battlesExperience = initBattlesExperience(body, localState, wrappedOnStateChange);
        battlesProgress = initBattlesProgress(body, localState, wrappedOnStateChange);
        battlesInput = initBattlesInput(body, localState, wrappedOnStateChange);
    }

    // Initialize experience on creation
    const initialExperience = recalculateExperience(localState);
    localState.experience = initialExperience;
    props.onStateChange({ experience: initialExperience });

    if (battlesExperience && (battlesExperience as any).update) {
        (battlesExperience as any).update(initialExperience);
    }

    // Add cleanup functions from components
    if ((battlesProgress as any).cleanup) {
        cleanupFunctions.push((battlesProgress as any).cleanup);
    }
    if ((battlesInput as any).cleanup) {
        cleanupFunctions.push((battlesInput as any).cleanup);
    }
    if ((battlesExperience as any).cleanup) {
        cleanupFunctions.push((battlesExperience as any).cleanup);
    }

    // Show animation
    requestAnimationFrame(() => {
        widget.classList.add("tank-widget--visible");
    });

    // Positioning for desctop
    if (!mobile) {
        const positionWidget = () => {
            const placement = computeWidgetPlacement(content, props.targetEl, props.index, {
                gap: 20,
                margin: 20,
            });
            applyPlacementToContent(content, placement);
        };

        const onWindowChange = () => {
            positionWidget();
        };

        window.addEventListener("resize", onWindowChange);
        window.addEventListener("scroll", onWindowChange, true);

        cleanupFunctions.push(() => {
            window.removeEventListener("resize", onWindowChange);
            window.removeEventListener("scroll", onWindowChange, true);

            // Очищаем обработчик карточки если он есть
            if ((widget as any).cardMouseLeaveHandler && props.targetEl) {
                props.targetEl.removeEventListener(
                    "mouseleave",
                    (widget as any).cardMouseLeaveHandler
                );
            }
        });
        (widget as any).__position = positionWidget;
    }

    (widget as any).__cleanup = () => {
        cleanupFunctions.forEach((cleanup) => cleanup());
    };

    return widget;
}
