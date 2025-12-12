import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => (
    <div id="main-layout-container">
        <Header />
        <main id="content-container">
            {children}
        </main>
        <Footer />
    </div>
);
export default Layout;