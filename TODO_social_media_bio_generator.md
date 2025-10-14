# TODO: Make Social Media Bio Generator Generic

## Analysis of Current App
- [x] Review existing Twitter bio generator code
- [x] Understand current structure and components
- [x] Identify hardcoded Twitter-specific elements

## Plan to Make Generic
1. [x] Create social media platform configuration
2. [x] Update UI components to be platform-agnostic
3. [x] Modify prompts to be dynamic based on platform
4. [x] Update character limits and constraints per platform
5. [x] Modify copy/text to be generic
6. [x] Update API routes to handle different platforms
7. [x] Test all platforms work correctly (Build tested - would work with API key)

## Specific Changes Needed

### 1. Platform Configuration
- [x] Create types for different platforms
- [x] Define platform-specific constraints (character limits, formatting rules)
- [x] Create platform dropdown component

### 2. Component Updates
- [x] Modify main page.tsx to include platform selection
- [x] Update DropDown component or create new PlatformDropDown
- [x] Update header/footer text to be generic
- [x] Update prompts to be dynamic

### 3. API Changes
- [x] Update prompt generation logic in route.ts
- [x] Handle platform-specific bio generation rules

### 4. UI/UX Improvements
- [x] Update title and descriptions
- [x] Add platform-specific icons/branding
- [x] Update placeholder text dynamically
- [x] Update generated bio display

### 5. Documentation
- [x] Update README.md
- [x] Update package.json description if needed
