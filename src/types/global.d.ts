interface AppState {
    selectedTank: TankData | null;
    selectedConfiguration: ConfigurationType;
    battles: number;
    experience: number;
    maxBattles: number;
    showWidget: boolean;
}

interface TankData {
    id: string;
    name: string;
    model: string;
    image: string;
    type: string;
    nation: string;
    tier: number;
    configuration: ConfigurationType;
    battles: number;
    experience: number;
    maxBattles: number;
}

type TankType = "T-34" | "KV-1" | "T-150";
type ConfigurationType = "Стандартная" | "Элитная" | "Премиум";

interface TanksBlockProps {
    tanks: TankData[];
    selectedTank: TankData | null;
    onTankSelect: (tank: TankData, targetEl: HTMLElement, e: MouseEvent, index: number) => void;
    index: number;
}

interface TankCardProps {
    tank: TankData;
    isSelected: boolean;
    onClick: (tank: TankData, targetEl: HTMLElement, e: MouseEvent, index: number) => void;
    onHover: (tank: TankData, targetEl: HTMLElement, index: number) => void;
    index: number;
}

interface TankWidgetProps {
    tank: TankData;
    state: AppState;
    onStateChange: (newState: Partial<AppState>) => void;
    onClose: () => void;
    targetEl: HTMLElement;
    index: number;
}
interface WidgetPlacement {
    left: number;
    top: number;
    arrowLeft: number;
    vertical: VerticalMode;
    arrowSide: ArrowSide;
}
type ArrowSide = "left" | "center" | "right";
type VerticalMode = "top" | "bottom";

interface BattlesState {
    battles: number;
    maxBattles: number;
}
interface ExperienceCalculation {
    baseExperience: number;
    bonusMultiplier: number;
    bonusExperience: number;
    totalExperience: number;
}
