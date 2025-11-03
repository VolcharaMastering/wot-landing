import "./battles-input.css";
import { clampBattles } from "../../../utils/battles-state";

export function initBattlesInput(
    root: HTMLElement,
    state: AppState,
    onStateChange: (newState: Partial<AppState>) => void
): HTMLElement {
    const container = document.createElement("input");
    container.className = "battles-input";

    container.type = "number";
    container.value = state.battles.toString();
    container.min = "0";
    container.max = "300";
    container.step = "5";

    const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        let value = parseInt(target.value) || 0;

        // block input if value is out of range (0-300)
        if (value > 300) {
            value = 300;
            target.value = "300";
        } else if (value < 0) {
            value = 0;
            target.value = "0";
        } else if (isNaN(value)) {
            value = 0;
            target.value = "0";
        }

        const clampedValue = clampBattles(value, 300);
        onStateChange({ battles: clampedValue });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            const step = e.key === "ArrowUp" ? 5 : -5;
            const currentValue = parseInt(container.value) || 0;
            const newValue = clampBattles(currentValue + step, 300);
            container.value = newValue.toString();
            onStateChange({ battles: newValue });
        }

        // block input if key is not a number
        if (!/[\d]|Backspace|Delete|Tab|Escape|ArrowLeft|ArrowRight|Enter/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleBlur = () => {
        let value = parseInt(container.value) || 0;
        if (value > 300) {
            value = 300;
            container.value = "300";
        } else if (value < 0) {
            value = 0;
            container.value = "0";
        }
        const clampedValue = clampBattles(value, 300);
        onStateChange({ battles: clampedValue });
    };

    //Handles the change event of the input element.
    const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        let value = parseInt(target.value) || 0;
        const clampedValue = clampBattles(value, 300);
        // Update the state with the updated value.
        onStateChange({ battles: clampedValue });
    };

    container.addEventListener("input", handleInput);
    container.addEventListener("keydown", handleKeyDown);
    container.addEventListener("blur", handleBlur);
    container.addEventListener("change", handleChange);

    // Ubdate from outside
    (container as any).update = (newValue: number) => {
        if (parseInt(container.value) !== newValue) {
            container.value = newValue.toString();
        }
    };

    // cleanup
    (container as any).cleanup = () => {
        container.removeEventListener("input", handleInput);
        container.removeEventListener("keydown", handleKeyDown);
        container.removeEventListener("blur", handleBlur);
        container.removeEventListener("change", handleChange);
    };

    root.appendChild(container);
    return container;
}
