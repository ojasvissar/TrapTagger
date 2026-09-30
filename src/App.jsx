import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Checklist from "./components/Checklist.jsx";
import Skills from "./components/Skills.jsx";
import Aerial from "./components/Aerial.jsx";
import TimeZones from "./components/TimeZones.jsx";
import Trail from "./components/Trail.jsx";
import { Contact, Footer, Plan, Why } from "./components/Closing.jsx";

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <main>
        <Checklist />
        <Skills />
        <Aerial />
        <TimeZones />
        <Why />
        <Plan />
        <Contact />
      </main>
      <Footer />
      <Trail />
    </>
  );
}
