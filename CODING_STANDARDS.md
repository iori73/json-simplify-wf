# Coding Standards - json-simplify

このドキュメントはプロジェクトのコーディング規約をまとめたものです。
Cursor Rules (`.cursor/rules/`) と連携して、AI と人間の両方が一貫したコードを書けるようにします。

## デザインシステム

### スペーシング

8px ベースのスペーシングスケールを使用：

| トークン | 値 | 用途 |
|---------|-----|------|
| `--space-xs` | 8px | コンポーネント内部の padding |
| `--space-sm` | 16px | 関連要素のグルーピング |
| `--space-md` | 24px | サブセクション間 |
| `--space-lg` | 32px | セクション内コンテンツ |
| `--space-xl` | 48px | 大きなセクション分割 |
| `--space-2xl` | 64px | トップレベルコンテナ |

```css
/* Good */
padding: var(--space-sm);

/* Bad */
padding: 15px;
```

### タイポグラフィ

| トークン | 値 | 用途 |
|---------|-----|------|
| `--text-xs` | 0.75rem | ラベル、注釈 |
| `--text-sm` | 0.875rem | 補助テキスト |
| `--text-base` | 1rem | 本文 |
| `--text-lg` | 1.125rem | 強調テキスト |
| `--text-xl` | 1.25rem | 小見出し |
| `--text-2xl` | 1.5rem | セクション見出し |
| `--text-3xl` | 2rem | ページ見出し |

### カラー

テーマ対応のため、セマンティックカラー変数を使用：

- `--bg-main`, `--bg-panel` - 背景色
- `--text-main`, `--text-muted` - テキスト色
- `--text-accent-1/2/3` - アクセントカラー
- `--border-main`, `--border-accent-*` - ボーダー色

```tsx
// Good: テーマ対応
<div className="bg-[var(--bg-panel)] text-[var(--text-main)]">

// Bad: ハードコード
<div className="bg-[#111111] text-[#e0e0e0]">
```

## React コンポーネント

### ファイル構造

```tsx
/**
 * コンポーネント名
 * 
 * 説明
 */

'use client';

import { useState } from 'react';
import { SomeType } from '@/lib/types';

interface ComponentProps {
    // Props 定義
}

export default function Component({ prop1 }: ComponentProps) {
    // 実装
}
```

### 命名規則

| 種類 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `JsonInput`, `TreeViewer` |
| 関数 | camelCase | `handleClick`, `validateJson` |
| Props型 | ComponentNameProps | `JsonInputProps` |
| イベントハンドラ | handle* | `handleTextChange` |
| コールバックProps | on* | `onChange`, `onNodeClick` |

### パターン

1. **Controlled Components** - 状態は親で管理
2. **Early Return** - エラー/空状態は最初に処理
3. **Pure Functions** - ユーティリティは純粋関数で

## ユーティリティ関数

### 原則

1. **純粋関数**: 副作用なし、同じ入力 = 同じ出力
2. **単一責任**: 1関数1機能
3. **明示的な型**: 戻り値の型を必ず指定
4. **JSDoc**: すべての export 関数にドキュメント

```typescript
/**
 * JSON文字列を検証する
 * @param jsonString - 検証する文字列
 * @returns 検証結果とエラーメッセージ
 */
export function validateJson(jsonString: string): { isValid: boolean; error: string | null } {
    // ...
}
```

## Cursor Rules

このプロジェクトには以下の Cursor Rules が設定されています：

- `.cursor/rules/design-system.mdc` - デザイントークンの使用規約
- `.cursor/rules/react-components.mdc` - Reactコンポーネントの規約
- `.cursor/rules/utilities.mdc` - ユーティリティ関数の規約

これらのルールは AI (Cursor) がコードを提案する際に自動的に参照されます。

