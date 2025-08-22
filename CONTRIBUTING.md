# Contributing to IDE Arcade 🎮

Thank you for your interest in contributing to IDE Arcade! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs
- Use the GitHub issue tracker
- Include detailed steps to reproduce the bug
- Specify your VS Code version and OS
- Include any error messages or console logs

### Suggesting Features
- Open a feature request issue
- Describe the feature and its use case
- Consider if it fits the project's scope (VS Code gaming extension)

### Code Contributions
- Fork the repository
- Create a feature branch (`git checkout -b feature/amazing-feature`)
- Make your changes
- Test thoroughly in VS Code
- Commit with clear, descriptive messages
- Push to your fork and submit a pull request

## 🛠️ Development Setup

### Prerequisites
- Node.js (16.x or higher)
- VS Code
- Git

### Local Development
1. Clone your fork: `git clone https://github.com/YOUR_USERNAME/cursorarcade.git`
2. Install dependencies: `npm install`
3. Compile TypeScript: `npm run compile`
4. Open in VS Code: `code .`
5. Press F5 to run the extension in a new Extension Development Host window

### Building
- `npm run compile` - Build the extension
- `npm run watch` - Watch for changes and rebuild automatically

## 📝 Code Style Guidelines

### TypeScript
- Use strict mode (already configured)
- Prefer `const` over `let` when possible
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### File Structure
- Keep files focused and single-purpose
- Use descriptive file names
- Follow the existing directory structure

### Git Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor" not "Moves cursor")
- Limit first line to 72 characters
- Reference issues when applicable

## 🎮 Adding New Games

To add a new game:

1. Create a new game class in `src/games/`
2. Implement the `GameInterface`
3. Add the game to the games array in `src/extension.ts`
4. Update the README.md with game information
5. Test thoroughly in different VS Code panels

### Game Interface Requirements
```typescript
interface GameInterface {
    name: string;
    description: string;
    controls: string;
    start(): void;
    stop(): void;
    getScore(): number;
    reset(): void;
}
```

## 🧪 Testing

### Manual Testing
- Test in VS Code sidebar, bottom panel, and new tab
- Test with different VS Code themes
- Test with different panel sizes
- Verify score persistence

### Automated Testing (Future)
- Unit tests for game logic
- Integration tests for VS Code API usage
- E2E tests for user workflows

## 📋 Pull Request Process

1. **Update Documentation**: Update README.md if adding new features
2. **Test Thoroughly**: Ensure the extension works in all VS Code contexts
3. **Follow Style**: Adhere to existing code style and patterns
4. **Describe Changes**: Provide clear description of what was changed and why
5. **Reference Issues**: Link any related issues or discussions

## 🏷️ Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md` with new features/fixes
3. Create a git tag for the version
4. Push to main branch
5. Create a GitHub release

## 📞 Getting Help

- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Code Review**: All PRs will be reviewed by maintainers

## 🎯 Project Goals

IDE Arcade aims to:
- Provide fun, lightweight games within VS Code
- Maintain good performance and minimal resource usage
- Keep the extension simple and focused
- Support VS Code's native UI patterns

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to IDE Arcade! 🎮✨**
