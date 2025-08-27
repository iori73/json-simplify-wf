'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  FileText,
  Upload,
  Sparkles,
  Archive,
  CheckCircle,
  RefreshCw,
  Save,
  Share,
  Search,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import HamburgerMenu from './HamburgerMenu';

interface HeaderProps {
  onPaste: () => void;
  onUpload: (file: File) => void;
  onBeautify: () => void;
  onMinify: () => void;
  onValidate: () => void;
  onConvert: (format: 'csv' | 'yaml') => void;
  onSave: (format: 'json' | 'csv' | 'yaml') => void;
  onShare: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchPrev: () => void;
  onSearchNext: () => void;
  searchMatches: number;
  currentSearchIndex: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  language: 'en' | 'jp' | 'es' | 'fr' | 'de' | 'zh' | 'ko' | 'pt';
  onLanguageChange: (lang: 'en' | 'jp' | 'es' | 'fr' | 'de' | 'zh' | 'ko' | 'pt') => void;
  onShowShortcuts: () => void;
}

export default function Header({
  onPaste,
  onUpload,
  onBeautify,
  onMinify,
  onValidate,
  onConvert,
  onSave,
  onShare,
  searchQuery,
  onSearchChange,
  onSearchPrev,
  onSearchNext,
  searchMatches,
  currentSearchIndex,
  isDarkMode,
  onToggleTheme,
  language,
  onLanguageChange,
  onShowShortcuts,
}: HeaderProps) {
  const [showConvertMenu, setShowConvertMenu] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [languageMenuPosition, setLanguageMenuPosition] = useState({ top: 0, left: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const labels = {
    en: {
      title: 'JSON Simplify',
      paste: 'Paste',
      upload: 'Upload',
      beautify: 'Beautify',
      minify: 'Minify',
      validate: 'Validate',
      convert: 'Convert',
      save: 'Save',
      share: 'Share',
      search: 'key or value...',
      prev: 'Prev',
      next: 'Next',
      theme: 'Theme',
      language: 'Language',
      shortcuts: 'Shortcuts',
    },
    jp: {
      title: 'JSON Simplify',
      paste: '貼り付け',
      upload: 'アップロード',
      beautify: '整形',
      minify: '圧縮',
      validate: '検証',
      convert: '変換',
      save: '保存',
      share: '共有',
      search: 'キーまたは値...',
      prev: '前へ',
      next: '次へ',
      theme: 'テーマ',
      language: '言語',
      shortcuts: 'ショートカット',
    },
    es: {
      title: 'JSON Simplify',
      paste: 'Pegar',
      upload: 'Subir',
      beautify: 'Formatear',
      minify: 'Minificar',
      validate: 'Validar',
      convert: 'Convertir',
      save: 'Guardar',
      share: 'Compartir',
      search: 'clave o valor...',
      prev: 'Anterior',
      next: 'Siguiente',
      theme: 'Tema',
      language: 'Idioma',
      shortcuts: 'Atajos',
    },
    fr: {
      title: 'JSON Simplify',
      paste: 'Coller',
      upload: 'Télécharger',
      beautify: 'Formater',
      minify: 'Minifier',
      validate: 'Valider',
      convert: 'Convertir',
      save: 'Sauvegarder',
      share: 'Partager',
      search: 'clé ou valeur...',
      prev: 'Précédent',
      next: 'Suivant',
      theme: 'Thème',
      language: 'Langue',
      shortcuts: 'Raccourcis',
    },
    de: {
      title: 'JSON Simplify',
      paste: 'Einfügen',
      upload: 'Hochladen',
      beautify: 'Formatieren',
      minify: 'Minifizieren',
      validate: 'Validieren',
      convert: 'Konvertieren',
      save: 'Speichern',
      share: 'Teilen',
      search: 'Schlüssel oder Wert...',
      prev: 'Zurück',
      next: 'Weiter',
      theme: 'Design',
      language: 'Sprache',
      shortcuts: 'Tastenkürzel',
    },
    zh: {
      title: 'JSON Simplify',
      paste: '粘贴',
      upload: '上传',
      beautify: '格式化',
      minify: '压缩',
      validate: '验证',
      convert: '转换',
      save: '保存',
      share: '分享',
      search: '键或值...',
      prev: '上一个',
      next: '下一个',
      theme: '主题',
      language: '语言',
      shortcuts: '快捷键',
    },
    ko: {
      title: 'JSON Simplify',
      paste: '붙여넣기',
      upload: '업로드',
      beautify: '정리',
      minify: '압축',
      validate: '검증',
      convert: '변환',
      save: '저장',
      share: '공유',
      search: '키 또는 값...',
      prev: '이전',
      next: '다음',
      theme: '테마',
      language: '언어',
      shortcuts: '단축키',
    },
    pt: {
      title: 'JSON Simplify',
      paste: 'Colar',
      upload: 'Carregar',
      beautify: 'Formatar',
      minify: 'Minificar',
      validate: 'Validar',
      convert: 'Converter',
      save: 'Salvar',
      share: 'Compartilhar',
      search: 'chave ou valor...',
      prev: 'Anterior',
      next: 'Próximo',
      theme: 'Tema',
      language: 'Idioma',
      shortcuts: 'Atalhos',
    },
  };

  const t = labels[language];

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showLanguageMenu && !target.closest('[data-language-menu]')) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageMenu]);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section - Logo + Hamburger */}
        <div className="flex items-center space-x-3">
          {/* Hamburger Menu - Only visible on smaller screens */}
          <HamburgerMenu
            onPaste={onPaste}
            onUpload={handleUploadClick}
            onBeautify={onBeautify}
            onMinify={onMinify}
            onValidate={onValidate}
            onConvert={onConvert}
            onSave={onSave}
            onShare={onShare}
            language={language}
            onLanguageChange={onLanguageChange}
            onShowShortcuts={onShowShortcuts}
          />

          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold hidden sm:block">{t.title}</h1>
            <h1 className="text-lg font-semibold sm:hidden">JSON</h1>
          </div>

          {/* Desktop Actions - Only visible on large screens */}
          <div className="hidden lg:flex items-center space-x-1 ml-6">
            <button
              onClick={onPaste}
              className="inline-flex items-center space-x-1 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden xl:inline">{t.paste}</span>
            </button>

            <button
              onClick={handleUploadClick}
              className="inline-flex items-center space-x-1 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden xl:inline">{t.upload}</span>
            </button>

            <div className="h-6 border-l border-border mx-2" />

            <button
              onClick={onBeautify}
              className="inline-flex items-center space-x-1 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden xl:inline">{t.beautify}</span>
            </button>

            <button
              onClick={onMinify}
              className="inline-flex items-center space-x-1 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Archive className="h-4 w-4" />
              <span className="hidden xl:inline">{t.minify}</span>
            </button>

            <div className="h-6 border-l border-border mx-2" />

            <button
              onClick={onValidate}
              className="inline-flex items-center space-x-1 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <CheckCircle className="h-4 w-4" />
              <span className="hidden xl:inline">{t.validate}</span>
            </button>

            <button
              onClick={onShare}
              className="inline-flex items-center space-x-1 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Share className="h-4 w-4" />
              <span className="hidden xl:inline">{t.share}</span>
            </button>
          </div>
        </div>

        {/* Right Section - Search + Theme + Language */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Search */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-8 w-32 sm:w-40 md:w-48 lg:w-56 rounded-md border border-input bg-background pl-8 pr-2 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="hidden sm:flex items-center space-x-1">
              <button
                onClick={onSearchPrev}
                disabled={searchMatches === 0}
                className="rounded-md p-1 hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={onSearchNext}
                disabled={searchMatches === 0}
                className="rounded-md p-1 hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {searchMatches > 0 && (
              <span className="hidden md:inline text-xs text-muted-foreground whitespace-nowrap">
                {currentSearchIndex + 1} of {searchMatches}
              </span>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
            title={t.theme}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Language Selector - Desktop Only */}
          <div className="relative hidden lg:block select-none" data-language-menu>
            <button
              ref={languageButtonRef}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (languageButtonRef.current) {
                  const rect = languageButtonRef.current.getBoundingClientRect();
                  setLanguageMenuPosition({
                    top: rect.bottom + window.scrollY + 4,
                    left: rect.right - 128, // 128px is the width of the menu
                  });
                }
                setShowLanguageMenu(!showLanguageMenu);
              }}
              className="inline-flex items-center space-x-1 rounded-md px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground select-none"
            >
              <Globe className="h-4 w-4" />
              <span>{language.toUpperCase()}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {showLanguageMenu &&
              typeof window !== 'undefined' &&
              createPortal(
                <div
                  className="fixed w-32 rounded-md border bg-background p-1 shadow-xl z-[9999] max-h-64 overflow-y-auto select-none"
                  style={{
                    top: languageMenuPosition.top,
                    left: languageMenuPosition.left,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onLanguageChange('en');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent ${
                      language === 'en' ? 'bg-accent' : ''
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onLanguageChange('jp');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent ${
                      language === 'jp' ? 'bg-accent' : ''
                    }`}
                  >
                    日本語
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onLanguageChange('es');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent ${
                      language === 'es' ? 'bg-accent' : ''
                    }`}
                  >
                    Español
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onLanguageChange('fr');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent ${
                      language === 'fr' ? 'bg-accent' : ''
                    }`}
                  >
                    Français
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onLanguageChange('de');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent ${
                      language === 'de' ? 'bg-accent' : ''
                    }`}
                  >
                    Deutsch
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onLanguageChange('zh');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent ${
                      language === 'zh' ? 'bg-accent' : ''
                    }`}
                  >
                    中文
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onLanguageChange('ko');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent ${
                      language === 'ko' ? 'bg-accent' : ''
                    }`}
                  >
                    한국어
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onLanguageChange('pt');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent ${
                      language === 'pt' ? 'bg-accent' : ''
                    }`}
                  >
                    Português
                  </button>
                </div>,
                document.body,
              )}
          </div>

          {/* Shortcuts - Desktop Only */}
          <button
            onClick={onShowShortcuts}
            className="hidden lg:flex rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
            title={t.shortcuts}
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>

        {/* Hidden file input for upload */}
        <input ref={fileInputRef} type="file" accept=".json,.geojson" onChange={handleFileChange} className="hidden" />
      </div>
    </header>
  );
}
