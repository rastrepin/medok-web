import MedokNav from './components/MedokNav';
import MedokHero from './components/MedokHero';
import MedokHub from './components/MedokHub';
import MedokDoctors from './components/MedokDoctors';
import MedokPackages from './components/MedokPackages';
import MedokOnboarding from './components/MedokOnboarding';
import MedokWhy from './components/MedokWhy';
import MedokQuiz from './components/MedokQuiz';
import MedokTransfer from './components/MedokTransfer';
import MedokFaq from './components/MedokFaq';
import MedokFooter from './components/MedokFooter';

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <MedokNav />
      <main>
        <MedokHero />
        <MedokHub />
        <MedokDoctors />
        <MedokPackages />
        <MedokOnboarding />
        <MedokWhy />
        <div id="quiz" style={{ background: 'var(--g50)', borderTop: '1px solid var(--g100)', borderBottom: '1px solid var(--g100)' }}>
          <MedokQuiz />
        </div>
        <div id="transfer" style={{ borderTop: '1px solid var(--g100)' }}>
          <MedokTransfer />
        </div>
        <MedokFaq />
      </main>
      <MedokFooter />
    </>
  );
}
