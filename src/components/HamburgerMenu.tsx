'use client'

import React, { useState, useEffect } from 'react'
import { 
  Menu, X, FileText, Upload, Sparkles, Archive, CheckCircle, 
  RefreshCw, Save, Share, Globe, HelpCircle, ChevronDown 
} from 'lucide-react'

interface HamburgerMenuProps {
  onPaste: () => void
  onUpload: () => void
  onBeautify: () => void
  onMinify: () => void
  onValidate: () => void
  onConvert: (format: 'csv' | 'yaml') => void
  onSave: (format: 'json' | 'csv' | 'yaml') => void
  onShare: () => void
  language: 'en' | 'jp' | 'es' | 'fr' | 'de' | 'zh' | 'ko' | 'pt'
  onLanguageChange: (lang: 'en' | 'jp' | 'es' | 'fr' | 'de' | 'zh' | 'ko' | 'pt') => void
  onShowShortcuts: () => void
}

export default function HamburgerMenu({
  onPaste,
  onUpload,
  onBeautify,
  onMinify,
  onValidate,
  onConvert,
  onSave,
  onShare,
  language,
  onLanguageChange,
  onShowShortcuts
}: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showConvertSubmenu, setShowConvertSubmenu] = useState(false)
  const [showSaveSubmenu, setShowSaveSubmenu] = useState(false)
  const [showLanguageSubmenu, setShowLanguageSubmenu] = useState(false)

  const labels = {
    en: {
      menu: 'Menu',
      fileOperations: 'File Operations',
      paste: 'Paste JSON',
      upload: 'Upload File',
      jsonOperations: 'JSON Operations', 
      beautify: 'Beautify',
      minify: 'Minify',
      advancedFeatures: 'Advanced Features',
      validate: 'Validate Schema',
      convert: 'Convert Format',
      save: 'Save / Download',
      share: 'Share URL',
      settings: 'Settings',
      language: 'Language',
      shortcuts: 'Keyboard Shortcuts',
      close: 'Close Menu'
    },
    jp: {
      menu: 'メニュー',
      fileOperations: 'ファイル操作',
      paste: 'JSON貼り付け',
      upload: 'ファイルアップロード',
      jsonOperations: 'JSON操作',
      beautify: '整形',
      minify: '圧縮',
      advancedFeatures: '高度な機能',
      validate: 'スキーマ検証',
      convert: '形式変換',
      save: '保存/ダウンロード',
      share: 'URL共有',
      settings: '設定',
      language: '言語',
      shortcuts: 'キーボードショートカット',
      close: 'メニューを閉じる'
    },
    es: {
      menu: 'Menú',
      fileOperations: 'Operaciones de Archivo',
      paste: 'Pegar JSON',
      upload: 'Subir Archivo',
      jsonOperations: 'Operaciones JSON',
      beautify: 'Formatear',
      minify: 'Minificar',
      advancedFeatures: 'Funciones Avanzadas',
      validate: 'Validar Esquema',
      convert: 'Convertir Formato',
      save: 'Guardar / Descargar',
      share: 'Compartir URL',
      settings: 'Configuración',
      language: 'Idioma',
      shortcuts: 'Atajos de Teclado',
      close: 'Cerrar Menú'
    },
    fr: {
      menu: 'Menu',
      fileOperations: 'Opérations Fichier',
      paste: 'Coller JSON',
      upload: 'Télécharger Fichier',
      jsonOperations: 'Opérations JSON',
      beautify: 'Formater',
      minify: 'Minifier',
      advancedFeatures: 'Fonctions Avancées',
      validate: 'Valider Schéma',
      convert: 'Convertir Format',
      save: 'Sauvegarder / Télécharger',
      share: 'Partager URL',
      settings: 'Paramètres',
      language: 'Langue',
      shortcuts: 'Raccourcis Clavier',
      close: 'Fermer Menu'
    },
    de: {
      menu: 'Menü',
      fileOperations: 'Dateioperationen',
      paste: 'JSON Einfügen',
      upload: 'Datei Hochladen',
      jsonOperations: 'JSON-Operationen',
      beautify: 'Formatieren',
      minify: 'Minifizieren',
      advancedFeatures: 'Erweiterte Funktionen',
      validate: 'Schema Validieren',
      convert: 'Format Konvertieren',
      save: 'Speichern / Herunterladen',
      share: 'URL Teilen',
      settings: 'Einstellungen',
      language: 'Sprache',
      shortcuts: 'Tastaturkürzel',
      close: 'Menü Schließen'
    },
    zh: {
      menu: '菜单',
      fileOperations: '文件操作',
      paste: '粘贴JSON',
      upload: '上传文件',
      jsonOperations: 'JSON操作',
      beautify: '格式化',
      minify: '压缩',
      advancedFeatures: '高级功能',
      validate: '验证模式',
      convert: '转换格式',
      save: '保存/下载',
      share: '分享URL',
      settings: '设置',
      language: '语言',
      shortcuts: '键盘快捷键',
      close: '关闭菜单'
    },
    ko: {
      menu: '메뉴',
      fileOperations: '파일 작업',
      paste: 'JSON 붙여넣기',
      upload: '파일 업로드',
      jsonOperations: 'JSON 작업',
      beautify: '정리',
      minify: '압축',
      advancedFeatures: '고급 기능',
      validate: '스키마 검증',
      convert: '형식 변환',
      save: '저장 / 다운로드',
      share: 'URL 공유',
      settings: '설정',
      language: '언어',
      shortcuts: '키보드 단축키',
      close: '메뉴 닫기'
    },
    pt: {
      menu: 'Menu',
      fileOperations: 'Operações de Arquivo',
      paste: 'Colar JSON',
      upload: 'Carregar Arquivo',
      jsonOperations: 'Operações JSON',
      beautify: 'Formatar',
      minify: 'Minificar',
      advancedFeatures: 'Recursos Avançados',
      validate: 'Validar Schema',
      convert: 'Converter Formato',
      save: 'Salvar / Baixar',
      share: 'Compartilhar URL',
      settings: 'Configurações',
      language: 'Idioma',
      shortcuts: 'Atalhos do Teclado',
      close: 'Fechar Menu'
    }
  }

  const t = labels[language]

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isOpen && !target.closest('[data-hamburger-menu]')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const handleMenuAction = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  const MenuButton = ({ 
    onClick, 
    icon: Icon, 
    children, 
    hasSubmenu = false,
    showSubmenu = false,
    onToggleSubmenu 
  }: { 
    onClick?: () => void
    icon: any
    children: React.ReactNode
    hasSubmenu?: boolean
    showSubmenu?: boolean
    onToggleSubmenu?: () => void
  }) => (
    <button
      onClick={hasSubmenu ? onToggleSubmenu : () => onClick && handleMenuAction(onClick)}
      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-4 w-4" />
        <span>{children}</span>
      </div>
      {hasSubmenu && <ChevronDown className={`h-4 w-4 transition-transform ${showSubmenu ? 'rotate-180' : ''}`} />}
    </button>
  )

  const SubmenuButton = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => (
    <button
      onClick={() => handleMenuAction(onClick)}
      className="w-full text-left px-6 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors ml-4"
    >
      {children}
    </button>
  )

  return (
    <div className="relative" data-hamburger-menu>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors lg:hidden"
        aria-label={t.menu}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-16 left-0 right-0 bg-background border-b border-border shadow-lg z-50 lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-4 space-y-1">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-border">
                <h2 className="font-semibold text-foreground">{t.menu}</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-accent rounded"
                  aria-label={t.close}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* File Operations Section */}
              <div className="space-y-1">
                <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.fileOperations}
                </div>
                <MenuButton onClick={onPaste} icon={FileText}>
                  {t.paste}
                </MenuButton>
                <MenuButton onClick={onUpload} icon={Upload}>
                  {t.upload}
                </MenuButton>
              </div>

              {/* JSON Operations Section */}
              <div className="space-y-1">
                <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.jsonOperations}
                </div>
                <MenuButton onClick={onBeautify} icon={Sparkles}>
                  {t.beautify}
                </MenuButton>
                <MenuButton onClick={onMinify} icon={Archive}>
                  {t.minify}
                </MenuButton>
              </div>

              {/* Advanced Features Section */}
              <div className="space-y-1">
                <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.advancedFeatures}
                </div>
                <MenuButton onClick={onValidate} icon={CheckCircle}>
                  {t.validate}
                </MenuButton>
                
                {/* Convert Submenu */}
                <MenuButton 
                  icon={RefreshCw} 
                  hasSubmenu
                  showSubmenu={showConvertSubmenu}
                  onToggleSubmenu={() => setShowConvertSubmenu(!showConvertSubmenu)}
                >
                  {t.convert}
                </MenuButton>
                {showConvertSubmenu && (
                  <div className="space-y-1 pl-4">
                    <SubmenuButton onClick={() => onConvert('csv')}>CSV</SubmenuButton>
                    <SubmenuButton onClick={() => onConvert('yaml')}>YAML</SubmenuButton>
                  </div>
                )}

                {/* Save Submenu */}
                <MenuButton 
                  icon={Save} 
                  hasSubmenu
                  showSubmenu={showSaveSubmenu}
                  onToggleSubmenu={() => setShowSaveSubmenu(!showSaveSubmenu)}
                >
                  {t.save}
                </MenuButton>
                {showSaveSubmenu && (
                  <div className="space-y-1 pl-4">
                    <SubmenuButton onClick={() => onSave('json')}>JSON</SubmenuButton>
                    <SubmenuButton onClick={() => onSave('csv')}>CSV</SubmenuButton>
                    <SubmenuButton onClick={() => onSave('yaml')}>YAML</SubmenuButton>
                  </div>
                )}

                <MenuButton onClick={onShare} icon={Share}>
                  {t.share}
                </MenuButton>
              </div>

              {/* Settings Section */}
              <div className="space-y-1">
                <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.settings}
                </div>
                
                {/* Language Submenu */}
                <MenuButton 
                  icon={Globe} 
                  hasSubmenu
                  showSubmenu={showLanguageSubmenu}
                  onToggleSubmenu={() => setShowLanguageSubmenu(!showLanguageSubmenu)}
                >
                  {t.language}
                </MenuButton>
                {showLanguageSubmenu && (
                  <div className="space-y-1 pl-4">
                    <SubmenuButton onClick={() => onLanguageChange('en')}>
                      English {language === 'en' && '✓'}
                    </SubmenuButton>
                    <SubmenuButton onClick={() => onLanguageChange('jp')}>
                      日本語 {language === 'jp' && '✓'}
                    </SubmenuButton>
                    <SubmenuButton onClick={() => onLanguageChange('es')}>
                      Español {language === 'es' && '✓'}
                    </SubmenuButton>
                    <SubmenuButton onClick={() => onLanguageChange('fr')}>
                      Français {language === 'fr' && '✓'}
                    </SubmenuButton>
                    <SubmenuButton onClick={() => onLanguageChange('de')}>
                      Deutsch {language === 'de' && '✓'}
                    </SubmenuButton>
                    <SubmenuButton onClick={() => onLanguageChange('zh')}>
                      中文 {language === 'zh' && '✓'}
                    </SubmenuButton>
                    <SubmenuButton onClick={() => onLanguageChange('ko')}>
                      한국어 {language === 'ko' && '✓'}
                    </SubmenuButton>
                    <SubmenuButton onClick={() => onLanguageChange('pt')}>
                      Português {language === 'pt' && '✓'}
                    </SubmenuButton>
                  </div>
                )}

                <MenuButton onClick={onShowShortcuts} icon={HelpCircle}>
                  {t.shortcuts}
                </MenuButton>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}