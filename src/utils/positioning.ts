export const computeWidgetPlacement = (
    contentEl: HTMLElement,
    targetEl: HTMLElement,
    index: number,
    opts?: { gap?: number; margin?: number }
): WidgetPlacement => {
    // Gap between content and target elements
    const gap = opts?.gap ?? 8;

    // Margin between content and viewport
    const margin = opts?.margin ?? 8;

    const targetRect = targetEl.getBoundingClientRect();
    const contentRect = contentEl.getBoundingClientRect();
    const viewportW = window.innerWidth;

    // Determine the row (0 - top, 1 - bottom)
    const rowIndex = Math.floor(index / 3);

    // For the top row, show the content below, for the bottom row - above
    let vertical: VerticalMode;
    if (rowIndex === 0) {
        // Top row - content below (arrow up)
        vertical = "top";
    } else {
        // Bottom row - content above (arrow down)
        vertical = "bottom";
    }

    // Fixed positions of the arrow depending on the position of the tank
    let arrowSide: ArrowSide;
    let desiredArrowLeft: number;

    const colIndex = index % 3;
    if (colIndex === 0) {
        arrowSide = "left";
        desiredArrowLeft = 95;
    } else if (colIndex === 1) {
        arrowSide = "center";
        desiredArrowLeft = contentRect.width / 2;
    } else {
        arrowSide = "right";
        desiredArrowLeft = contentRect.width - 95;
    }

    // Position the content so that the arrow points to the center of the target element
    const targetCenterX = targetRect.left + targetRect.width / 2;
    let contentLeft = targetCenterX - desiredArrowLeft;

    // Constrain the content position to the viewport
    contentLeft = Math.max(margin, Math.min(contentLeft, viewportW - contentRect.width - margin));

    // Get the content top
    let contentTop: number;
    if (vertical === "top") {
        contentTop = targetRect.bottom + gap; // under target
    } else {
        contentTop = targetRect.top - contentRect.height - gap; // over target
    }

    // Actual position of the arrow after constraints
    const actualArrowLeft = targetCenterX - contentLeft;

    return {
        left: Math.round(contentLeft),
        top: Math.round(contentTop),
        arrowLeft: Math.round(actualArrowLeft),
        vertical,
        arrowSide,
    };
};

// Function to apply placement to content
export const applyPlacementToContent = (contentEl: HTMLElement, placement: WidgetPlacement) => {
    contentEl.style.position = "absolute";
    contentEl.style.left = `${placement.left}px`;
    contentEl.style.top = `${placement.top}px`;
    contentEl.style.setProperty("--arrow-left", `${placement.arrowLeft}px`);

    // Delete old classes and add new
    const parent = contentEl.parentElement;
    parent?.classList.remove("tank-widget--arrow-top", "tank-widget--arrow-bottom");

    if (placement.vertical === "top") {
        parent?.classList.add("tank-widget--arrow-top");
    } else {
        parent?.classList.add("tank-widget--arrow-bottom");
    }
};
