# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite template using rolldown-vite for fast development and optimized builds, managed with Deno. The project features:
- React 19 with TypeScript
- Vite with rolldown bundler (via `npm:rolldown-vite@7.1.14`)
- ESLint with React Hooks and React Refresh plugins
- Hot Module Replacement (HMR) for rapid development
- Deno for package/dependency management with `deno.lock`

## Commands

Use `deno` CLI to run scripts defined in `package.json`. Deno automatically manages npm dependencies via the lock file.

### Development

- `deno run dev` - Start the development server with HMR on `http://localhost:5173`
- `deno run preview` - Preview the production build locally

### Build & Testing

- `deno run build` - Build for production (runs `tsc -b` for type checking, then `vite build`)
- `deno run lint` - Run ESLint on all TypeScript/TSX files

### Build Behavior

The build process has two phases:

1. **Type checking**: `tsc -b` uses project references across `tsconfig.app.json` and `tsconfig.node.json` for incremental builds
2. **Bundle**: `vite build` generates optimized production assets in the `dist/` directory

### Dependency Management

- Dependencies are managed through `package.json` but locked via `deno.lock`
- Use `deno cache --reload` to refresh the lock file if needed
- The `deno.lock` file should be committed to version control

## Architecture

### Project Structure
```
src/
├── main.tsx         - Entry point, renders App in #root element with React StrictMode
├── App.tsx          - Main component with example counter using useState
├── App.css          - Styles specific to App component
├── index.css        - Global styles
└── assets/          - Static assets (React logo, etc.)
```

### TypeScript Configuration

**tsconfig.app.json** (application code):
- Target: ES2022
- Strict mode enabled with no unused variables/parameters (`strict`, `noUnusedLocals`, `noUnusedParameters`)
- JSX: react-jsx (React 17+ automatic JSX transform)
- Module resolution: bundler mode with ES modules
- Nonemit mode (Vite handles compilation)

**tsconfig.node.json**: Configuration for Vite and build scripts

### ESLint Setup

The ESLint configuration ([eslint.config.js](eslint.config.js)) includes:
- JavaScript recommended rules
- TypeScript ESLint recommended rules
- React Hooks rules (`react-hooks/recommended-latest`)
- React Refresh rules for HMR compatibility

Rules are enforced on all `**/*.{ts,tsx}` files with `dist/` ignored.

## React Setup Notes

