# World of Tanks Tank Configurator

A responsive web application built with Vite, TypeScript, and vanilla JavaScript for configuring and viewing tank statistics in a World of Tanks inspired interface.

## Features

-   Interactive tank selection grid with 6 different tanks
-   Tank configuration panel with equipment options (Standard, Elite, Premium)
-   Experience calculation system based on battle count and configuration
-   Visual battle progress bar with draggable controller
-   Real-time input synchronization between progress bar and number input
-   Responsive design with different interaction modes:
    -   **Desktop**: Widget opens on hover
    -   **Mobile**: Widget opens on click
-   Pixel-perfect implementation matching the original design specifications

## Technical Details

-   **Framework**: Vite build tool
-   **Language**: TypeScript with vanilla JavaScript
-   **Styling**: CSS with CSS variables for theming
-   **Architecture**: Component-based with init pattern
-   **State Management**: Local state management with event-driven updates

## Project Structure

The project follows a modular component architecture with separate TypeScript and CSS files for each component. The main application logic handles tank selection, configuration management, and experience calculations.

## Live Demo

The project is deployed and available at: https://volcharamastering.github.io/wot-landing/
