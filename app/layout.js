import './globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { EffectProvider } from '../contexts/EffectContext';
import { MusicProvider } from '../contexts/MusicContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SakuraPetals from '../components/SakuraPetals';
import BambooShoots from '../components/BambooShoots';
import Danmaku from '../components/Danmaku';
import LightHalo from '../components/LightHalo';
import ClickParticles from '../components/ClickParticles';
import DesktopPet from '../components/DesktopPet';

export var metadata = {
  title: "MirrorMoon's Blog",
  description: 'Where Words Embrace the Way',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout(_ref) {
  var children = _ref.children;
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="overflow-x-hidden">
        <ThemeProvider>
          <MusicProvider><EffectProvider>
            <LightHalo />
            <SakuraPetals />
            <BambooShoots />
            <Danmaku />
            <ClickParticles />
            <DesktopPet />
            <Navbar />
            <main className="min-h-screen pt-28 lg:pt-20">{children}</main>
            <Footer />
          </EffectProvider></MusicProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
