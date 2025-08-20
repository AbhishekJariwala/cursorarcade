# Debugging Guide for Subway Surfers Extension

If you're having trouble getting the extension to work, follow these steps:

## 🔍 **Step 1: Check Extension Loading**

1. **Open Command Palette**: `Cmd+Shift+P`
2. **Type**: "Developer: Show Running Extensions"
3. **Look for**: "subway-surfers-game" in the list
4. **Status should be**: "Activated"

## 🔍 **Step 2: Check Commands Availability**

1. **Open Command Palette**: `Cmd+Shift+P`
2. **Type**: "Subway Surfers"
3. **You should see**:
   - "Subway Surfers: Test Subway Surfers Extension"
   - "Subway Surfers: Start Subway Surfers (Tab)"
   - "Subway Surfers: Open Subway Surfers (Sidebar)"
   - "Subway Surfers: Open Subway Surfers (Bottom Panel)"

## 🔍 **Step 3: Test the Extension**

1. **Open Command Palette**: `Cmd+Shift+P`
2. **Type**: "Subway Surfers: Test Subway Surfers Extension"
3. **You should see**: A notification saying "Subway Surfers extension is working! 🎮"

## 🔍 **Step 4: Test Different Game Placements**

### **Option A: Open as Tab (Top)**
1. **Open Command Palette**: `Cmd+Shift+P`
2. **Type**: "Subway Surfers: Start Subway Surfers (Tab)"
3. **You should see**: A new tab opens with the Subway Surfers game!

### **Option B: Open in Sidebar (Left)**
1. **Open Command Palette**: `Cmd+Shift+P`
2. **Type**: "Subway Surfers: Open Subway Surfers (Sidebar)"
3. **Look for**: A new activity bar icon (🎮) on the left
4. **Click the icon** to open the sidebar
5. **You should see**: The game in the left sidebar

### **Option C: Open in Bottom Panel**
1. **Open Command Palette**: `Cmd+Shift+P`
2. **Type**: "Subway Surfers: Open Subway Surfers (Bottom Panel)"
3. **Look for**: A new panel at the bottom of VS Code
4. **You should see**: The game in the bottom panel

## 🔍 **Step 5: Check Console Output**

1. **Open Command Palette**: `Cmd+Shift+P`
2. **Type**: "Developer: Toggle Developer Tools"
3. **Go to Console tab**
4. **Look for these messages**:
   ```
   Subway Surfers extension is now active!
   Test webview view provider registered for subwaySurfersView
   Webview view providers registered successfully
   All commands registered successfully
   ```

## 🔍 **Step 6: Force Reload Extension**

If commands aren't working:
1. **Open Command Palette**: `Cmd+Shift+P`
2. **Type**: "Developer: Reload Window"
3. **Wait for VS Code to restart**
4. **Try the commands again**

## 🚨 **Common Issues & Solutions**

### **Issue**: Commands not showing up
**Solution**: 
- Make sure you're in the Extension Development Host window (not your main VS Code)
- Check that the extension compiled successfully
- Reload the window

### **Issue**: Sidebar shows "no data provider registered"
**Solution**:
- Check the console for error messages
- Make sure the webview view provider is properly registered
- Try the "Test Subway Surfers Extension" command first

### **Issue**: Extension not activating
**Solution**:
- Check the console for error messages
- Verify all files are in the correct locations
- Make sure TypeScript compiled without errors

### **Issue**: Game doesn't open
**Solution**:
- Check the console for error messages
- Make sure the webview panel is being created
- Verify the HTML content is being generated

## 📁 **File Structure Check**

Ensure your project looks like this:
```
vscodesubwaysurfers/
├── src/
│   └── extension.ts
├── out/
│   └── extension.js
├── media/
│   └── game.svg
├── package.json
├── tsconfig.json
└── .vscode/
    ├── launch.json
    └── tasks.json
```

## 🎯 **Quick Test Commands**

Try these commands in order:

1. `Cmd+Shift+P` → "Subway Surfers: Test Subway Surfers Extension"
2. `Cmd+Shift+P` → "Subway Surfers: Start Subway Surfers (Tab)"
3. `Cmd+Shift+P` → "Subway Surfers: Open Subway Surfers (Sidebar)"
4. Look for the new activity bar icon (🎮) and click it!

## 🎮 **How the Game Works**

- **Controls**: Use A/D or arrow keys to move between 3 lanes
- **Jump**: Press Space to jump over obstacles
- **Objective**: Collect coins and avoid obstacles
- **Scoring**: Base score increases over time, plus bonus points from coins

## 📞 **Still Having Issues?**

1. Check the Developer Tools console for error messages
2. Verify the extension is listed in "Developer: Show Running Extensions"
3. Try reloading the window
4. Make sure you're testing in the Extension Development Host window (Run menu → Start Debugging)

## 🔧 **Current Implementation**

The extension now supports **three different placements**:
- **Tab**: Opens in a new tab at the top
- **Sidebar**: Opens in the left sidebar with a custom activity bar icon
- **Bottom Panel**: Opens in a panel at the bottom of VS Code

The sidebar should now work with the test provider showing "Test View Working!" instead of the error message.
