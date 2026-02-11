import { useTranslation } from 'react-i18next';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useSettingsStore } from '../stores/useSettingsStore';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { language, textOnly, fontSize, isPremium, setLanguage, setTextOnly, setFontSize } = useSettingsStore();

  function handleLanguageChange(lang: 'en' | 'fr') {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  }

  return (
    <div className="pb-20">
      <Header title={t('settings.title')} />

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Language */}
        <Card>
          <h3 className="text-sm text-rpg-muted mb-3">{t('settings.language')}</h3>
          <div className="flex gap-2">
            <Button
              variant={language === 'en' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleLanguageChange('en')}
            >
              English
            </Button>
            <Button
              variant={language === 'fr' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleLanguageChange('fr')}
            >
              Français
            </Button>
          </div>
        </Card>

        {/* Text Only */}
        <Card>
          <div className="flex justify-between items-center">
            <h3 className="text-sm text-rpg-muted">{t('settings.textOnly')}</h3>
            <button
              onClick={() => setTextOnly(!textOnly)}
              className={`w-12 h-6 rounded-full transition-colors ${textOnly ? 'bg-rpg-accent' : 'bg-rpg-border'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${textOnly ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </Card>

        {/* Font Size */}
        <Card>
          <h3 className="text-sm text-rpg-muted mb-3">{t('settings.fontSize')}</h3>
          <div className="flex gap-2">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <Button
                key={size}
                variant={fontSize === size ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFontSize(size)}
              >
                {size.toUpperCase()}
              </Button>
            ))}
          </div>
        </Card>

        {/* Premium */}
        <Card>
          <h3 className="text-sm text-rpg-muted mb-2">{t('settings.premium')}</h3>
          {isPremium ? (
            <span className="text-rpg-gold font-bold">{t('premium.active')}</span>
          ) : (
            <div>
              <p className="text-sm mb-3">{t('premium.description')}</p>
              <Button variant="gold" size="md">
                {t('premium.unlock')} - {t('premium.price')}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
