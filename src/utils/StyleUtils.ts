/**
 * Shared CSS variables and theming system
 */
export const CSS_VARIABLES = {
    // Colors
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    accentColor: '#ffd54f',
    successColor: '#4CAF50',
    dangerColor: '#f44336',
    warningColor: '#ff9800',
    
    // Backgrounds
    primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    darkBackground: '#1a1a1a',
    lightBackground: '#faf8ef',
    
    // Text colors
    primaryText: '#ffffff',
    secondaryText: '#888888',
    darkText: '#333333',
    
    // Spacing
    containerPadding: '20px',
    cardPadding: '25px 20px',
    buttonPadding: '10px 20px',
    
    // Border radius
    cardRadius: '15px',
    buttonRadius: '6px',
    smallRadius: '5px',
    
    // Shadows
    cardShadow: '0 10px 25px rgba(0,0,0,0.2)',
    buttonShadow: '0 4px 8px rgba(0,0,0,0.2)',
    
    // Transitions
    defaultTransition: 'all 0.3s ease',
    fastTransition: 'all 0.15s ease'
};

/**
 * Gets the shared CSS variables as a CSS string
 * @returns CSS variables string
 */
export function getCSSVariables(): string {
    return `
    :root {
        --primary-color: ${CSS_VARIABLES.primaryColor};
        --secondary-color: ${CSS_VARIABLES.secondaryColor};
        --accent-color: ${CSS_VARIABLES.accentColor};
        --success-color: ${CSS_VARIABLES.successColor};
        --danger-color: ${CSS_VARIABLES.dangerColor};
        --warning-color: ${CSS_VARIABLES.warningColor};
        --primary-gradient: ${CSS_VARIABLES.primaryGradient};
        --dark-background: ${CSS_VARIABLES.darkBackground};
        --light-background: ${CSS_VARIABLES.lightBackground};
        --primary-text: ${CSS_VARIABLES.primaryText};
        --secondary-text: ${CSS_VARIABLES.secondaryText};
        --dark-text: ${CSS_VARIABLES.darkText};
        --container-padding: ${CSS_VARIABLES.containerPadding};
        --card-padding: ${CSS_VARIABLES.cardPadding};
        --button-padding: ${CSS_VARIABLES.buttonPadding};
        --card-radius: ${CSS_VARIABLES.cardRadius};
        --button-radius: ${CSS_VARIABLES.buttonRadius};
        --small-radius: ${CSS_VARIABLES.smallRadius};
        --card-shadow: ${CSS_VARIABLES.cardShadow};
        --button-shadow: ${CSS_VARIABLES.buttonShadow};
        --default-transition: ${CSS_VARIABLES.defaultTransition};
        --fast-transition: ${CSS_VARIABLES.fastTransition};
    }`;
}

/**
 * Gets the base body styles
 * @returns Base body CSS
 */
export function getBaseBodyStyles(): string {
    return `
    body { 
        margin: 0; 
        padding: var(--container-padding); 
        background: var(--primary-gradient);
        font-family: -apple-system, Segoe UI, Arial, sans-serif;
        color: var(--primary-text);
        min-height: 100vh;
    }`;
}

/**
 * Gets the container styles
 * @returns Container CSS
 */
export function getContainerStyles(): string {
    return `
    .container {
        max-width: 600px;
        margin: 0 auto;
        text-align: center;
    }`;
}

/**
 * Gets the game card styles
 * @returns Game card CSS
 */
export function getGameCardStyles(): string {
    return `
    .game-card {
        background: rgba(255,255,255,0.1);
        border-radius: var(--card-radius);
        padding: var(--card-padding);
        cursor: pointer;
        transition: var(--default-transition);
        border: 2px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
    }
    .game-card:hover {
        background: rgba(255,255,255,0.2);
        transform: translateY(-5px);
        border-color: rgba(255,255,255,0.4);
        box-shadow: var(--card-shadow);
    }`;
}

/**
 * Gets the back button styles
 * @returns Back button CSS
 */
export function getBackButtonStyles(): string {
    return `
    .back-btn { 
        position: absolute; 
        top: 10px; 
        right: 10px; 
        background: rgba(0,0,0,0.5); 
        color: white; 
        border: none; 
        padding: 5px 10px; 
        border-radius: var(--small-radius); 
        cursor: pointer; 
        z-index: 1000; 
    }
    .back-btn:hover { 
        background: rgba(0,0,0,0.7); 
    }`;
}

/**
 * Gets the button styles
 * @returns Button CSS
 */
export function getButtonStyles(): string {
    return `
    .btn {
        background: var(--accent-color);
        color: var(--dark-text);
        border: none;
        padding: var(--button-padding);
        border-radius: var(--button-radius);
        font-size: 16px;
        cursor: pointer;
        margin-top: 15px;
        transition: var(--fast-transition);
    }
    .btn:hover {
        background: var(--warning-color);
        transform: translateY(-2px);
        box-shadow: var(--button-shadow);
    }`;
}

/**
 * Gets the stats styles
 * @returns Stats CSS
 */
export function getStatsStyles(): string {
    return `
    .stats {
        margin-top: 40px;
        padding: 20px;
        background: rgba(255,255,255,0.1);
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.2);
    }
    .stats h3 {
        margin-top: 0;
        margin-bottom: 15px;
    }
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 15px;
    }
    .stat-item {
        text-align: center;
    }
    .stat-value {
        font-size: 1.5em;
        font-weight: 600;
        color: var(--accent-color);
    }
    .stat-label {
        font-size: 0.8em;
        opacity: 0.8;
    }`;
}

/**
 * Gets all shared styles combined
 * @returns Complete shared CSS
 */
export function getAllSharedStyles(): string {
    return getCSSVariables() + 
           getBaseBodyStyles() + 
           getContainerStyles() + 
           getGameCardStyles() + 
           getBackButtonStyles() + 
           getButtonStyles() + 
           getStatsStyles();
}
