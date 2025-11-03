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

    widget.innerHTML = `
    <div class="tank-widget__content" role="dialog" aria-modal="true">
        <button class="tank-widget__close" aria-label="Close tank information">&times;</button>
        <div class="tank-widget__body"></div>
    </div>
  `;

    const content = widget.querySelector(".tank-widget__content") as HTMLElement;
    const closeBtn = widget.querySelector(".tank-widget__close") as HTMLButtonElement;
    const body = widget.querySelector(".tank-widget__body") as HTMLElement;

    const cleanupFunctions: (() => void)[] = [];
    let battlesProgress: HTMLElement | null = null;
    let battlesInput: HTMLElement | null = null;
    let battlesExperience: HTMLElement | null = null;

    // Close button handler (скрыт, но на всякий случай)
    closeBtn.addEventListener("click", props.onClose);
    cleanupFunctions.push(() => closeBtn.removeEventListener("click", props.onClose));

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
    initConfiguration(body, localState, wrappedOnStateChange);
    battlesProgress = initBattlesProgress(body, localState, wrappedOnStateChange);
    battlesInput = initBattlesInput(body, localState, wrappedOnStateChange);
    battlesExperience = initBattlesExperience(body, localState, wrappedOnStateChange);

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

    // Positioning
    const positionWidget = () => {
        const placement = computeWidgetPlacement(content, props.targetEl, props.index);
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

        // Clean up event handlers if they exist
        if ((widget as any).cardMouseLeaveHandler && props.targetEl) {
            props.targetEl.removeEventListener("mouseleave", (widget as any).cardMouseLeaveHandler);
        }
    });

    (widget as any).__cleanup = () => {
        cleanupFunctions.forEach((cleanup) => cleanup());
    };

    (widget as any).__position = positionWidget;

    return widget;
}
