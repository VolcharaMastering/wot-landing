import "./tank-card.css";

export function initTankCard(props: TankCardProps): HTMLElement {
    const card = document.createElement("div");
    card.className = `tank-card`;

    card.innerHTML = `
      <img src="${props.tank.image}" alt="${props.tank.name}" class="tank-card__image">
      <h3 class="tank-card__name">${props.tank.name}</h3>
  `;

    // Check if mobile device
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // Mobile: use click event
        card.addEventListener("click", (e: MouseEvent) => {
            props.onClick(props.tank, card, e, props.index);
        });
    } else {
        // Desktop: use hover events
        let hoverTimer: number;
        let isHovering = false;

        card.addEventListener("mouseenter", () => {
            isHovering = true;
            // Clear any existing timer
            clearTimeout(hoverTimer);
            // Open widget after small delay to prevent accidental hovers
            hoverTimer = window.setTimeout(() => {
                if (isHovering) {
                    props.onHover(props.tank, card, props.index);
                }
            }, 150);
        });

        card.addEventListener("mouseleave", () => {
            isHovering = false;
            // Clear the open timer if mouse leaves quickly
            clearTimeout(hoverTimer);
        });
    }

    return card;
}
