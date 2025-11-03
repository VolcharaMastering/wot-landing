import "./tank-card.css";

export function initTankCard(props: TankCardProps): HTMLElement {
    const card = document.createElement("div");
    card.className = `tank-card`;

    card.innerHTML = `
      <img src="${props.tank.image}" alt="${props.tank.name}" class="tank-card__image">
      <h3 class="tank-card__name">${props.tank.name}</h3>
  `;

    card.addEventListener("click", (e: MouseEvent) => {
        props.onClick(props.tank, card, e, props.index);
    });

    return card;
}
