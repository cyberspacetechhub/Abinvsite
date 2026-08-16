# Internationalization (i18n) Implementation

## Overview
This implementation provides internationalization support for 50 languages using react-i18next.

## Features
- 50 language support with automatic browser language detection
- Language switcher component with flags and native names
- Persistent language selection in localStorage
- Fallback to English if translation missing
- Professional UI integration

## Usage

### In Components
```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.loading')}</h1>
      <p>{t('auth.welcomeBack')}</p>
    </div>
  );
};
```

### Language Switcher
```jsx
import LanguageSwitcher from '../common/LanguageSwitcher';

// Add to any component
<LanguageSwitcher />
```

## Translation Keys Structure
- `common.*` - Common UI elements (loading, error, success, etc.)
- `auth.*` - Authentication related text
- `navigation.*` - Navigation menu items
- `deposit.*` - Deposit functionality
- `withdrawal.*` - Withdrawal functionality
- `investment.*` - Investment functionality
- `positions.*` - Trading positions
- `profile.*` - User profile
- `notifications.*` - Notifications
- `dashboard.*` - Dashboard content
- `errors.*` - Error messages
- `success.*` - Success messages

## Supported Languages
English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, Hindi, Turkish, Polish, Dutch, Swedish, Danish, Norwegian, Finnish, Czech, Hungarian, Romanian, Bulgarian, Croatian, Slovak, Slovenian, Estonian, Latvian, Lithuanian, Ukrainian, Belarusian, Macedonian, Albanian, Serbian, Bosnian, Maltese, Irish, Welsh, Icelandic, Faroese, Luxembourgish, Romansh, Basque, Catalan, Galician, Occitan, Corsican, Sardinian, Friulian, Ligurian

## Adding New Translations
1. Add translation key to `locales/en.json`
2. Update other language files as needed
3. Use `t('key.path')` in components

## Language Detection
- Checks localStorage first
- Falls back to browser language
- Defaults to English if no match found