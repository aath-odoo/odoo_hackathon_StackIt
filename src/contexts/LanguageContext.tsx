import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.ask': 'Ask Question',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'questions.title': 'All Questions',
    'questions.ask': 'Ask Question',
    'profile.questions': 'Questions',
    'profile.answers': 'Answers',
    'profile.activity': 'Activity',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications'
  },
  es: {
    'nav.home': 'Inicio',
    'nav.ask': 'Hacer Pregunta',
    'nav.profile': 'Perfil',
    'nav.settings': 'Configuración',
    'nav.login': 'Iniciar Sesión',
    'nav.logout': 'Cerrar Sesión',
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'questions.title': 'Todas las Preguntas',
    'questions.ask': 'Hacer Pregunta',
    'profile.questions': 'Preguntas',
    'profile.answers': 'Respuestas',
    'profile.activity': 'Actividad',
    'settings.theme': 'Tema',
    'settings.language': 'Idioma',
    'settings.notifications': 'Notificaciones'
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.ask': 'Poser une Question',
    'nav.profile': 'Profil',
    'nav.settings': 'Paramètres',
    'nav.login': 'Se Connecter',
    'nav.logout': 'Se Déconnecter',
    'common.loading': 'Chargement...',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'questions.title': 'Toutes les Questions',
    'questions.ask': 'Poser une Question',
    'profile.questions': 'Questions',
    'profile.answers': 'Réponses',
    'profile.activity': 'Activité',
    'settings.theme': 'Thème',
    'settings.language': 'Langue',
    'settings.notifications': 'Notifications'
  },
  de: {
    'nav.home': 'Startseite',
    'nav.ask': 'Frage Stellen',
    'nav.profile': 'Profil',
    'nav.settings': 'Einstellungen',
    'nav.login': 'Anmelden',
    'nav.logout': 'Abmelden',
    'common.loading': 'Laden...',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'questions.title': 'Alle Fragen',
    'questions.ask': 'Frage Stellen',
    'profile.questions': 'Fragen',
    'profile.answers': 'Antworten',
    'profile.activity': 'Aktivität',
    'settings.theme': 'Design',
    'settings.language': 'Sprache',
    'settings.notifications': 'Benachrichtigungen'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.language) {
        setLanguage(settings.language);
      }
    }
  }, []);

  const t = (key: string): string => {
    const translation = translations[language as keyof typeof translations]?.[key as keyof typeof translations['en']];
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}