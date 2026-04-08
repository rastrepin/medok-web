import MedokHero from './components/MedokHero';
import MedokGeoSummary from './components/MedokGeoSummary';
import MedokTrustBar from './components/MedokTrustBar';
import MedokHub from './components/MedokHub';
import MedokDoctors from './components/MedokDoctors';
import MedokPackages from './components/MedokPackages';
import MedokQuiz from './components/MedokQuiz';
import MedokOnboarding from './components/MedokOnboarding';
import MedokWhy from './components/MedokWhy';
import MedokTransfer from './components/MedokTransfer';
import MedokFaq from './components/MedokFaq';
import MedokGeoBlock from './components/MedokGeoBlock';
import MedokEeat from './components/MedokEeat';
import CallbackForm from './components/CallbackForm';

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      {/* Hero — white bg */}
        <MedokHero />

        {/* 3. GEO Summary — темна зона, статичний HTML для Google */}
        <MedokGeoSummary />

        {/* 4. Trust Bar — темна зона */}
        <MedokTrustBar />

        {/* 5. Напрями — світла gray-50 */}
        <div style={{ background: 'var(--g50)', borderTop: '1px solid var(--g100)', borderBottom: '1px solid var(--g100)' }}>
          <MedokHub />
        </div>

        {/* 6. Команда — white */}
        <div id="doctors">
          <MedokDoctors />
        </div>

        {/* 7. Програми — gray-50 */}
        <div style={{ background: 'var(--g50)', borderTop: '1px solid var(--g100)', borderBottom: '1px solid var(--g100)' }}>
          <MedokPackages />
        </div>

        {/* 8. Калькулятор — темна CTA-зона */}
        <div id="quiz">
          <MedokQuiz />
        </div>

        {/* 9. Як це працює — white */}
        <MedokOnboarding />

        {/* 10. Переваги — gray-50 */}
        <div style={{ background: 'var(--g50)', borderTop: '1px solid var(--g100)', borderBottom: '1px solid var(--g100)' }}>
          <MedokWhy />
        </div>

        {/* 11. Перехід з клініки — white */}
        <div id="transfer" style={{ borderTop: '1px solid var(--g100)' }}>
          <MedokTransfer />
        </div>

        {/* 12. FAQ — gray-50 */}
        <div style={{ background: 'var(--g50)', borderTop: '1px solid var(--g100)' }}>
          <MedokFaq />
        </div>

        {/* 13. GEO-block — статичний HTML для пошукових систем */}
        <MedokGeoBlock />

        {/* 14. E-E-A-T — автор, рецензент, джерела */}
        <MedokEeat />

        {/* Callback Form — темна CTA-зона */}
        <CallbackForm />
    </>
  );
}
