'use client'

import React from 'react'
import { ViewMode } from '@/types'

interface ViewTabsProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
  language: 'en' | 'jp' | 'es' | 'fr' | 'de' | 'zh' | 'ko' | 'pt'
}

export default function ViewTabs({ currentView, onViewChange, language }: ViewTabsProps) {
  const labels = {
    en: {
      tree: 'Tree',
      text: 'Text',
      table: 'Table (beta)'
    },
    jp: {
      tree: 'ツリー',
      text: 'テキスト',
      table: 'テーブル (ベータ)'
    },
    es: {
      tree: 'Árbol',
      text: 'Texto',
      table: 'Tabla (beta)'
    },
    fr: {
      tree: 'Arbre',
      text: 'Texte',
      table: 'Tableau (bêta)'
    },
    de: {
      tree: 'Baum',
      text: 'Text',
      table: 'Tabelle (Beta)'
    },
    zh: {
      tree: '树形',
      text: '文本',
      table: '表格 (测试版)'
    },
    ko: {
      tree: '트리',
      text: '텍스트',
      table: '테이블 (베타)'
    },
    pt: {
      tree: 'Árvore',
      text: 'Texto',
      table: 'Tabela (beta)'
    }
  }

  const t = labels[language]

  return (
    <div className="border-b bg-background">
      <div className="flex px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onViewChange('tree')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            currentView === 'tree'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {t.tree}
        </button>
        <button
          onClick={() => onViewChange('text')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            currentView === 'text'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {t.text}
        </button>
        <button
          disabled
          className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-muted-foreground/50 cursor-not-allowed"
        >
          {t.table}
        </button>
      </div>
    </div>
  )
}