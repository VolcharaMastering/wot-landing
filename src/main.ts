import './styles/variables.css';
import './styles/theme.css';
import './style.css';

// import { initTankCard } from './components/features/tank-card/tank-card';
// import { initWidgetWindow } from './components/features/widget-window/widget-window';

function initApp(root: HTMLElement): void {
  // init components
  // const widget = initWidgetWindow(root);
  // const tankCard = initTankCard(widget);

}

const appRoot = document.getElementById('app') as HTMLElement;
if (appRoot) {
  initApp(appRoot);
}