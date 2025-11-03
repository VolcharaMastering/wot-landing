import { applyPlacementToContent, computeWidgetPlacement } from "../../utils/positioning";
import { initBattlesExperience } from "../battles-experience/battles-experience";
import { initBattlesProgress } from "../battles-progress/battles-progress";
import { initBattlesInput } from "../UI/battles-input/battles-input";
import { initConfiguration } from "../radio-items/radio-items";
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

    // add event listeners to close widget
    overlay.addEventListener("click", props.onClose);
    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            props.onClose();
        }
    };
    document.addEventListener("keydown", onKeyDown);

    // init and add components to widget body
    initConfiguration(body, props.state, props.onStateChange);
    initBattlesExperience(body, props.state);
    initBattlesProgress(body, props.state);
    initBattlesInput(body, props.state, props.onStateChange);

    requestAnimationFrame(() => {
        widget.classList.add("tank-widget--visible");
    });

    // position of widget, according to target tank
    const positionWidget = () => {
        const placement = computeWidgetPlacement(content, props.targetEl, props.index);
        applyPlacementToContent(content, placement);
    };

    const onWindowChange = () => {
        positionWidget();
    };

    window.addEventListener("resize", onWindowChange);
    window.addEventListener("scroll", onWindowChange, true);

    (widget as any).__cleanup = () => {
        window.removeEventListener("resize", onWindowChange);
        window.removeEventListener("scroll", onWindowChange, true);
        document.removeEventListener("keydown", onKeyDown);
    };

    (widget as any).__position = positionWidget;

    return widget;
}
