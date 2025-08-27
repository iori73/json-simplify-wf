'use client'

import React from 'react'
import { Monitor, Smartphone } from 'lucide-react'

interface MobileWarningProps {
  language: 'en' | 'jp' | 'es' | 'fr' | 'de' | 'zh' | 'ko' | 'pt'
}

export default function MobileWarning({ language }: MobileWarningProps) {
  const labels = {
    en: {
      title: 'Desktop Required',
      subtitle: 'JSON Simplify is optimized for desktop viewing',
      description: 'For the best experience with large JSON files and advanced features, please view this application on a desktop or laptop computer.',
      minWidth: 'Minimum screen width: 768px',
      currentWidth: 'Your current width:',
      features: [
        'Tree view with virtualization',
        'Advanced search and filtering',
        'Multi-panel validation',
        'Keyboard shortcuts',
        'Drag & drop file handling'
      ]
    },
    jp: {
      title: 'デスクトップが必要',
      subtitle: 'JSON Simplifyはデスクトップ表示に最適化されています',
      description: '大きなJSONファイルや高度な機能を最適に使用するには、デスクトップまたはラップトップコンピュータでこのアプリケーションをご覧ください。',
      minWidth: '最小画面幅: 768px',
      currentWidth: '現在の幅:',
      features: [
        '仮想化ツリービュー',
        '高度な検索とフィルタリング',
        'マルチパネル検証',
        'キーボードショートカット',
        'ドラッグ&ドロップファイル処理'
      ]
    },
    es: {
      title: 'Se Requiere Escritorio',
      subtitle: 'JSON Simplify está optimizado para visualización de escritorio',
      description: 'Para la mejor experiencia con archivos JSON grandes y funciones avanzadas, vea esta aplicación en una computadora de escritorio o portátil.',
      minWidth: 'Ancho mínimo de pantalla: 768px',
      currentWidth: 'Su ancho actual:',
      features: [
        'Vista de árbol con virtualización',
        'Búsqueda y filtrado avanzado',
        'Validación multipanel',
        'Atajos de teclado',
        'Manejo de archivos arrastrando'
      ]
    },
    fr: {
      title: 'Bureau Requis',
      subtitle: 'JSON Simplify est optimisé pour la visualisation de bureau',
      description: 'Pour la meilleure expérience avec de gros fichiers JSON et des fonctionnalités avancées, veuillez visualiser cette application sur un ordinateur de bureau ou portable.',
      minWidth: 'Largeur d\'écran minimale: 768px',
      currentWidth: 'Votre largeur actuelle:',
      features: [
        'Vue arbre avec virtualisation',
        'Recherche et filtrage avancés',
        'Validation multi-panneaux',
        'Raccourcis clavier',
        'Gestion de fichiers par glisser-déposer'
      ]
    },
    de: {
      title: 'Desktop Erforderlich',
      subtitle: 'JSON Simplify ist für Desktop-Ansicht optimiert',
      description: 'Für die beste Erfahrung mit großen JSON-Dateien und erweiterten Funktionen, verwenden Sie diese Anwendung bitte auf einem Desktop- oder Laptop-Computer.',
      minWidth: 'Minimale Bildschirmbreite: 768px',
      currentWidth: 'Ihre aktuelle Breite:',
      features: [
        'Baumansicht mit Virtualisierung',
        'Erweiterte Suche und Filterung',
        'Multi-Panel-Validierung',
        'Tastenkürzel',
        'Drag & Drop Dateiverarbeitung'
      ]
    },
    zh: {
      title: '需要桌面端',
      subtitle: 'JSON Simplify 针对桌面端查看进行了优化',
      description: '为了获得大型JSON文件和高级功能的最佳体验，请在桌面或笔记本电脑上查看此应用程序。',
      minWidth: '最小屏幕宽度：768px',
      currentWidth: '您当前的宽度：',
      features: [
        '带虚拟化的树视图',
        '高级搜索和过滤',
        '多面板验证',
        '键盘快捷键',
        '拖放文件处理'
      ]
    },
    ko: {
      title: '데스크톱 필요',
      subtitle: 'JSON Simplify는 데스크톱 보기에 최적화되었습니다',
      description: '대용량 JSON 파일과 고급 기능의 최상의 경험을 위해 데스크톱 또는 노트북 컴퓨터에서 이 애플리케이션을 보세요.',
      minWidth: '최소 화면 너비: 768px',
      currentWidth: '현재 너비:',
      features: [
        '가상화된 트리 뷰',
        '고급 검색 및 필터링',
        '다중 패널 검증',
        '키보드 단축키',
        '드래그 앤 드롭 파일 처리'
      ]
    },
    pt: {
      title: 'Desktop Necessário',
      subtitle: 'JSON Simplify é otimizado para visualização em desktop',
      description: 'Para a melhor experiência com arquivos JSON grandes e recursos avançados, visualize esta aplicação em um computador desktop ou laptop.',
      minWidth: 'Largura mínima da tela: 768px',
      currentWidth: 'Sua largura atual:',
      features: [
        'Visualização em árvore com virtualização',
        'Busca e filtragem avançadas',
        'Validação multi-painel',
        'Atalhos de teclado',
        'Manipulação de arquivos por arrastar e soltar'
      ]
    }
  }

  const t = labels[language]
  const [currentWidth, setCurrentWidth] = React.useState<number>(0)

  React.useEffect(() => {
    const updateWidth = () => setCurrentWidth(window.innerWidth)
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center space-x-4 mb-6">
            <div className="p-3 bg-muted rounded-lg">
              <Smartphone className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center">
              <div className="w-8 h-0.5 bg-muted-foreground"></div>
            </div>
            <div className="p-3 bg-primary rounded-lg">
              <Monitor className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
          <p className="text-lg text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="space-y-4 text-left bg-muted/30 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            {t.description}
          </p>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.minWidth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.currentWidth}</span>
              <span className="font-mono font-semibold">{currentWidth}px</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">
            {language === 'en' ? 'Desktop Features:' : 'デスクトップ機能:'}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground text-left">
            {t.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            {language === 'en' 
              ? 'This app will automatically adapt when you resize your browser window.'
              : 'ブラウザウィンドウのサイズを変更すると、このアプリは自動的に適応します。'
            }
          </p>
        </div>
      </div>
    </div>
  )
}