'use client'

import { useState, useMemo, useCallback } from 'react'
import { Icon, getIcon } from '@iconify/react'
import { Check, Copy, Figma, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ────────────────────────────────────────────────────────────────────

type IconEntry = { id: string; name: string; category: string; keywords: string[] }
type LibDef    = { label: string; prefix: string; icons: IconEntry[] }

// ── Icon Registry ────────────────────────────────────────────────────────────

const LIBRARIES: Record<string, LibDef> = {
  lucide: {
    label: 'Lucide',
    prefix: 'lucide',
    icons: [
      // Interface
      { id: 'settings',        name: 'Settings',        category: 'Interface',      keywords: ['gear', 'config', 'preferences'] },
      { id: 'sliders',         name: 'Sliders',         category: 'Interface',      keywords: ['adjust', 'controls', 'filter'] },
      { id: 'toggle-left',     name: 'Toggle',          category: 'Interface',      keywords: ['switch', 'on', 'off'] },
      { id: 'layout-grid',     name: 'Grid',            category: 'Interface',      keywords: ['layout', 'tiles'] },
      { id: 'sidebar',         name: 'Sidebar',         category: 'Interface',      keywords: ['panel', 'drawer'] },
      { id: 'panel-top',       name: 'Panel Top',       category: 'Interface',      keywords: ['header', 'toolbar'] },
      { id: 'columns-3',       name: 'Columns',         category: 'Interface',      keywords: ['table', 'layout'] },
      { id: 'rows-3',          name: 'Rows',            category: 'Interface',      keywords: ['list', 'table'] },
      { id: 'maximize',        name: 'Maximize',        category: 'Interface',      keywords: ['fullscreen', 'expand'] },
      { id: 'minimize',        name: 'Minimize',        category: 'Interface',      keywords: ['shrink', 'collapse'] },
      // Actions
      { id: 'search',          name: 'Search',          category: 'Actions',        keywords: ['find', 'magnify', 'look'] },
      { id: 'filter',          name: 'Filter',          category: 'Actions',        keywords: ['sort', 'sieve'] },
      { id: 'plus',            name: 'Plus',            category: 'Actions',        keywords: ['add', 'create', 'new'] },
      { id: 'minus',           name: 'Minus',           category: 'Actions',        keywords: ['remove', 'delete', 'subtract'] },
      { id: 'x',               name: 'Close',           category: 'Actions',        keywords: ['close', 'remove', 'dismiss'] },
      { id: 'check',           name: 'Check',           category: 'Actions',        keywords: ['done', 'confirm', 'tick'] },
      { id: 'copy',            name: 'Copy',            category: 'Actions',        keywords: ['duplicate', 'clone'] },
      { id: 'trash',           name: 'Trash',           category: 'Actions',        keywords: ['delete', 'remove', 'bin'] },
      { id: 'pencil',          name: 'Pencil',          category: 'Actions',        keywords: ['edit', 'write', 'draw'] },
      { id: 'download',        name: 'Download',        category: 'Actions',        keywords: ['save', 'export'] },
      { id: 'upload',          name: 'Upload',          category: 'Actions',        keywords: ['send', 'import'] },
      { id: 'share-2',         name: 'Share',           category: 'Actions',        keywords: ['send', 'forward'] },
      // Navigation
      { id: 'arrow-left',      name: 'Arrow Left',      category: 'Navigation',     keywords: ['back', 'previous'] },
      { id: 'arrow-right',     name: 'Arrow Right',     category: 'Navigation',     keywords: ['forward', 'next'] },
      { id: 'arrow-up',        name: 'Arrow Up',        category: 'Navigation',     keywords: ['above', 'top'] },
      { id: 'arrow-down',      name: 'Arrow Down',      category: 'Navigation',     keywords: ['below', 'bottom'] },
      { id: 'chevron-left',    name: 'Chevron Left',    category: 'Navigation',     keywords: ['back', 'previous'] },
      { id: 'chevron-right',   name: 'Chevron Right',   category: 'Navigation',     keywords: ['forward', 'next'] },
      { id: 'chevron-up',      name: 'Chevron Up',      category: 'Navigation',     keywords: ['above', 'expand'] },
      { id: 'chevron-down',    name: 'Chevron Down',    category: 'Navigation',     keywords: ['below', 'collapse'] },
      { id: 'home',            name: 'Home',            category: 'Navigation',     keywords: ['house', 'start'] },
      { id: 'menu',            name: 'Menu',            category: 'Navigation',     keywords: ['hamburger', 'nav'] },
      // Media
      { id: 'play',            name: 'Play',            category: 'Media',          keywords: ['start', 'video', 'audio'] },
      { id: 'pause',           name: 'Pause',           category: 'Media',          keywords: ['stop', 'wait'] },
      { id: 'stop-circle',     name: 'Stop',            category: 'Media',          keywords: ['halt', 'end'] },
      { id: 'skip-back',       name: 'Skip Back',       category: 'Media',          keywords: ['rewind', 'previous'] },
      { id: 'skip-forward',    name: 'Skip Forward',    category: 'Media',          keywords: ['fast forward', 'next'] },
      { id: 'volume-2',        name: 'Volume',          category: 'Media',          keywords: ['sound', 'audio', 'speaker'] },
      { id: 'volume-x',        name: 'Mute',            category: 'Media',          keywords: ['silence', 'no sound'] },
      { id: 'image',           name: 'Image',           category: 'Media',          keywords: ['photo', 'picture'] },
      { id: 'video',           name: 'Video',           category: 'Media',          keywords: ['film', 'camera'] },
      { id: 'mic',             name: 'Mic',             category: 'Media',          keywords: ['microphone', 'record', 'audio'] },
      // Communication
      { id: 'mail',            name: 'Mail',            category: 'Communication',  keywords: ['email', 'message', 'envelope'] },
      { id: 'message-circle',  name: 'Message',         category: 'Communication',  keywords: ['chat', 'bubble', 'talk'] },
      { id: 'message-square',  name: 'Comment',         category: 'Communication',  keywords: ['chat', 'reply'] },
      { id: 'phone',           name: 'Phone',           category: 'Communication',  keywords: ['call', 'contact'] },
      { id: 'bell',            name: 'Bell',            category: 'Communication',  keywords: ['notification', 'alert', 'ring'] },
      { id: 'at-sign',         name: 'At',              category: 'Communication',  keywords: ['email', 'mention'] },
      { id: 'send',            name: 'Send',            category: 'Communication',  keywords: ['submit', 'forward', 'arrow'] },
      { id: 'inbox',           name: 'Inbox',           category: 'Communication',  keywords: ['messages', 'email', 'tray'] },
      // Files
      { id: 'file',            name: 'File',            category: 'Files',          keywords: ['document', 'paper'] },
      { id: 'file-text',       name: 'File Text',       category: 'Files',          keywords: ['document', 'note'] },
      { id: 'folder',          name: 'Folder',          category: 'Files',          keywords: ['directory', 'category'] },
      { id: 'folder-open',     name: 'Folder Open',     category: 'Files',          keywords: ['directory', 'browse'] },
      { id: 'archive',         name: 'Archive',         category: 'Files',          keywords: ['zip', 'compress', 'store'] },
      { id: 'paperclip',       name: 'Paperclip',       category: 'Files',          keywords: ['attach', 'clip'] },
      { id: 'link',            name: 'Link',            category: 'Files',          keywords: ['url', 'chain', 'href'] },
      { id: 'bookmark',        name: 'Bookmark',        category: 'Files',          keywords: ['save', 'mark', 'ribbon'] },
      // Data
      { id: 'bar-chart-2',     name: 'Bar Chart',       category: 'Data',           keywords: ['graph', 'stats', 'analytics'] },
      { id: 'line-chart',      name: 'Line Chart',      category: 'Data',           keywords: ['graph', 'trend', 'analytics'] },
      { id: 'pie-chart',       name: 'Pie Chart',       category: 'Data',           keywords: ['circle', 'donut', 'stats'] },
      { id: 'table',           name: 'Table',           category: 'Data',           keywords: ['grid', 'sheet', 'rows'] },
      { id: 'database',        name: 'Database',        category: 'Data',           keywords: ['storage', 'server', 'db'] },
      { id: 'server',          name: 'Server',          category: 'Data',           keywords: ['backend', 'cloud', 'host'] },
      { id: 'code-2',          name: 'Code',            category: 'Data',           keywords: ['dev', 'terminal', 'brackets'] },
      { id: 'terminal',        name: 'Terminal',        category: 'Data',           keywords: ['cli', 'console', 'shell'] },
      // User
      { id: 'user',            name: 'User',            category: 'User',           keywords: ['person', 'account', 'profile'] },
      { id: 'users',           name: 'Users',           category: 'User',           keywords: ['team', 'people', 'group'] },
      { id: 'user-plus',       name: 'Add User',        category: 'User',           keywords: ['invite', 'new member'] },
      { id: 'user-check',      name: 'User Check',      category: 'User',           keywords: ['verified', 'confirmed'] },
      { id: 'shield',          name: 'Shield',          category: 'User',           keywords: ['security', 'protection', 'auth'] },
      { id: 'lock',            name: 'Lock',            category: 'User',           keywords: ['secure', 'password', 'private'] },
      { id: 'key',             name: 'Key',             category: 'User',           keywords: ['access', 'auth', 'unlock'] },
      { id: 'log-in',          name: 'Log In',          category: 'User',           keywords: ['sign in', 'enter', 'login'] },
      { id: 'log-out',         name: 'Log Out',         category: 'User',           keywords: ['sign out', 'exit', 'logout'] },
      { id: 'crown',           name: 'Crown',           category: 'User',           keywords: ['admin', 'premium', 'king'] },
    ],
  },

  heroicons: {
    label: 'Heroicons',
    prefix: 'heroicons',
    icons: [
      // Interface
      { id: 'adjustments-horizontal', name: 'Adjustments',  category: 'Interface',     keywords: ['settings', 'filter', 'controls'] },
      { id: 'squares-2x2',            name: 'Grid',          category: 'Interface',     keywords: ['layout', 'apps', 'tiles'] },
      { id: 'view-columns',           name: 'Columns',       category: 'Interface',     keywords: ['layout', 'split'] },
      { id: 'rectangle-stack',        name: 'Stack',         category: 'Interface',     keywords: ['layers', 'pages'] },
      { id: 'window',                 name: 'Window',        category: 'Interface',     keywords: ['app', 'browser'] },
      { id: 'computer-desktop',       name: 'Desktop',       category: 'Interface',     keywords: ['screen', 'monitor'] },
      { id: 'device-phone-mobile',    name: 'Mobile',        category: 'Interface',     keywords: ['phone', 'smartphone'] },
      { id: 'paint-brush',            name: 'Paint Brush',   category: 'Interface',     keywords: ['design', 'color', 'draw'] },
      { id: 'cursor-arrow-rays',      name: 'Cursor',        category: 'Interface',     keywords: ['click', 'pointer', 'mouse'] },
      { id: 'swatch',                 name: 'Swatch',        category: 'Interface',     keywords: ['color', 'palette', 'theme'] },
      // Actions
      { id: 'magnifying-glass',       name: 'Search',        category: 'Actions',       keywords: ['find', 'look', 'zoom'] },
      { id: 'funnel',                 name: 'Filter',        category: 'Actions',       keywords: ['sort', 'filter', 'sieve'] },
      { id: 'plus',                   name: 'Plus',          category: 'Actions',       keywords: ['add', 'create', 'new'] },
      { id: 'minus',                  name: 'Minus',         category: 'Actions',       keywords: ['remove', 'subtract'] },
      { id: 'x-mark',                 name: 'Close',         category: 'Actions',       keywords: ['close', 'dismiss', 'cancel'] },
      { id: 'check',                  name: 'Check',         category: 'Actions',       keywords: ['done', 'confirm', 'tick'] },
      { id: 'document-duplicate',     name: 'Copy',          category: 'Actions',       keywords: ['duplicate', 'clone'] },
      { id: 'trash',                  name: 'Trash',         category: 'Actions',       keywords: ['delete', 'remove', 'bin'] },
      { id: 'pencil',                 name: 'Pencil',        category: 'Actions',       keywords: ['edit', 'write'] },
      { id: 'arrow-down-tray',        name: 'Download',      category: 'Actions',       keywords: ['save', 'export', 'get'] },
      { id: 'arrow-up-tray',          name: 'Upload',        category: 'Actions',       keywords: ['send', 'import', 'put'] },
      { id: 'share',                  name: 'Share',         category: 'Actions',       keywords: ['send', 'forward', 'export'] },
      // Navigation
      { id: 'arrow-left',             name: 'Arrow Left',    category: 'Navigation',    keywords: ['back', 'previous'] },
      { id: 'arrow-right',            name: 'Arrow Right',   category: 'Navigation',    keywords: ['forward', 'next'] },
      { id: 'arrow-up',               name: 'Arrow Up',      category: 'Navigation',    keywords: ['above', 'top'] },
      { id: 'arrow-down',             name: 'Arrow Down',    category: 'Navigation',    keywords: ['below', 'bottom'] },
      { id: 'chevron-left',           name: 'Chevron Left',  category: 'Navigation',    keywords: ['back', 'previous'] },
      { id: 'chevron-right',          name: 'Chevron Right', category: 'Navigation',    keywords: ['forward', 'next'] },
      { id: 'home',                   name: 'Home',          category: 'Navigation',    keywords: ['house', 'start'] },
      { id: 'bars-3',                 name: 'Menu',          category: 'Navigation',    keywords: ['hamburger', 'nav', 'list'] },
      // Media
      { id: 'play',                   name: 'Play',          category: 'Media',         keywords: ['start', 'video', 'audio'] },
      { id: 'pause',                  name: 'Pause',         category: 'Media',         keywords: ['stop', 'wait'] },
      { id: 'stop',                   name: 'Stop',          category: 'Media',         keywords: ['halt', 'end'] },
      { id: 'backward',               name: 'Backward',      category: 'Media',         keywords: ['rewind', 'previous'] },
      { id: 'forward',                name: 'Forward',       category: 'Media',         keywords: ['fast forward', 'next'] },
      { id: 'speaker-wave',           name: 'Volume',        category: 'Media',         keywords: ['sound', 'audio'] },
      { id: 'speaker-x-mark',         name: 'Mute',          category: 'Media',         keywords: ['silence', 'no sound'] },
      { id: 'photo',                  name: 'Photo',         category: 'Media',         keywords: ['image', 'picture'] },
      { id: 'video-camera',           name: 'Video',         category: 'Media',         keywords: ['film', 'camera'] },
      { id: 'microphone',             name: 'Microphone',    category: 'Media',         keywords: ['mic', 'record', 'audio'] },
      // Communication
      { id: 'envelope',               name: 'Email',         category: 'Communication', keywords: ['mail', 'message', 'envelope'] },
      { id: 'chat-bubble-left',       name: 'Chat',          category: 'Communication', keywords: ['message', 'bubble', 'talk'] },
      { id: 'phone',                  name: 'Phone',         category: 'Communication', keywords: ['call', 'contact'] },
      { id: 'bell',                   name: 'Bell',          category: 'Communication', keywords: ['notification', 'alert'] },
      { id: 'at-symbol',              name: 'At',            category: 'Communication', keywords: ['email', 'mention'] },
      { id: 'paper-airplane',         name: 'Send',          category: 'Communication', keywords: ['submit', 'forward'] },
      { id: 'inbox',                  name: 'Inbox',         category: 'Communication', keywords: ['messages', 'tray'] },
      { id: 'megaphone',              name: 'Megaphone',     category: 'Communication', keywords: ['announce', 'broadcast'] },
      // Files
      { id: 'document',               name: 'Document',      category: 'Files',         keywords: ['file', 'paper'] },
      { id: 'document-text',          name: 'Doc Text',      category: 'Files',         keywords: ['document', 'note', 'text'] },
      { id: 'folder',                 name: 'Folder',        category: 'Files',         keywords: ['directory', 'category'] },
      { id: 'folder-open',            name: 'Folder Open',   category: 'Files',         keywords: ['directory', 'browse'] },
      { id: 'archive-box',            name: 'Archive',       category: 'Files',         keywords: ['compress', 'store', 'zip'] },
      { id: 'paper-clip',             name: 'Paperclip',     category: 'Files',         keywords: ['attach', 'clip'] },
      { id: 'link',                   name: 'Link',          category: 'Files',         keywords: ['url', 'chain', 'href'] },
      { id: 'bookmark',               name: 'Bookmark',      category: 'Files',         keywords: ['save', 'mark'] },
      // Data
      { id: 'chart-bar',              name: 'Bar Chart',     category: 'Data',          keywords: ['graph', 'stats', 'analytics'] },
      { id: 'presentation-chart-line',name: 'Line Chart',    category: 'Data',          keywords: ['graph', 'trend', 'analytics'] },
      { id: 'table-cells',            name: 'Table',         category: 'Data',          keywords: ['grid', 'sheet', 'rows'] },
      { id: 'circle-stack',           name: 'Database',      category: 'Data',          keywords: ['storage', 'db', 'layers'] },
      { id: 'server',                 name: 'Server',        category: 'Data',          keywords: ['backend', 'cloud', 'host'] },
      { id: 'code-bracket',           name: 'Code',          category: 'Data',          keywords: ['dev', 'brackets', 'programming'] },
      { id: 'command-line',           name: 'Terminal',      category: 'Data',          keywords: ['cli', 'console', 'shell'] },
      { id: 'cpu-chip',               name: 'CPU',           category: 'Data',          keywords: ['processor', 'hardware', 'chip'] },
      // User
      { id: 'user',                   name: 'User',          category: 'User',          keywords: ['person', 'account', 'profile'] },
      { id: 'user-group',             name: 'User Group',    category: 'User',          keywords: ['team', 'people', 'group'] },
      { id: 'user-plus',              name: 'Add User',      category: 'User',          keywords: ['invite', 'new member'] },
      { id: 'shield-check',           name: 'Shield',        category: 'User',          keywords: ['security', 'protection', 'verified'] },
      { id: 'lock-closed',            name: 'Lock',          category: 'User',          keywords: ['secure', 'password', 'private'] },
      { id: 'key',                    name: 'Key',           category: 'User',          keywords: ['access', 'auth', 'unlock'] },
      { id: 'arrow-left-on-rectangle',name: 'Log In',        category: 'User',          keywords: ['sign in', 'enter', 'login'] },
      { id: 'arrow-right-on-rectangle',name: 'Log Out',      category: 'User',          keywords: ['sign out', 'exit', 'logout'] },
      { id: 'star',                   name: 'Star',          category: 'User',          keywords: ['favorite', 'rating', 'premium'] },
      { id: 'heart',                  name: 'Heart',         category: 'User',          keywords: ['like', 'love', 'favorite'] },
    ],
  },

  ph: {
    label: 'Phosphor',
    prefix: 'ph',
    icons: [
      // Interface
      { id: 'gear',             name: 'Gear',          category: 'Interface',     keywords: ['settings', 'config'] },
      { id: 'sliders',          name: 'Sliders',       category: 'Interface',     keywords: ['adjust', 'controls'] },
      { id: 'layout',           name: 'Layout',        category: 'Interface',     keywords: ['grid', 'design'] },
      { id: 'squares-four',     name: 'Grid',          category: 'Interface',     keywords: ['apps', 'tiles'] },
      { id: 'sidebar',          name: 'Sidebar',       category: 'Interface',     keywords: ['panel', 'drawer'] },
      { id: 'toggle-left',      name: 'Toggle',        category: 'Interface',     keywords: ['switch', 'on', 'off'] },
      { id: 'monitor',          name: 'Monitor',       category: 'Interface',     keywords: ['screen', 'desktop'] },
      { id: 'device-mobile',    name: 'Mobile',        category: 'Interface',     keywords: ['phone', 'smartphone'] },
      { id: 'paint-brush',      name: 'Brush',         category: 'Interface',     keywords: ['design', 'draw', 'color'] },
      { id: 'cursor',           name: 'Cursor',        category: 'Interface',     keywords: ['click', 'pointer', 'mouse'] },
      // Actions
      { id: 'magnifying-glass', name: 'Search',        category: 'Actions',       keywords: ['find', 'look', 'zoom'] },
      { id: 'funnel',           name: 'Filter',        category: 'Actions',       keywords: ['sort', 'sieve'] },
      { id: 'plus',             name: 'Plus',          category: 'Actions',       keywords: ['add', 'create', 'new'] },
      { id: 'minus',            name: 'Minus',         category: 'Actions',       keywords: ['remove', 'subtract'] },
      { id: 'x',                name: 'Close',         category: 'Actions',       keywords: ['close', 'dismiss', 'cancel'] },
      { id: 'check',            name: 'Check',         category: 'Actions',       keywords: ['done', 'confirm', 'tick'] },
      { id: 'copy',             name: 'Copy',          category: 'Actions',       keywords: ['duplicate', 'clone'] },
      { id: 'trash',            name: 'Trash',         category: 'Actions',       keywords: ['delete', 'remove', 'bin'] },
      { id: 'pencil',           name: 'Pencil',        category: 'Actions',       keywords: ['edit', 'write'] },
      { id: 'download-simple',  name: 'Download',      category: 'Actions',       keywords: ['save', 'export'] },
      { id: 'upload-simple',    name: 'Upload',        category: 'Actions',       keywords: ['send', 'import'] },
      { id: 'share',            name: 'Share',         category: 'Actions',       keywords: ['send', 'forward'] },
      // Navigation
      { id: 'arrow-left',       name: 'Arrow Left',    category: 'Navigation',    keywords: ['back', 'previous'] },
      { id: 'arrow-right',      name: 'Arrow Right',   category: 'Navigation',    keywords: ['forward', 'next'] },
      { id: 'arrow-up',         name: 'Arrow Up',      category: 'Navigation',    keywords: ['above', 'top'] },
      { id: 'arrow-down',       name: 'Arrow Down',    category: 'Navigation',    keywords: ['below', 'bottom'] },
      { id: 'caret-left',       name: 'Caret Left',    category: 'Navigation',    keywords: ['back', 'previous'] },
      { id: 'caret-right',      name: 'Caret Right',   category: 'Navigation',    keywords: ['forward', 'next'] },
      { id: 'house',            name: 'Home',          category: 'Navigation',    keywords: ['house', 'start'] },
      { id: 'list',             name: 'Menu',          category: 'Navigation',    keywords: ['hamburger', 'nav'] },
      // Media
      { id: 'play',             name: 'Play',          category: 'Media',         keywords: ['start', 'video', 'audio'] },
      { id: 'pause',            name: 'Pause',         category: 'Media',         keywords: ['stop', 'wait'] },
      { id: 'stop',             name: 'Stop',          category: 'Media',         keywords: ['halt', 'end'] },
      { id: 'skip-back',        name: 'Skip Back',     category: 'Media',         keywords: ['rewind', 'previous'] },
      { id: 'skip-forward',     name: 'Skip Forward',  category: 'Media',         keywords: ['fast forward', 'next'] },
      { id: 'speaker-high',     name: 'Volume',        category: 'Media',         keywords: ['sound', 'audio'] },
      { id: 'speaker-slash',    name: 'Mute',          category: 'Media',         keywords: ['silence', 'no sound'] },
      { id: 'image',            name: 'Image',         category: 'Media',         keywords: ['photo', 'picture'] },
      { id: 'video',            name: 'Video',         category: 'Media',         keywords: ['film', 'camera'] },
      { id: 'microphone',       name: 'Microphone',    category: 'Media',         keywords: ['mic', 'record', 'audio'] },
      // Communication
      { id: 'envelope',         name: 'Email',         category: 'Communication', keywords: ['mail', 'message'] },
      { id: 'chat',             name: 'Chat',          category: 'Communication', keywords: ['message', 'bubble', 'talk'] },
      { id: 'phone',            name: 'Phone',         category: 'Communication', keywords: ['call', 'contact'] },
      { id: 'bell',             name: 'Bell',          category: 'Communication', keywords: ['notification', 'alert'] },
      { id: 'at',               name: 'At',            category: 'Communication', keywords: ['email', 'mention'] },
      { id: 'paper-plane-tilt', name: 'Send',          category: 'Communication', keywords: ['submit', 'forward'] },
      { id: 'tray',             name: 'Inbox',         category: 'Communication', keywords: ['messages', 'tray'] },
      { id: 'megaphone',        name: 'Megaphone',     category: 'Communication', keywords: ['announce', 'broadcast'] },
      // Files
      { id: 'file',             name: 'File',          category: 'Files',         keywords: ['document', 'paper'] },
      { id: 'file-text',        name: 'File Text',     category: 'Files',         keywords: ['document', 'note', 'text'] },
      { id: 'folder',           name: 'Folder',        category: 'Files',         keywords: ['directory', 'category'] },
      { id: 'folder-open',      name: 'Folder Open',   category: 'Files',         keywords: ['directory', 'browse'] },
      { id: 'archive',          name: 'Archive',       category: 'Files',         keywords: ['compress', 'store'] },
      { id: 'paperclip',        name: 'Paperclip',     category: 'Files',         keywords: ['attach', 'clip'] },
      { id: 'link',             name: 'Link',          category: 'Files',         keywords: ['url', 'chain', 'href'] },
      { id: 'bookmark',         name: 'Bookmark',      category: 'Files',         keywords: ['save', 'mark'] },
      // Data
      { id: 'chart-bar',        name: 'Bar Chart',     category: 'Data',          keywords: ['graph', 'stats', 'analytics'] },
      { id: 'chart-line',       name: 'Line Chart',    category: 'Data',          keywords: ['graph', 'trend', 'analytics'] },
      { id: 'chart-pie',        name: 'Pie Chart',     category: 'Data',          keywords: ['circle', 'donut', 'stats'] },
      { id: 'table',            name: 'Table',         category: 'Data',          keywords: ['grid', 'sheet', 'rows'] },
      { id: 'database',         name: 'Database',      category: 'Data',          keywords: ['storage', 'db'] },
      { id: 'hard-drives',      name: 'Server',        category: 'Data',          keywords: ['backend', 'cloud', 'host'] },
      { id: 'code',             name: 'Code',          category: 'Data',          keywords: ['dev', 'brackets', 'programming'] },
      { id: 'terminal-window',  name: 'Terminal',      category: 'Data',          keywords: ['cli', 'console', 'shell'] },
      // User
      { id: 'user',             name: 'User',          category: 'User',          keywords: ['person', 'account', 'profile'] },
      { id: 'users',            name: 'Users',         category: 'User',          keywords: ['team', 'people', 'group'] },
      { id: 'user-plus',        name: 'Add User',      category: 'User',          keywords: ['invite', 'new member'] },
      { id: 'shield-check',     name: 'Shield',        category: 'User',          keywords: ['security', 'protection', 'verified'] },
      { id: 'lock',             name: 'Lock',          category: 'User',          keywords: ['secure', 'password', 'private'] },
      { id: 'key',              name: 'Key',           category: 'User',          keywords: ['access', 'auth', 'unlock'] },
      { id: 'sign-in',          name: 'Sign In',       category: 'User',          keywords: ['login', 'enter'] },
      { id: 'sign-out',         name: 'Sign Out',      category: 'User',          keywords: ['logout', 'exit'] },
      { id: 'star',             name: 'Star',          category: 'User',          keywords: ['favorite', 'rating', 'premium'] },
      { id: 'heart',            name: 'Heart',         category: 'User',          keywords: ['like', 'love', 'favorite'] },
    ],
  },

  tabler: {
    label: 'Tabler',
    prefix: 'tabler',
    icons: [
      // Interface
      { id: 'settings',         name: 'Settings',      category: 'Interface',     keywords: ['gear', 'config', 'preferences'] },
      { id: 'adjustments',      name: 'Adjust',        category: 'Interface',     keywords: ['controls', 'sliders', 'filter'] },
      { id: 'layout-grid',      name: 'Grid',          category: 'Interface',     keywords: ['tiles', 'apps', 'layout'] },
      { id: 'layout-sidebar',   name: 'Sidebar',       category: 'Interface',     keywords: ['panel', 'drawer'] },
      { id: 'layout-dashboard', name: 'Dashboard',     category: 'Interface',     keywords: ['overview', 'widgets'] },
      { id: 'device-desktop',   name: 'Desktop',       category: 'Interface',     keywords: ['screen', 'monitor'] },
      { id: 'device-mobile',    name: 'Mobile',        category: 'Interface',     keywords: ['phone', 'smartphone'] },
      { id: 'brush',            name: 'Brush',         category: 'Interface',     keywords: ['design', 'draw', 'color'] },
      { id: 'cursor-text',      name: 'Cursor',        category: 'Interface',     keywords: ['click', 'pointer', 'input'] },
      { id: 'palette',          name: 'Palette',       category: 'Interface',     keywords: ['color', 'design', 'theme'] },
      // Actions
      { id: 'search',           name: 'Search',        category: 'Actions',       keywords: ['find', 'look', 'zoom'] },
      { id: 'filter',           name: 'Filter',        category: 'Actions',       keywords: ['sort', 'sieve', 'funnel'] },
      { id: 'plus',             name: 'Plus',          category: 'Actions',       keywords: ['add', 'create', 'new'] },
      { id: 'minus',            name: 'Minus',         category: 'Actions',       keywords: ['remove', 'subtract'] },
      { id: 'x',                name: 'Close',         category: 'Actions',       keywords: ['close', 'dismiss', 'cancel'] },
      { id: 'check',            name: 'Check',         category: 'Actions',       keywords: ['done', 'confirm', 'tick'] },
      { id: 'copy',             name: 'Copy',          category: 'Actions',       keywords: ['duplicate', 'clone'] },
      { id: 'trash',            name: 'Trash',         category: 'Actions',       keywords: ['delete', 'remove', 'bin'] },
      { id: 'pencil',           name: 'Pencil',        category: 'Actions',       keywords: ['edit', 'write'] },
      { id: 'download',         name: 'Download',      category: 'Actions',       keywords: ['save', 'export'] },
      { id: 'upload',           name: 'Upload',        category: 'Actions',       keywords: ['send', 'import'] },
      { id: 'share',            name: 'Share',         category: 'Actions',       keywords: ['send', 'forward'] },
      // Navigation
      { id: 'arrow-left',       name: 'Arrow Left',    category: 'Navigation',    keywords: ['back', 'previous'] },
      { id: 'arrow-right',      name: 'Arrow Right',   category: 'Navigation',    keywords: ['forward', 'next'] },
      { id: 'arrow-up',         name: 'Arrow Up',      category: 'Navigation',    keywords: ['above', 'top'] },
      { id: 'arrow-down',       name: 'Arrow Down',    category: 'Navigation',    keywords: ['below', 'bottom'] },
      { id: 'chevron-left',     name: 'Chevron Left',  category: 'Navigation',    keywords: ['back', 'previous'] },
      { id: 'chevron-right',    name: 'Chevron Right', category: 'Navigation',    keywords: ['forward', 'next'] },
      { id: 'home',             name: 'Home',          category: 'Navigation',    keywords: ['house', 'start'] },
      { id: 'menu-2',           name: 'Menu',          category: 'Navigation',    keywords: ['hamburger', 'nav'] },
      // Media
      { id: 'player-play',      name: 'Play',          category: 'Media',         keywords: ['start', 'video', 'audio'] },
      { id: 'player-pause',     name: 'Pause',         category: 'Media',         keywords: ['stop', 'wait'] },
      { id: 'player-stop',      name: 'Stop',          category: 'Media',         keywords: ['halt', 'end'] },
      { id: 'player-skip-back', name: 'Skip Back',     category: 'Media',         keywords: ['rewind', 'previous'] },
      { id: 'player-skip-forward',name:'Skip Forward', category: 'Media',         keywords: ['fast forward', 'next'] },
      { id: 'volume',           name: 'Volume',        category: 'Media',         keywords: ['sound', 'audio', 'speaker'] },
      { id: 'volume-off',       name: 'Mute',          category: 'Media',         keywords: ['silence', 'no sound'] },
      { id: 'photo',            name: 'Photo',         category: 'Media',         keywords: ['image', 'picture'] },
      { id: 'video',            name: 'Video',         category: 'Media',         keywords: ['film', 'camera'] },
      { id: 'microphone',       name: 'Microphone',    category: 'Media',         keywords: ['mic', 'record', 'audio'] },
      // Communication
      { id: 'mail',             name: 'Email',         category: 'Communication', keywords: ['mail', 'message', 'envelope'] },
      { id: 'message',          name: 'Message',       category: 'Communication', keywords: ['chat', 'bubble', 'talk'] },
      { id: 'phone',            name: 'Phone',         category: 'Communication', keywords: ['call', 'contact'] },
      { id: 'bell',             name: 'Bell',          category: 'Communication', keywords: ['notification', 'alert'] },
      { id: 'at',               name: 'At',            category: 'Communication', keywords: ['email', 'mention'] },
      { id: 'send',             name: 'Send',          category: 'Communication', keywords: ['submit', 'forward'] },
      { id: 'inbox',            name: 'Inbox',         category: 'Communication', keywords: ['messages', 'tray'] },
      { id: 'speakerphone',     name: 'Megaphone',     category: 'Communication', keywords: ['announce', 'broadcast'] },
      // Files
      { id: 'file',             name: 'File',          category: 'Files',         keywords: ['document', 'paper'] },
      { id: 'file-text',        name: 'File Text',     category: 'Files',         keywords: ['document', 'note', 'text'] },
      { id: 'folder',           name: 'Folder',        category: 'Files',         keywords: ['directory', 'category'] },
      { id: 'folder-open',      name: 'Folder Open',   category: 'Files',         keywords: ['directory', 'browse'] },
      { id: 'archive',          name: 'Archive',       category: 'Files',         keywords: ['compress', 'store'] },
      { id: 'paperclip',        name: 'Paperclip',     category: 'Files',         keywords: ['attach', 'clip'] },
      { id: 'link',             name: 'Link',          category: 'Files',         keywords: ['url', 'chain', 'href'] },
      { id: 'bookmark',         name: 'Bookmark',      category: 'Files',         keywords: ['save', 'mark'] },
      // Data
      { id: 'chart-bar',        name: 'Bar Chart',     category: 'Data',          keywords: ['graph', 'stats', 'analytics'] },
      { id: 'chart-line',       name: 'Line Chart',    category: 'Data',          keywords: ['graph', 'trend', 'analytics'] },
      { id: 'chart-pie',        name: 'Pie Chart',     category: 'Data',          keywords: ['circle', 'donut', 'stats'] },
      { id: 'table',            name: 'Table',         category: 'Data',          keywords: ['grid', 'sheet', 'rows'] },
      { id: 'database',         name: 'Database',      category: 'Data',          keywords: ['storage', 'db'] },
      { id: 'server',           name: 'Server',        category: 'Data',          keywords: ['backend', 'cloud', 'host'] },
      { id: 'code',             name: 'Code',          category: 'Data',          keywords: ['dev', 'brackets', 'programming'] },
      { id: 'terminal-2',       name: 'Terminal',      category: 'Data',          keywords: ['cli', 'console', 'shell'] },
      // User
      { id: 'user',             name: 'User',          category: 'User',          keywords: ['person', 'account', 'profile'] },
      { id: 'users',            name: 'Users',         category: 'User',          keywords: ['team', 'people', 'group'] },
      { id: 'user-plus',        name: 'Add User',      category: 'User',          keywords: ['invite', 'new member'] },
      { id: 'shield-check',     name: 'Shield',        category: 'User',          keywords: ['security', 'protection', 'verified'] },
      { id: 'lock',             name: 'Lock',          category: 'User',          keywords: ['secure', 'password', 'private'] },
      { id: 'key',              name: 'Key',           category: 'User',          keywords: ['access', 'auth', 'unlock'] },
      { id: 'login',            name: 'Log In',        category: 'User',          keywords: ['sign in', 'enter'] },
      { id: 'logout',           name: 'Log Out',       category: 'User',          keywords: ['sign out', 'exit'] },
      { id: 'star',             name: 'Star',          category: 'User',          keywords: ['favorite', 'rating', 'premium'] },
      { id: 'heart',            name: 'Heart',         category: 'User',          keywords: ['like', 'love', 'favorite'] },
    ],
  },

  'radix-icons': {
    label: 'Radix',
    prefix: 'radix-icons',
    icons: [
      // Interface
      { id: 'gear',             name: 'Gear',          category: 'Interface',     keywords: ['settings', 'config'] },
      { id: 'mixer-horizontal', name: 'Sliders',       category: 'Interface',     keywords: ['adjust', 'controls'] },
      { id: 'dashboard',        name: 'Dashboard',     category: 'Interface',     keywords: ['overview', 'layout'] },
      { id: 'grid',             name: 'Grid',          category: 'Interface',     keywords: ['tiles', 'apps', 'layout'] },
      { id: 'layout',           name: 'Layout',        category: 'Interface',     keywords: ['panel', 'design'] },
      { id: 'desktop',          name: 'Desktop',       category: 'Interface',     keywords: ['screen', 'monitor'] },
      { id: 'mobile',           name: 'Mobile',        category: 'Interface',     keywords: ['phone', 'smartphone'] },
      { id: 'pencil-1',         name: 'Pencil',        category: 'Interface',     keywords: ['edit', 'draw'] },
      { id: 'cursor-arrow',     name: 'Cursor',        category: 'Interface',     keywords: ['click', 'pointer'] },
      { id: 'color-wheel',      name: 'Color Wheel',   category: 'Interface',     keywords: ['color', 'palette', 'hue'] },
      // Actions
      { id: 'magnifying-glass', name: 'Search',        category: 'Actions',       keywords: ['find', 'look', 'zoom'] },
      { id: 'plus',             name: 'Plus',          category: 'Actions',       keywords: ['add', 'create', 'new'] },
      { id: 'minus',            name: 'Minus',         category: 'Actions',       keywords: ['remove', 'subtract'] },
      { id: 'cross-2',          name: 'Close',         category: 'Actions',       keywords: ['close', 'dismiss', 'cancel'] },
      { id: 'check',            name: 'Check',         category: 'Actions',       keywords: ['done', 'confirm', 'tick'] },
      { id: 'copy',             name: 'Copy',          category: 'Actions',       keywords: ['duplicate', 'clone'] },
      { id: 'trash',            name: 'Trash',         category: 'Actions',       keywords: ['delete', 'remove', 'bin'] },
      { id: 'pencil-2',         name: 'Edit',          category: 'Actions',       keywords: ['write', 'modify'] },
      { id: 'download',         name: 'Download',      category: 'Actions',       keywords: ['save', 'export'] },
      { id: 'upload',           name: 'Upload',        category: 'Actions',       keywords: ['send', 'import'] },
      { id: 'share-1',          name: 'Share',         category: 'Actions',       keywords: ['send', 'forward'] },
      { id: 'reset',            name: 'Reset',         category: 'Actions',       keywords: ['refresh', 'reload', 'restart'] },
      // Navigation
      { id: 'arrow-left',       name: 'Arrow Left',    category: 'Navigation',    keywords: ['back', 'previous'] },
      { id: 'arrow-right',      name: 'Arrow Right',   category: 'Navigation',    keywords: ['forward', 'next'] },
      { id: 'arrow-up',         name: 'Arrow Up',      category: 'Navigation',    keywords: ['above', 'top'] },
      { id: 'arrow-down',       name: 'Arrow Down',    category: 'Navigation',    keywords: ['below', 'bottom'] },
      { id: 'chevron-left',     name: 'Chevron Left',  category: 'Navigation',    keywords: ['back', 'previous'] },
      { id: 'chevron-right',    name: 'Chevron Right', category: 'Navigation',    keywords: ['forward', 'next'] },
      { id: 'home',             name: 'Home',          category: 'Navigation',    keywords: ['house', 'start'] },
      { id: 'hamburger-menu',   name: 'Menu',          category: 'Navigation',    keywords: ['nav', 'list'] },
      // Media
      { id: 'play',             name: 'Play',          category: 'Media',         keywords: ['start', 'video', 'audio'] },
      { id: 'pause',            name: 'Pause',         category: 'Media',         keywords: ['stop', 'wait'] },
      { id: 'stop',             name: 'Stop',          category: 'Media',         keywords: ['halt', 'end'] },
      { id: 'track-previous',   name: 'Previous',      category: 'Media',         keywords: ['rewind', 'back'] },
      { id: 'track-next',       name: 'Next',          category: 'Media',         keywords: ['fast forward', 'next'] },
      { id: 'speaker-loud',     name: 'Volume',        category: 'Media',         keywords: ['sound', 'audio'] },
      { id: 'speaker-off',      name: 'Mute',          category: 'Media',         keywords: ['silence', 'no sound'] },
      { id: 'image',            name: 'Image',         category: 'Media',         keywords: ['photo', 'picture'] },
      { id: 'video',            name: 'Video',         category: 'Media',         keywords: ['film', 'camera'] },
      { id: 'accessibility',    name: 'Accessibility', category: 'Media',         keywords: ['a11y', 'disability'] },
      // Communication
      { id: 'envelope-closed',  name: 'Email',         category: 'Communication', keywords: ['mail', 'message'] },
      { id: 'chat-bubble',      name: 'Chat',          category: 'Communication', keywords: ['message', 'bubble', 'talk'] },
      { id: 'bell',             name: 'Bell',          category: 'Communication', keywords: ['notification', 'alert'] },
      { id: 'at-sign',          name: 'At',            category: 'Communication', keywords: ['email', 'mention'] },
      { id: 'paper-plane',      name: 'Send',          category: 'Communication', keywords: ['submit', 'forward'] },
      { id: 'inbox',            name: 'Inbox',         category: 'Communication', keywords: ['messages', 'tray'] },
      { id: 'chat-bubble-icon', name: 'Bubble',        category: 'Communication', keywords: ['talk', 'reply', 'comment'] },
      // Files
      { id: 'file',             name: 'File',          category: 'Files',         keywords: ['document', 'paper'] },
      { id: 'file-text',        name: 'File Text',     category: 'Files',         keywords: ['document', 'note'] },
      { id: 'archive',          name: 'Archive',       category: 'Files',         keywords: ['compress', 'store'] },
      { id: 'link-2',           name: 'Link',          category: 'Files',         keywords: ['url', 'chain', 'href'] },
      { id: 'bookmark',         name: 'Bookmark',      category: 'Files',         keywords: ['save', 'mark'] },
      { id: 'clip',             name: 'Clip',          category: 'Files',         keywords: ['attach', 'paperclip'] },
      { id: 'reader',           name: 'Reader',        category: 'Files',         keywords: ['doc', 'read', 'view'] },
      { id: 'stack',            name: 'Stack',         category: 'Files',         keywords: ['layers', 'pages', 'files'] },
      // Data
      { id: 'bar-chart',        name: 'Bar Chart',     category: 'Data',          keywords: ['graph', 'stats', 'analytics'] },
      { id: 'activity-log',     name: 'Activity',      category: 'Data',          keywords: ['log', 'history', 'events'] },
      { id: 'table',            name: 'Table',         category: 'Data',          keywords: ['grid', 'sheet', 'rows'] },
      { id: 'layers',           name: 'Layers',        category: 'Data',          keywords: ['stack', 'depth'] },
      { id: 'cube',             name: 'Cube',          category: 'Data',          keywords: ['3d', 'model', 'package'] },
      { id: 'code',             name: 'Code',          category: 'Data',          keywords: ['dev', 'brackets', 'programming'] },
      { id: 'terminal',         name: 'Terminal',      category: 'Data',          keywords: ['cli', 'console', 'shell'] },
      { id: 'lightning-bolt',   name: 'Lightning',     category: 'Data',          keywords: ['fast', 'power', 'energy'] },
      // User
      { id: 'person',           name: 'Person',        category: 'User',          keywords: ['user', 'account', 'profile'] },
      { id: 'backpack',         name: 'Backpack',      category: 'User',          keywords: ['bag', 'student', 'travel'] },
      { id: 'lock-closed',      name: 'Lock',          category: 'User',          keywords: ['secure', 'password', 'private'] },
      { id: 'lock-open-1',      name: 'Unlock',        category: 'User',          keywords: ['access', 'open', 'auth'] },
      { id: 'key',              name: 'Key',           category: 'User',          keywords: ['access', 'auth', 'unlock'] },
      { id: 'enter',            name: 'Enter',         category: 'User',          keywords: ['login', 'sign in'] },
      { id: 'exit',             name: 'Exit',          category: 'User',          keywords: ['logout', 'sign out'] },
      { id: 'star',             name: 'Star',          category: 'User',          keywords: ['favorite', 'rating', 'premium'] },
      { id: 'heart',            name: 'Heart',         category: 'User',          keywords: ['like', 'love', 'favorite'] },
      { id: 'face',             name: 'Face',          category: 'User',          keywords: ['avatar', 'emoji', 'emotion'] },
    ],
  },
}

const CATEGORIES = ['All', 'Interface', 'Actions', 'Navigation', 'Media', 'Communication', 'Files', 'Data', 'User']
const SIZES = [16, 20, 24, 32] as const
type Size = typeof SIZES[number]

// ── Component ────────────────────────────────────────────────────────────────

interface IconPickerProps { primaryColor: string }

const CODE_TABS = ['JSX', 'Install'] as const
type CodeTab = typeof CODE_TABS[number]

export function IconPicker({ primaryColor }: IconPickerProps) {
  const [activeLib, setActiveLib]         = useState('lucide')
  const [search, setSearch]               = useState('')
  const [activeCategory, setCategory]     = useState('All')
  const [selectedSize, setSize]           = useState<Size>(24)
  const [copiedId, setCopiedId]           = useState<string | null>(null)
  const [figmaCopiedId, setFigmaCopiedId] = useState<string | null>(null)
  const [codeTab, setCodeTab]             = useState<CodeTab>('JSX')
  const [codeCopied, setCodeCopied]       = useState(false)

  const handleLibChange = useCallback((lib: string) => {
    setActiveLib(lib)
    setSearch('')
    setCategory('All')
  }, [])

  const filtered = useMemo(() => {
    const lib = LIBRARIES[activeLib].icons
    const q   = search.toLowerCase()
    return lib.filter(e =>
      (activeCategory === 'All' || e.category === activeCategory) &&
      (!q || e.name.toLowerCase().includes(q) || e.keywords.some(k => k.includes(q)))
    )
  }, [activeLib, search, activeCategory])

  const copyIcon = useCallback((entry: IconEntry) => {
    const { prefix } = LIBRARIES[activeLib]
    const jsx = `<Icon icon="${prefix}:${entry.id}" width={${selectedSize}} />`
    navigator.clipboard.writeText(jsx)
    setCopiedId(entry.id)
    setTimeout(() => setCopiedId(null), 1500)
  }, [activeLib, selectedSize])

  const copyToFigma = useCallback(async (e: React.MouseEvent, entry: IconEntry) => {
    e.stopPropagation()
    const { prefix } = LIBRARIES[activeLib]
    const iconData = getIcon(`${prefix}:${entry.id}`)

    let svg: string
    if (iconData) {
      const { body, width = 24, height = 24 } = iconData
      const coloredBody = body.replace(/currentColor/g, primaryColor)
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${selectedSize}" height="${selectedSize}" viewBox="0 0 ${width} ${height}">${coloredBody}</svg>`
    } else {
      const res = await fetch(`https://api.iconify.design/${prefix}/${entry.id}.svg`)
      const raw = await res.text()
      svg = raw.replace(/currentColor/g, primaryColor)
    }

    await navigator.clipboard.writeText(svg)
    setFigmaCopiedId(entry.id)
    setTimeout(() => setFigmaCopiedId(null), 1500)
  }, [activeLib, primaryColor, selectedSize])

  const { prefix } = LIBRARIES[activeLib]

  const codeContent: Record<CodeTab, string> = {
    JSX:     `import { Icon } from '@iconify/react'\n\n// Example usage:\n${filtered.slice(0, 4).map(e => `<Icon icon="${prefix}:${e.id}" width={${selectedSize}} />`).join('\n')}`,
    Install: `pnpm add @iconify/react\n\n# or\nnpm install @iconify/react\nyarn add @iconify/react`,
  }

  const copyCode = () => {
    navigator.clipboard.writeText(codeContent[codeTab])
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  return (
    <div className="space-y-5">

      {/* ── Library selector ──────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(LIBRARIES).map(([id, lib]) => (
          <button
            key={id}
            onClick={() => handleLibChange(id)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
              activeLib === id
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            )}
          >
            {lib.label}
          </button>
        ))}
      </div>

      {/* ── Search + Size ─────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search icons…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-8 pr-3 text-sm outline-none transition-colors focus:border-foreground/40 placeholder:text-muted-foreground"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        <div className="flex gap-1">
          {SIZES.map(s => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={cn(
                'rounded-lg border px-2.5 py-1.5 font-mono text-xs font-medium transition-colors',
                selectedSize === s
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Category filter ───────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'rounded-lg border px-3 py-1 text-xs font-medium transition-colors',
              activeCategory === cat
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Icon grid ─────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {LIBRARIES[activeLib].label}
          </p>
          <span className="text-xs text-muted-foreground">
            {filtered.length} icon{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div
          className="max-h-[400px] overflow-y-auto bg-muted/20"
          style={{ scrollbarWidth: 'thin' }}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
              <Search className="size-5" />
              <p className="text-sm">No icons found for "{search}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(70px,1fr))] gap-px bg-border p-px sm:grid-cols-[repeat(auto-fill,minmax(80px,1fr))]">
              {filtered.map(entry => {
                const isCopied      = copiedId      === entry.id
                const isFigmaCopied = figmaCopiedId === entry.id
                return (
                  <div
                    key={entry.id}
                    className="group relative flex flex-col items-center justify-center gap-2 bg-background px-2 py-4 transition-colors"
                  >
                    <Icon
                      icon={`${prefix}:${entry.id}`}
                      width={selectedSize}
                      color={primaryColor}
                    />
                    <span className="max-w-full truncate text-[10px] text-muted-foreground">
                      {entry.id}
                    </span>

                    {/* Hover overlay — matches palette-display pattern */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/95 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => copyIcon(entry)}
                        title="Copy JSX"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-foreground/20 bg-background text-foreground shadow-sm transition-colors hover:bg-foreground hover:text-background"
                      >
                        {isCopied ? <Check className="size-3" /> : <Copy className="size-3" />}
                      </button>
                      <button
                        onClick={e => copyToFigma(e, entry)}
                        title="Copy SVG — paste directly into Figma"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-foreground/20 bg-background text-foreground shadow-sm transition-colors hover:bg-foreground hover:text-background"
                      >
                        {isFigmaCopied ? <Check className="size-3" /> : <Figma className="size-3" />}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Code panel — matches motion-picker exactly ────── */}
      <div className="overflow-hidden rounded-2xl border border-border">
        <div className="flex items-center justify-between border-b border-border">
          <div className="flex">
            {CODE_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setCodeTab(tab)}
                className={cn(
                  'relative px-4 py-2.5 text-xs font-medium transition-colors',
                  codeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab}
                {codeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-foreground" />
                )}
              </button>
            ))}
          </div>
          <button
            onClick={copyCode}
            className="mr-1 flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            {codeCopied ? <Check className="size-3" /> : <Copy className="size-3" />}
            {codeCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="max-h-56 overflow-auto bg-muted/30 p-5 font-mono text-xs leading-6 text-foreground/80">
          <code>{codeContent[codeTab]}</code>
        </pre>
      </div>

    </div>
  )
}
