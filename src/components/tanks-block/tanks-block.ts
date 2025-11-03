import { initTankCard } from "../UI/tank-card/tank-card";
import "./tanks-block.css";

export interface TanksBlockProps {
    tanks: TankData[];
    selectedTank: TankData | null;
    onTankSelect: (tank: TankData, targetEl: HTMLElement, e: MouseEvent, index: number) => void;
    onTankHover: (tank: TankData, targetEl: HTMLElement, index: number) => void;
    index: number;
}

export function initTanksBlock(props: TanksBlockProps): HTMLElement {
    const container = document.createElement("div");
    container.className = "tanks-block";

    const grid = document.createElement("div");
    grid.className = "tanks-block__grid";

    props.tanks.forEach((tank, index) => {
        const tankCard = initTankCard({
            tank,
            isSelected: props.selectedTank?.id === tank.id,
            onClick: props.onTankSelect,
            onHover: props.onTankHover,
            index,
        });
        grid.appendChild(tankCard);
    });

    container.appendChild(grid);
    return container;
}
