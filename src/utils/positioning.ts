export const computeWidgetPlacement = (
    contentEl: HTMLElement,
    targetEl: HTMLElement,
    index: number,
    opts?: { gap?: number; margin?: number }
): WidgetPlacement => {
    const gap = opts?.gap ?? 8;
    const margin = opts?.margin ?? 8;

    const targetRect = targetEl.getBoundingClientRect();
    const contentRect = contentEl.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    // Detect row and column of clicked tank
    const colIndex = index % 3;

    // Detect vertical position
    const spaceBelow = viewportH - targetRect.bottom;
    const spaceAbove = targetRect.top;
    const showBelow = spaceBelow >= contentRect.height + gap || spaceBelow >= spaceAbove;
    const vertical: VerticalMode = showBelow ? "top" : "bottom";

    // Arrow position according to column
    let arrowSide: ArrowSide;
    let desiredArrowLeft: number;

    if (colIndex === 0) {
        arrowSide = "left";
        desiredArrowLeft = 95; // 95px from left
    } else if (colIndex === 1) {
        arrowSide = "center";
        desiredArrowLeft = contentRect.width / 2;
    } else {
        arrowSide = "right";
        desiredArrowLeft = contentRect.width - 95; // 95px from right
    }

    // positioning aroow to center of clicked card
    const targetCenterX = targetRect.left + targetRect.width / 2;
    let contentLeft = targetCenterX - desiredArrowLeft;

    // Positioning in viewport range
    contentLeft = Math.max(margin, Math.min(contentLeft, viewportW - contentRect.width - margin));

    // Detect horizontal position
    let contentTop: number;
    if (vertical === "top") {
        contentTop = targetRect.bottom + gap;
    } else {
        contentTop = targetRect.top - contentRect.height - gap;
    }

    // Real position of arrow
    const actualArrowLeft = targetCenterX - contentLeft;

    return {
        left: Math.round(contentLeft),
        top: Math.round(contentTop),
        arrowLeft: Math.round(actualArrowLeft),
        vertical,
        arrowSide,
    };
};

// function to apply placement to content
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
