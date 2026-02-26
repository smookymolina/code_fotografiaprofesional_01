import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import Events from './components/Events'
import Services from './components/Services'
import InvitationBuilder from './components/InvitationBuilder'
import Testimonials from './components/Testimonials'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'

export default function App() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Portfolio />
        <Events />
        <Services />
        <InvitationBuilder />
        <Testimonials />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