- **React Compiler**: Not enabled by default due to performance impact on dev/build. See [React Compiler docs](https://react.dev/learn/react-compiler/installation) to enable.
- **Plugin**: Uses `@vitejs/plugin-react` with Babel/oxc for Fast Refresh
- **StrictMode**: Enabled in production to help identify issues during development

## Development Tips

- Hot Module Replacement (HMR) is enabled by default - changes to components reflect instantly without full page reload
- The strict TypeScript configuration ensures type safety; adjust `noUnusedLocals`/`noUnusedParameters` as needed during development

## Git Branch Management Rules

### Core Principles

1. **No direct commits to master**: Master branch must never receive direct commits
2. **Branch creation required**: Always create a branch before editing and committing files
3. **Branch name prefixes** (required):
   - `feature/` - New feature development
   - `fix/` - Bug fixes
   - `chore/` - Refactoring, documentation updates, etc.
   - `posts/${yyyymmdd}` - Writing daily posts (e.g., `posts/20250122`)
4. **English branch names**: Branch names must be in English
5. **Concise naming**: Keep branch names short and descriptive
6. **No direct merges**: Never merge development branches directly to master
7. **Pull Request required**: All merges must go through GitHub Pull Requests
8. **No rebasing**: Do not use `git rebase`. Use `git merge` to resolve conflicts
9. **PR template required**: Follow `.github/pull_request_template.md` for all PRs

### Branch Name Examples

```bash
# Good examples
feature/user-authentication
fix/login-error
chore/update-dependencies
posts/20250101

# Bad examples
new-feature
修正
my-branch
posts/2025
```

### Conflict Resolution Steps

When master conflicts with your branch:

1. Switch to master: `git checkout master`
2. Fetch latest changes: `git pull origin master`
3. Return to your branch: `git checkout [branch-name]`
4. Merge master: `git merge master`
5. Resolve conflicts manually in editor
6. Stage resolved files: `git add [resolved-files]`
7. Complete merge: `git commit` (use default message)
8. Push changes: `git push origin [branch-name]`

**Important**: Never use `git rebase`

### Commit Message Rules

1. **Per-file change explanations**: When changing multiple files, explain each file's change reason individually
2. **Clear intent**: Explain why the change was made, not just what changed

#### Commit Message Examples

```bash
# Good example (multiple files)
feat: ユーザー認証機能の実装

- src/auth/login.ts: ログイン処理のロジックを実装
- src/auth/logout.ts: ログアウト処理とセッションクリアを追加
- src/components/LoginForm.tsx: ログインフォームUIコンポーネントを作成
- src/hooks/useAuth.ts: 認証状態管理のカスタムフックを実装

# Good example (single file)
fix: ログイン時のエラーハンドリングを修正

- src/auth/login.ts: APIエラー時の例外処理を追加し、ユーザーに適切なメッセージを表示するように修正
```

## TypeScript Coding Rules

### Variable and Function Naming

- Use **camelCase** for variable and function names

```typescript
// Good
const playerScore = 10;
const calculateTotal = () => { ... }

// Bad
const player_score = 10;
function CalculateTotal() { ... }
```

- Variables use nouns/noun phrases
- Functions use verbs/verb phrases

```typescript
// Good
const userCount = 10;
const getUserData = () => { ... }

// Bad
const getCount = 10;
function userData() { ... }
```

- Use prefixes `is`, `has`, `can` for boolean variables

```typescript
// Good
const isActive = true;
const hasPermission = false;
```

- Constants use **camelCase** or **UPPER_SNAKE_CASE**

```typescript
// Both acceptable
const maxItems = 30;
const MAX_ITEMS = 30;
```

### Classes

- Use **PascalCase** for class names

```typescript
// Good
class UserProfile { ... }

// Bad
class userProfile { ... }
```

- Private members/methods use underscore prefix `_`

```typescript
class User {
  private _id: string;

  constructor(id: string) {
    this._id = id;
  }

  private _validateId() { ... }
}
```

### Interfaces and Types

- Use **PascalCase** for interface names

```typescript
// Both acceptable
interface UserData { ... }
interface IUserData { ... }
```

- Use **PascalCase** for type aliases

```typescript
type UserId = string;
type RequestStatus = 'pending' | 'success' | 'error';
```

### Namespaces and Enums

- Use **PascalCase** for namespace names

```typescript
namespace Validation { ... }
```

- Use **PascalCase** for enum names and members

```typescript
enum Direction {
  North,
  East,
  South,
  West
}
```

### null vs undefined

- Use `null` for intentionally missing values
- Use `undefined` for unassigned values
- Prefer `undefined` when possible

```typescript
// Good - unassigned
let userInput: string | undefined;

// Good - intentionally missing
const userNotFound = null;
```

### Formatting

- Use **2 spaces** for indentation
- Limit lines to **80-120 characters**
- Add blank lines between related code blocks

```typescript
const calculateTotal = (items: Item[]): number => {
  if (items.length === 0) {
    return 0;
  }

  return items.reduce((total, item) => {
    return total + item.price;
  }, 0);
}
```

### Quotes and Semicolons

- Use **double quotes** (`"`) consistently for strings
- Use **backticks** (`` ` ``) for template literals
- End all statements with **semicolons** (`;`)

```typescript
const name = "John";
const greeting = `Hello, ${name}!`;
const x = 5;
```

### Arrays

- Prefer `T[]` over `Array<T>`

```typescript
// Good
const items: string[] = ['a', 'b', 'c'];

// Not preferred
const items: Array<string> = ['a', 'b', 'c'];
```

### Object Literals

- Use shorthand when property name matches variable name

```typescript
// Good
const name = 'John';
const age = 30;
const user = { name, age };

// Verbose
const user = { name: name, age: age };
```

### Property Access

- Use dot notation for camelCase properties
- Use bracket notation for non-camelCase properties

```typescript
// Good
object.property = 5;
object['kebab-case-property'] = 5;
```

### Comments

- Write comments in **Japanese**
- Use JSDoc style for documenting functions, classes, and interfaces

```typescript
/**
 * ユーザーを表すインターフェース
 */
interface User {
  id: string;
  name: string;
  age: number;
}

/**
 * ユーザーデータをフェッチする関数
 * @param userId ユーザーID
 * @returns ユーザーオブジェクトを含むPromise
 */
async const fetchUser = (userId: string): Promise<User> => {
  // ...
}
```

### TSX Loop Processing

- Always set `key` prop to avoid "Missing key" warnings
- Never use array index as key

```tsx
const items = ["apple", "banana", "orange"];

// Good
items.map((item) => <li key={item}>{item}</li>);

// Bad - using index
items.map((item, index) => <li key={index}>{item}</li>);
```

### Test Case Naming Rules

1. Describe specific behavior clearly
2. Show capability with phrases like "can", "becomes", "functions as"
3. Clearly state expected results

#### Good Examples

- ✅ `ボタンを非活性にできる`
- ✅ `クリックイベントが発火する`
- ✅ `デフォルトでprimaryスタイルになる`
- ✅ `外部リンクとして機能する`

#### Bad Examples

- ❌ `disabled属性が正しく適用される`
- ❌ `正しく表示される`
- ❌ `適切に処理される`

### Best Practices

- **Avoid `any` type** - type safety is mandatory
- Use assertion functions when needed
- Only use `as` type assertions in test files or when context is obvious

```typescript
// Preferred assertion function
function isDuck(animal: Animal): asserts animal is Duck {
  if (walksLikeDuck(animal) && quacksLikeDuck(animal)) {
    return;
  }
  throw new Error("YOU ARE A FROG!!!");
}

isDuck(animal);
animal.quacks(); // TypeScript knows this exists

// Acceptable in tests
const length = (value as string).length;

// Not preferred
const length = (<string>value).length;
```

- Use `readonly` for properties that should not change

```typescript
interface Config {
  readonly apiKey: string;
  readonly maxRetries: number;
}
```

- Use modern TypeScript features: Nullish Coalescing, Optional Chaining

```typescript
// Nullish Coalescing
const value = someValue ?? defaultValue;

// Optional Chaining
const name = user?.profile?.name;
```

### Test File Mock Exceptions

In test files (`*.test.ts`, `*.test.tsx`), `any` type is permitted for mock return values. **Must include the following comment annotation to bypass linting errors:**

```typescript
// Good example
it("テストケース名", () => {
  const mockData = ["item1", "item2"];
  // biome-ignore lint/suspicious/noExplicitAny: テストファイルでのモックのため許可
  vi.mocked(someFunction).mockReturnValue(mockData as any);
});

// Bad example (missing annotation)
it("テストケース名", () => {
  const mockData = ["item1", "item2"];
  vi.mocked(someFunction).mockReturnValue(mockData as any); // Linting error
});
```

**Important**: This exception applies only to test file mocks. Production code must never use `any` type.
