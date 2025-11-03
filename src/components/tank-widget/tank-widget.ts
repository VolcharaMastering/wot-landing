import { applyPlacementToContent, computeWidgetPlacement } from "../../utils/positioning";
import { initBattlesExperience } from "../battles-experience/battles-experience";
import { initBattlesProgress } from "../battles-progress/battles-progress";
import { initConfiguration } from "../radio-items/radio-items";
import { initBattlesInput } from "../UI/battles-input/battles-input";
import { calculateExperience } from "../../utils/experience-calculator";
import "./tank-widget.css";

export function initTankWidget(props: TankWidgetProps): HTMLElement {
    const widget = document.createElement("div");
    widget.className = "tank-widget";

    widget.innerHTML = `
    <div class="tank-widget__overlay"></div>
    <div class="tank-widget__content" role="dialog" aria-modal="true">
        <div class="tank-widget__body"></div>
    </div>
  `;

    const overlay = widget.querySelector(".tank-widget__overlay") as HTMLElement;
    const content = widget.querySelector(".tank-widget__content") as HTMLElement;
    const body = widget.querySelector(".tank-widget__body") as HTMLElement;

    const cleanupFunctions: (() => void)[] = [];
    let battlesProgress: HTMLElement | null = null;
    let battlesInput: HTMLElement | null = null;
    let battlesExperience: HTMLElement | null = null;

    // OnClose handler
    overlay.addEventListener("click", props.onClose);

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            props.onClose();
        }
    };
    document.addEventListener("keydown", onKeyDown);
    cleanupFunctions.push(() => document.removeEventListener("keydown", onKeyDown));

    // Local state of the widget
    let localState = { ...props.state };

    // Calculate of experience
    const recalculateExperience = (state: AppState) => {
        return calculateExperience(state.battles, state.selectedConfiguration).totalExperience;
    };

    // Handler for state changes
    const wrappedOnStateChange = (newState: Partial<AppState>) => {
        // Local state update
        localState = { ...localState, ...newState };

        // Recalculate experience after state change
        const newExperience = recalculateExperience(localState);
        localState.experience = newExperience;

        // All changes are pushed to state
        props.onStateChange({ ...newState, experience: newExperience });

        // Synchronize component updates
        if (newState.battles !== undefined) {
            if (battlesProgress && (battlesProgress as any).update) {
                (battlesProgress as any).update(localState.battles);
            }
            if (battlesInput && (battlesInput as any).update) {
                (battlesInput as any).update(localState.battles);
            }
        }

        // Synchronize expirience
        if (battlesExperience && (battlesExperience as any).update) {
            (battlesExperience as any).update(localState.experience);
        }
    };

    // Components initialization
    initConfiguration(body, localState, wrappedOnStateChange);
    battlesExperience = initBattlesExperience(body, localState, wrappedOnStateChange);
    battlesProgress = initBattlesProgress(body, localState, wrappedOnStateChange);
    battlesInput = initBattlesInput(body, localState, wrappedOnStateChange);

    //  Initial expirience on render
    const initialExperience = recalculateExperience(localState);
    localState.experience = initialExperience;
    props.onStateChange({ experience: initialExperience });

    if (battlesExperience && (battlesExperience as any).update) {
        (battlesExperience as any).update(initialExperience);
    }

    // cleanup from components
    if ((battlesProgress as any).cleanup) {
        cleanupFunctions.push((battlesProgress as any).cleanup);
    }
    if ((battlesInput as any).cleanup) {
        cleanupFunctions.push((battlesInput as any).cleanup);
    }
    if ((battlesExperience as any).cleanup) {
        cleanupFunctions.push((battlesExperience as any).cleanup);
    }

    // Animation of widget show
    requestAnimationFrame(() => {
        widget.classList.add("tank-widget--visible");
    });

    // position widget
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
    });

    (widget as any).__cleanup = () => {
        cleanupFunctions.forEach((cleanup) => cleanup());
    };

    (widget as any).__position = positionWidget;

    return widget;
}
