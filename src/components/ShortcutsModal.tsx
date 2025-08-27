'use client'

import React, { useEffect } from 'react'
import { X, Command } from 'lucide-react'

interface ShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
  language: 'en' | 'jp' | 'es' | 'fr' | 'de' | 'zh' | 'ko' | 'pt'
}

export default function ShortcutsModal({ isOpen, onClose, language }: ShortcutsModalProps) {
  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])
  const labels = {
    en: {
      title: 'Keyboard Shortcuts',
      general: 'General',
      navigation: 'Navigation',
      editing: 'Editing'
    },
    jp: {
      title: 'キーボードショートカット',
      general: '一般',
      navigation: 'ナビゲーション',
      editing: '編集'
    },
    es: {
      title: 'Atajos de Teclado',
      general: 'General',
      navigation: 'Navegación',
      editing: 'Edición'
    },
    fr: {
      title: 'Raccourcis Clavier',
      general: 'Général',
      navigation: 'Navigation',
      editing: 'Édition'
    },
    de: {
      title: 'Tastenkürzel',
      general: 'Allgemein',
      navigation: 'Navigation',
      editing: 'Bearbeitung'
    },
    zh: {
      title: '键盘快捷键',
      general: '常规',
      navigation: '导航',
      editing: '编辑'
    },
    ko: {
      title: '키보드 단축키',
      general: '일반',
      navigation: '탐색',
      editing: '편집'
    },
    pt: {
      title: 'Atalhos de Teclado',
      general: 'Geral',
      navigation: 'Navegação',
      editing: 'Edição'
    }
  }

  const shortcuts = {
    en: {
      general: [
        { keys: ['⌘', 'V'], description: 'Paste JSON' },
        { keys: ['⌘', 'F'], description: 'Search' },
        { keys: ['⌘', 'D'], description: 'Toggle theme' },
        { keys: ['?'], description: 'Show shortcuts' },
        { keys: ['Esc'], description: 'Close modals/panels' }
      ],
      navigation: [
        { keys: ['⌥⌘', '→'], description: 'Expand all nodes' },
        { keys: ['⌥⌘', '←'], description: 'Collapse all nodes' },
        { keys: ['↑', '↓'], description: 'Navigate search results' }
      ],
      editing: [
        { keys: ['⌘', 'K'], description: 'Copy selected path' },
        { keys: ['⌘', 'C'], description: 'Copy selected value' },
        { keys: ['⌘', 'S'], description: 'Save/Download' }
      ]
    },
    jp: {
      general: [
        { keys: ['⌘', 'V'], description: 'JSONを貼り付け' },
        { keys: ['⌘', 'F'], description: '検索' },
        { keys: ['⌘', 'D'], description: 'テーマ切り替え' },
        { keys: ['?'], description: 'ショートカット表示' },
        { keys: ['Esc'], description: 'モーダル/パネルを閉じる' }
      ],
      navigation: [
        { keys: ['⌥⌘', '→'], description: 'すべてのノードを展開' },
        { keys: ['⌥⌘', '←'], description: 'すべてのノードを折りたたむ' },
        { keys: ['↑', '↓'], description: '検索結果をナビゲート' }
      ],
      editing: [
        { keys: ['⌘', 'K'], description: '選択されたパスをコピー' },
        { keys: ['⌘', 'C'], description: '選択された値をコピー' },
        { keys: ['⌘', 'S'], description: '保存/ダウンロード' }
      ]
    },
    es: {
      general: [
        { keys: ['⌘', 'V'], description: 'Pegar JSON' },
        { keys: ['⌘', 'F'], description: 'Buscar' },
        { keys: ['⌘', 'D'], description: 'Alternar tema' },
        { keys: ['?'], description: 'Mostrar atajos' },
        { keys: ['Esc'], description: 'Cerrar modales/paneles' }
      ],
      navigation: [
        { keys: ['⌥⌘', '→'], description: 'Expandir todos los nodos' },
        { keys: ['⌥⌘', '←'], description: 'Contraer todos los nodos' },
        { keys: ['↑', '↓'], description: 'Navegar resultados de búsqueda' }
      ],
      editing: [
        { keys: ['⌘', 'K'], description: 'Copiar ruta seleccionada' },
        { keys: ['⌘', 'C'], description: 'Copiar valor seleccionado' },
        { keys: ['⌘', 'S'], description: 'Guardar/Descargar' }
      ]
    },
    fr: {
      general: [
        { keys: ['⌘', 'V'], description: 'Coller JSON' },
        { keys: ['⌘', 'F'], description: 'Rechercher' },
        { keys: ['⌘', 'D'], description: 'Basculer le thème' },
        { keys: ['?'], description: 'Afficher les raccourcis' },
        { keys: ['Esc'], description: 'Fermer modales/panneaux' }
      ],
      navigation: [
        { keys: ['⌥⌘', '→'], description: 'Développer tous les nœuds' },
        { keys: ['⌥⌘', '←'], description: 'Réduire tous les nœuds' },
        { keys: ['↑', '↓'], description: 'Naviguer dans les résultats' }
      ],
      editing: [
        { keys: ['⌘', 'K'], description: 'Copier le chemin sélectionné' },
        { keys: ['⌘', 'C'], description: 'Copier la valeur sélectionnée' },
        { keys: ['⌘', 'S'], description: 'Sauvegarder/Télécharger' }
      ]
    },
    de: {
      general: [
        { keys: ['⌘', 'V'], description: 'JSON einfügen' },
        { keys: ['⌘', 'F'], description: 'Suchen' },
        { keys: ['⌘', 'D'], description: 'Design umschalten' },
        { keys: ['?'], description: 'Tastenkürzel anzeigen' },
        { keys: ['Esc'], description: 'Modale/Panels schließen' }
      ],
      navigation: [
        { keys: ['⌥⌘', '→'], description: 'Alle Knoten erweitern' },
        { keys: ['⌥⌘', '←'], description: 'Alle Knoten einklappen' },
        { keys: ['↑', '↓'], description: 'Suchergebnisse navigieren' }
      ],
      editing: [
        { keys: ['⌘', 'K'], description: 'Ausgewählten Pfad kopieren' },
        { keys: ['⌘', 'C'], description: 'Ausgewählten Wert kopieren' },
        { keys: ['⌘', 'S'], description: 'Speichern/Herunterladen' }
      ]
    },
    zh: {
      general: [
        { keys: ['⌘', 'V'], description: '粘贴JSON' },
        { keys: ['⌘', 'F'], description: '搜索' },
        { keys: ['⌘', 'D'], description: '切换主题' },
        { keys: ['?'], description: '显示快捷键' },
        { keys: ['Esc'], description: '关闭模态框/面板' }
      ],
      navigation: [
        { keys: ['⌥⌘', '→'], description: '展开所有节点' },
        { keys: ['⌥⌘', '←'], description: '折叠所有节点' },
        { keys: ['↑', '↓'], description: '浏览搜索结果' }
      ],
      editing: [
        { keys: ['⌘', 'K'], description: '复制选中路径' },
        { keys: ['⌘', 'C'], description: '复制选中值' },
        { keys: ['⌘', 'S'], description: '保存/下载' }
      ]
    },
    ko: {
      general: [
        { keys: ['⌘', 'V'], description: 'JSON 붙여넣기' },
        { keys: ['⌘', 'F'], description: '검색' },
        { keys: ['⌘', 'D'], description: '테마 전환' },
        { keys: ['?'], description: '단축키 표시' },
        { keys: ['Esc'], description: '모달/패널 닫기' }
      ],
      navigation: [
        { keys: ['⌥⌘', '→'], description: '모든 노드 펼치기' },
        { keys: ['⌥⌘', '←'], description: '모든 노드 접기' },
        { keys: ['↑', '↓'], description: '검색 결과 탐색' }
      ],
      editing: [
        { keys: ['⌘', 'K'], description: '선택한 경로 복사' },
        { keys: ['⌘', 'C'], description: '선택한 값 복사' },
        { keys: ['⌘', 'S'], description: '저장/다운로드' }
      ]
    },
    pt: {
      general: [
        { keys: ['⌘', 'V'], description: 'Colar JSON' },
        { keys: ['⌘', 'F'], description: 'Buscar' },
        { keys: ['⌘', 'D'], description: 'Alternar tema' },
        { keys: ['?'], description: 'Mostrar atalhos' },
        { keys: ['Esc'], description: 'Fechar modais/painéis' }
      ],
      navigation: [
        { keys: ['⌥⌘', '→'], description: 'Expandir todos os nós' },
        { keys: ['⌥⌘', '←'], description: 'Recolher todos os nós' },
        { keys: ['↑', '↓'], description: 'Navegar nos resultados' }
      ],
      editing: [
        { keys: ['⌘', 'K'], description: 'Copiar caminho selecionado' },
        { keys: ['⌘', 'C'], description: 'Copiar valor selecionado' },
        { keys: ['⌘', 'S'], description: 'Salvar/Baixar' }
      ]
    }
  }

  const t = labels[language]
  const s = shortcuts[language]

  if (!isOpen) return null

  const KeyCombo = ({ keys }: { keys: string[] }) => (
    <div className="flex items-center space-x-1">
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-muted-foreground">+</span>}
          <kbd className="inline-flex items-center px-2 py-1 bg-muted rounded text-xs font-mono">
            {key === '⌘' && <Command className="h-3 w-3" />}
            {key !== '⌘' && key}
          </kbd>
        </React.Fragment>
      ))}
    </div>
  )

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-background border rounded-lg shadow-lg w-full max-w-2xl max-h-5/6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{t.title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-medium mb-3">{t.general}</h3>
            <div className="space-y-2">
              {s.general.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className="text-sm">{shortcut.description}</span>
                  <KeyCombo keys={shortcut.keys} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">{t.navigation}</h3>
            <div className="space-y-2">
              {s.navigation.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className="text-sm">{shortcut.description}</span>
                  <KeyCombo keys={shortcut.keys} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">{t.editing}</h3>
            <div className="space-y-2">
              {s.editing.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className="text-sm">{shortcut.description}</span>
                  <KeyCombo keys={shortcut.keys} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}