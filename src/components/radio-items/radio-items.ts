import "./radio-items.css";

export function initConfiguration(
    root: HTMLElement,
    state: AppState,
    onStateChange: (newState: Partial<AppState>) => void
): HTMLElement {
    const container = document.createElement("div");
    container.className = "radio";

    const title = document.createElement("h3");
    title.className = "battles-subtitle";
    title.textContent = "Комплектация";
    container.appendChild(title);

    const configurations: ConfigurationType[] = ["Стандартная", "Элитная", "Премиум"];

    const configList = document.createElement("div");
    configList.className = "radio-list";

    const cleanupFunctions: (() => void)[] = [];

    configurations.forEach((config) => {
        const configItem = createConfigItem(config, state.selectedConfiguration);
        configList.appendChild(configItem);
    });

    container.appendChild(configList);
    root.appendChild(container);

    function createConfigItem(config: ConfigurationType, selectedConfig: string): HTMLElement {
        const configItem = document.createElement("div");
        configItem.className = `radio-item ${
            config === selectedConfig ? "radio-item--selected" : ""
        }`;

        configItem.innerHTML = `
      <div class="radio-radio">
        <input type="radio" name="radio" value="${config}" ${
            config === selectedConfig ? "checked" : ""
        }>
        <span class="radio-custom"></span>
      </div>
      <span class="radio-name">${config}</span>
    `;

        const radioInput = configItem.querySelector("input") as HTMLInputElement;
        // On radio change update selection
        const handleChange = () => {
            onStateChange({ selectedConfiguration: config });
            updateSelection();
        };

        radioInput.addEventListener("change", handleChange);
        cleanupFunctions.push(() => {
            radioInput.removeEventListener("change", handleChange);
        });

        return configItem;
    }

    //Func to update the selected state of radio items based on the current state
    function updateSelection(): void {
        const allItems = container.querySelectorAll(".radio-item");
        allItems.forEach((item) => {
            const radioInput = item.querySelector("input") as HTMLInputElement;
            const config = radioInput.value as ConfigurationType;
            item.classList.toggle("radio-item--selected", config === state.selectedConfiguration);
        });
    }

    // cleanup
    (container as any).cleanup = () => {
        cleanupFunctions.forEach((cleanup) => cleanup());
    };

    return container;
}
