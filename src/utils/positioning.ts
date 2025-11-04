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

    // Определяем ряд (0 - верхний, 1 - нижний)
    const rowIndex = Math.floor(index / 3);

    // Для верхнего ряда показываем виджет снизу, для нижнего - сверху
    let vertical: VerticalMode;
    if (rowIndex === 0) {
        // Верхний ряд - виджет снизу (стрелка вверх)
        vertical = "top";
    } else {
        // Нижний ряд - виджет сверху (стрелка вниз)
        vertical = "bottom";
    }

    // Фиксированные позиции стрелки в зависимости от положения танка
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

    // Позиционируем виджет так, чтобы стрелка указывала на центр целевого элемента
    const targetCenterX = targetRect.left + targetRect.width / 2;
    let contentLeft = targetCenterX - desiredArrowLeft;

    // Ограничиваем позиционирование в пределах viewport
    contentLeft = Math.max(margin, Math.min(contentLeft, viewportW - contentRect.width - margin));

    // Вычисляем top позицию
    let contentTop: number;
    if (vertical === "top") {
        contentTop = targetRect.bottom + gap; // Виджет под карточкой
    } else {
        contentTop = targetRect.top - contentRect.height - gap; // Виджет над карточкой
    }

    // Реальное положение стрелки после ограничений
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
